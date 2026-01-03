import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/dashboard/orders/[id] - Get a specific order for the authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        orderId: true,
        companyName: true,
        formationState: true,
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
        basePrice: true,
        registeredAgentPrice: true,
        compliancePrice: true,
        websiteSetupFee: true,
        stateFilingFee: true,
        rushFee: true,
        totalAmount: true,
        status: true,
        priority: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentDate: true,
        stateFilingDate: true,
        stateFilingNumber: true,
        ein: true,
        einIssuedDate: true,
        articlesGenerated: true,
        operatingAgreementGenerated: true,
        bankLetterGenerated: true,
        einObtained: true,
        rushProcessing: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
        customerNotes: true,
        business: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        questionnaire: {
          select: {
            id: true,
            status: true,
            currentSection: true,
          }
        }
      }
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
