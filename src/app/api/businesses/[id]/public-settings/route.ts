import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Get business public listing settings
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
      where: { id, ownerId: user.id },
      select: {
        id: true,
        name: true,
        status: true,
        state: true,
        website: true,
        isPublicListed: true,
        publicDescription: true,
        publicImageUrl: true,
        publicCategory: true,
        publicTags: true,
        publicLocation: true,
        publicLink: true,
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({ settings: business })
  } catch (error) {
    console.error('Error fetching business settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PATCH - Update business public listing settings
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
      isPublicListed,
      publicDescription,
      publicCategory,
      publicTags,
      publicLocation,
      publicLink,
    } = body

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: {
        ...(isPublicListed !== undefined && { isPublicListed }),
        ...(publicDescription !== undefined && { publicDescription }),
        ...(publicCategory !== undefined && { publicCategory }),
        ...(publicTags !== undefined && { publicTags }),
        ...(publicLocation !== undefined && { publicLocation }),
        ...(publicLink !== undefined && { publicLink }),
      },
      select: {
        id: true,
        name: true,
        status: true,
        website: true,
        isPublicListed: true,
        publicDescription: true,
        publicImageUrl: true,
        publicCategory: true,
        publicTags: true,
        publicLocation: true,
        publicLink: true,
      }
    })

    return NextResponse.json({ settings: updatedBusiness })
  } catch (error) {
    console.error('Error updating business settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
