import { NextResponse } from 'next/server'
import prisma from 'src/lib/prisma'
import { createQuestionnaireForOrder } from '@/lib/questionnaire/service'
import { validateSession } from '@/lib/auth'

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
      formationState,
    } = body

    // Use formationState if provided, otherwise fall back to businessState
    const stateForFormation = formationState || businessState

    if (!orderId || !companyName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try to get the current authenticated user
    let userId: string | null = null
    try {
      const session = await validateSession()
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // User not authenticated - that's fine, we'll try to find by email
    }

    // If no session, try to find user by email
    if (!userId) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: contactEmail }
      })
      if (userByEmail) {
        userId = userByEmail.id
      }
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
        formationState: stateForFormation,
        ...(userId && { userId }), // Link user if we found one
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
        formationState: stateForFormation,
        ...(userId && { userId }), // Link user if we found one
      }
    })

    // Create questionnaire for the order (only if user is linked)
    let questionnaireToken: string | null = null
    if (order.userId) {
      try {
        const questionnaire = await createQuestionnaireForOrder(order.id)
        if (questionnaire) {
          questionnaireToken = questionnaire.accessToken
        }
      } catch (questErr) {
        console.error('Failed to create questionnaire (order saved):', questErr)
        // Continue - order was saved, questionnaire can be created later
      }
    }

    return NextResponse.json({ order, questionnaireToken })
  } catch (e: any) {
    console.error('orders/save POST error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to save order' }, { status: 500 })
  }
}
