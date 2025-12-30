import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all publicly listed businesses (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const mode = searchParams.get('mode')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause = {
      isPublicListed: true,
      status: 'ACTIVE' as const, // Only show active businesses
      ...(category && category !== 'Todas' && { publicCategory: category }),
      ...(location && location !== 'Todas' && { publicLocation: location }),
      ...(mode && mode !== 'Todas' && { publicMode: mode }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { publicDescription: { contains: search, mode: 'insensitive' as const } },
          { publicLocation: { contains: search, mode: 'insensitive' as const } },
          { publicCategory: { contains: search, mode: 'insensitive' as const } },
          { publicTags: { has: search } },
        ]
      }),
    }

    // Get total count for pagination
    const totalCount = await prisma.business.count({ where: whereClause })

    const businesses = await prisma.business.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        publicDescription: true,
        publicImageUrl: true,
        publicCategory: true,
        publicTags: true,
        publicLocation: true,
        publicLink: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    // Get unique categories and locations for filters
    const allBusinesses = await prisma.business.findMany({
      where: { isPublicListed: true, status: 'ACTIVE' },
      select: {
        publicCategory: true,
        publicLocation: true,
      },
    })

    const categories = Array.from(new Set(allBusinesses.map(b => b.publicCategory).filter((c): c is string => c !== null)))
    const locations = Array.from(new Set(allBusinesses.map(b => b.publicLocation).filter((l): l is string => l !== null)))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
      filters: {
        categories,
        locations,
      }
    })
  } catch (error) {
    console.error('Error fetching public businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}
