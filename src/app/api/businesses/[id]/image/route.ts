import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadBusinessImage } from '@/lib/storage'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: businessId } = await params

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { id: businessId, ownerId: user.id }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type

    // Upload business image
    const result = await uploadBusinessImage(businessId, buffer, mimeType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Update business's public image URL in database
    await prisma.business.update({
      where: { id: businessId },
      data: { publicImageUrl: result.url }
    })

    return NextResponse.json({ 
      success: true,
      url: result.url 
    })
  } catch (error) {
    console.error('Business image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: businessId } = await params

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { id: businessId, ownerId: user.id }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Clear business's public image URL in database
    await prisma.business.update({
      where: { id: businessId },
      data: { publicImageUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Business image delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
