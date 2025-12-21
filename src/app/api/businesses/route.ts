import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/businesses - Get all businesses for the current user
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const businesses = await prisma.business.findMany({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: {
            documents: true,
            events: true,
            services: true,
            complianceTasks: true,
          }
        },
        complianceTasks: {
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE'] }
          },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Transform data for frontend
    const transformedBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.name,
      legalName: b.legalName,
      entityType: b.entityType,
      state: b.state,
      status: b.status,
      formationDate: b.formationDate?.toISOString() || null,
      einNumber: b.einNumber,
      businessAddress: b.businessAddress,
      businessCity: b.businessCity,
      businessZip: b.businessZip,
      phone: b.phone,
      email: b.email,
      website: b.website,
      isExisting: b.isExisting,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      documentCount: b._count.documents,
      eventCount: b._count.events,
      serviceCount: b._count.services,
      taskCount: b._count.complianceTasks,
      pendingTaskCount: b.complianceTasks.length,
    }))
    
    return NextResponse.json({ businesses: transformedBusinesses })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST /api/businesses - Create a new business
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const {
      name,
      entityType = 'LLC',
      state = 'CA',
      isExisting = false,
      businessAddress,
      businessCity,
      businessZip,
      phone,
      email,
      einNumber,
      formationDate,
    } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }
    
    const business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name,
        legalName: entityType === 'LLC' ? `${name} LLC` : name,
        entityType,
        state,
        status: isExisting ? 'ACTIVE' : 'PENDING',
        isExisting,
        businessAddress,
        businessCity,
        businessZip,
        phone,
        email,
        einNumber,
        formationDate: formationDate ? new Date(formationDate) : null,
      }
    })
    
    // If it's an existing business, create default compliance tasks
    if (isExisting) {
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      nextYear.setMonth(3) // April
      nextYear.setDate(15)
      
      await prisma.complianceTask.createMany({
        data: [
          {
            businessId: business.id,
            title: 'Annual Report (Statement of Information)',
            description: 'File your Statement of Information with the California Secretary of State',
            taskType: 'ANNUAL_REPORT',
            dueDate: nextYear,
            status: 'PENDING',
          },
          {
            businessId: business.id,
            title: 'Franchise Tax',
            description: 'Pay California Franchise Tax ($800 minimum)',
            taskType: 'FRANCHISE_TAX',
            dueDate: new Date(new Date().getFullYear() + 1, 3, 15),
            status: 'PENDING',
          }
        ]
      })
    }
    
    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
