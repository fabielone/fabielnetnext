import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/businesses/[id] - Get a specific business
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
    
    const business = await prisma.business.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        services: {
          orderBy: { createdAt: 'desc' },
        },
        complianceTasks: {
          select: {
            id: true,
            title: true,
            description: true,
            taskType: true,
            dueDate: true,
            status: true,
            completedAt: true,
            completedByType: true,
            priority: true,
          },
          orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
        },
        notes: {
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
          take: 10,
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
        formationOrder: {
          select: {
            id: true,
            orderId: true,
            status: true,
            companyName: true,
            totalAmount: true,
            createdAt: true,
            questionnaire: {
              select: {
                id: true,
                status: true,
                currentSection: true,
                createdAt: true,
                accessToken: true,
              }
            }
          }
        }
      }
    })
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

// PATCH /api/businesses/[id] - Update a business
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Verify ownership
    const existing = await prisma.business.findFirst({
      where: { id, ownerId: user.id }
    })
    
    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
    const {
      name,
      businessAddress,
      businessCity,
      businessZip,
      phone,
      email,
      website,
      einNumber,
    } = body
    
    const business = await prisma.business.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(businessAddress !== undefined && { businessAddress }),
        ...(businessCity !== undefined && { businessCity }),
        ...(businessZip !== undefined && { businessZip }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(einNumber !== undefined && { einNumber }),
      }
    })
    
    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

// DELETE /api/businesses/[id] - Delete a business
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    
    // Verify ownership
    const existing = await prisma.business.findFirst({
      where: { id, ownerId: user.id }
    })
    
    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
    await prisma.business.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}
