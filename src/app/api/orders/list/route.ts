import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from 'src/lib/magic-link'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t')
    if (!t) return NextResponse.json({ error: 'Missing token' }, { status: 401 })
    const payload = await verifyToken(t)
    const email = payload.email
    if (!email) return NextResponse.json({ error: 'Token missing email' }, { status: 400 })

    const { default: prisma } = await import('src/lib/prisma')
    const orders = await prisma.order.findMany({
      where: { contactEmail: email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        companyName: true,
        totalAmount: true,
        status: true,
        websiteService: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ orders })
  } catch (e: any) {
    console.error('orders list error:', e)
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
