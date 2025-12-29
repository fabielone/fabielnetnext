import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

const BUCKET_NAME = 'avatars'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// Helper to get Supabase client
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }
  
  return createClient(url, key)
}

// POST /api/auth/avatar - Upload avatar
export async function POST(request: Request) {
  try {
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Get current user to check for existing avatar
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { avatarUrl: true },
    })

    const supabase = getSupabaseClient()

    // Delete old avatar if exists
    if (user?.avatarUrl) {
      const oldPath = extractPathFromUrl(user.avatarUrl)
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath])
      }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${session.userId}/${Date.now()}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    const avatarUrl = urlData.publicUrl

    // Update user record
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        avatarUrl,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      avatarUrl,
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/avatar - Remove avatar
export async function DELETE() {
  try {
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { avatarUrl: true },
    })

    const supabase = getSupabaseClient()

    // Delete from storage if exists
    if (user?.avatarUrl) {
      const path = extractPathFromUrl(user.avatarUrl)
      if (path) {
        await supabase.storage.from(BUCKET_NAME).remove([path])
      }
    }

    // Update user record
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        avatarUrl: null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar removed',
    })
  } catch (error) {
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    )
  }
}

// Helper to extract file path from Supabase URL
function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}
