import { NextRequest, NextResponse } from 'next/server'
import prisma from 'src/lib/prisma'
import { verifyToken } from 'src/lib/magic-link'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> } | any
) {
  try {
    const params = typeof context?.params?.then === 'function' ? await context.params : context.params
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t')
    const orderId = params.orderId

    // Optional auth fallback (very light): allow if email header matches order email
    // In a real setup, validate session via your auth provider and map to user email
    let allow = false
    let tokenEmail: string | undefined
    if (t) {
      const payload = await verifyToken(t)
      if (payload.orderId !== orderId) {
        return NextResponse.json({ error: 'Invalid token order' }, { status: 403 })
      }
      tokenEmail = payload.email
      allow = true
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { orderId },
      select: {
        orderId: true,
        companyName: true,
        businessAddress: true,
        businessCity: true,
        businessState: true,
        businessZip: true,
        businessPurpose: true,
        contactFirstName: true,
        contactLastName: true,
        contactEmail: true,
        contactPhone: true,
        needEIN: true,
        needOperatingAgreement: true,
        needBankLetter: true,
        registeredAgent: true,
        compliance: true,
        websiteService: true,
      }
    })

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // If token email is present, ensure it matches order email
    if (tokenEmail && order.contactEmail && tokenEmail.toLowerCase() !== order.contactEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Token-email mismatch' }, { status: 403 })
    }

    if (!allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ order })
  } catch (e: any) {
    console.error('orders GET error:', e)
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
