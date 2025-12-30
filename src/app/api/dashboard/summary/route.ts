import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/dashboard/summary - Get dashboard summary for current user
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get all stats in parallel
    const [
      totalBusinesses,
      activeBusinesses,
      pendingTasks,
      upcomingEvents,
      totalDocuments,
      activeServices,
      recentOrders
    ] = await Promise.all([
      // Total businesses
      prisma.business.count({
        where: { ownerId: user.id }
      }),
      
      // Active businesses
      prisma.business.count({
        where: { ownerId: user.id, status: 'ACTIVE' }
      }),
      
      // Pending tasks (from PendingTask table - tasks not yet completed)
      prisma.pendingTask.count({
        where: {
          userId: user.id,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      }),
      
      // Upcoming events (next 30 days)
      prisma.businessEvent.count({
        where: {
          business: { ownerId: user.id },
          status: { in: ['UPCOMING', 'IN_PROGRESS'] },
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Total documents
      prisma.businessDocument.count({
        where: {
          business: { ownerId: user.id }
        }
      }),
      
      // Active services
      prisma.businessService.count({
        where: {
          business: { ownerId: user.id },
          status: 'ACTIVE'
        }
      }),
      
      // Recent orders
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderId: true,
          companyName: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        }
      })
    ])
    
    return NextResponse.json({
      summary: {
        totalBusinesses,
        activeBusinesses,
        pendingTasks,
        upcomingEvents,
        totalDocuments,
        activeServices,
      },
      recentOrders: recentOrders.map(o => ({
        ...o,
        totalAmount: o.totalAmount.toString(),
        createdAt: o.createdAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    )
  }
}
