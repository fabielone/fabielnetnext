import { NextResponse } from 'next/server'
import prisma from 'src/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderId,
      companyName,
      businessAddress,
      businessCity,
      businessState = 'CA',
      businessZip,
      businessPurpose,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      needEIN = true,
      needOperatingAgreement = true,
      needBankLetter = true,
      registeredAgent = false,
      compliance = false,
      websiteService = null,
      totalAmount,
    } = body

    if (!orderId || !companyName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await prisma.order.upsert({
      where: { orderId },
      update: {
        companyName,
        businessAddress,
        businessCity,
        businessState,
        businessZip,
        businessPurpose,
        contactFirstName,
        contactLastName,
        contactEmail,
        contactPhone,
        needEIN,
        needOperatingAgreement,
        needBankLetter,
        registeredAgent,
        compliance,
        websiteService,
        totalAmount,
      },
      create: {
        orderId,
        companyName,
        businessAddress,
        businessCity,
        businessState,
        businessZip,
        businessPurpose,
        contactFirstName,
        contactLastName,
        contactEmail,
        contactPhone,
        needEIN,
        needOperatingAgreement,
        needBankLetter,
        registeredAgent,
        compliance,
        websiteService,
        totalAmount,
      }
    })

    return NextResponse.json({ order })
  } catch (e: any) {
    console.error('orders/save POST error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to save order' }, { status: 500 })
  }
}
