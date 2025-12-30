import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadAvatar } from '@/lib/storage'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type

    // Upload avatar
    const result = await uploadAvatar(user.id, buffer, mimeType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Update user's avatar URL in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: result.url }
    })

    return NextResponse.json({ 
      success: true,
      url: result.url 
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear user's avatar URL in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}
