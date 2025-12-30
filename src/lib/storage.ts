import { supabaseAdmin } from './supabase-admin'
import sharp from 'sharp'

// Bucket configurations
export const BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  BUSINESS_IMAGES: 'business-images',
} as const

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS]

// File size limits in bytes
const FILE_SIZE_LIMITS: Record<BucketName, number> = {
  [BUCKETS.DOCUMENTS]: 10 * 1024 * 1024, // 10 MB
  [BUCKETS.AVATARS]: 2 * 1024 * 1024, // 2 MB
  [BUCKETS.BUSINESS_IMAGES]: 5 * 1024 * 1024, // 5 MB
}

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<BucketName, string[]> = {
  [BUCKETS.DOCUMENTS]: ['application/pdf', 'image/png', 'image/jpeg'],
  [BUCKETS.AVATARS]: ['image/png', 'image/jpeg', 'image/webp'],
  [BUCKETS.BUSINESS_IMAGES]: ['image/png', 'image/jpeg', 'image/webp'],
}

// Image dimensions
const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  avatar: { width: 256, height: 256 },
  businessImage: { width: 600, height: 400 }, // 3:2 aspect ratio for allies page
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

/**
 * Validate file before upload
 */
function validateFile(bucket: BucketName, file: Buffer, mimeType: string): { valid: boolean; error?: string } {
  // Check file size
  if (file.length > FILE_SIZE_LIMITS[bucket]) {
    const limitMB = FILE_SIZE_LIMITS[bucket] / (1024 * 1024)
    return { valid: false, error: `File size exceeds ${limitMB}MB limit` }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES[bucket].includes(mimeType)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES[bucket].join(', ')}` 
    }
  }

  return { valid: true }
}

/**
 * Process avatar image - resize to 256x256 and convert to webp
 */
export async function processAvatarImage(file: Buffer): Promise<Buffer> {
  return sharp(file)
    .resize(IMAGE_DIMENSIONS.avatar.width, IMAGE_DIMENSIONS.avatar.height, { 
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toBuffer()
}

/**
 * Process business image - resize to 600x400 (3:2 aspect) and convert to webp
 */
export async function processBusinessImage(file: Buffer): Promise<Buffer> {
  return sharp(file)
    .resize(IMAGE_DIMENSIONS.businessImage.width, IMAGE_DIMENSIONS.businessImage.height, { 
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 80 })
    .toBuffer()
}

/**
 * Upload avatar for a user
 */
export async function uploadAvatar(userId: string, file: Buffer, mimeType: string): Promise<UploadResult> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Storage not configured' }
  }

  const validation = validateFile(BUCKETS.AVATARS, file, mimeType)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  try {
    // Process image
    const processedImage = await processAvatarImage(file)
    const path = `${userId}.webp`

    // Upload to Supabase
    const { error } = await supabaseAdmin.storage
      .from(BUCKETS.AVATARS)
      .upload(path, processedImage, {
        contentType: 'image/webp',
        upsert: true, // Replace existing avatar
      })

    if (error) {
      console.error('Avatar upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKETS.AVATARS)
      .getPublicUrl(path)

    return { 
      success: true, 
      url: urlData.publicUrl,
      path 
    }
  } catch (error) {
    console.error('Avatar processing error:', error)
    return { success: false, error: 'Failed to process image' }
  }
}

/**
 * Upload business image (logo/photo)
 */
export async function uploadBusinessImage(businessId: string, file: Buffer, mimeType: string): Promise<UploadResult> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Storage not configured' }
  }

  const validation = validateFile(BUCKETS.BUSINESS_IMAGES, file, mimeType)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  try {
    // Process image
    const processedImage = await processBusinessImage(file)
    const path = `${businessId}.webp`

    // Upload to Supabase
    const { error } = await supabaseAdmin.storage
      .from(BUCKETS.BUSINESS_IMAGES)
      .upload(path, processedImage, {
        contentType: 'image/webp',
        upsert: true, // Replace existing image
      })

    if (error) {
      console.error('Business image upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKETS.BUSINESS_IMAGES)
      .getPublicUrl(path)

    return { 
      success: true, 
      url: urlData.publicUrl,
      path 
    }
  } catch (error) {
    console.error('Business image processing error:', error)
    return { success: false, error: 'Failed to process image' }
  }
}

/**
 * Upload document (PDF, images) for an order
 */
export async function uploadDocument(
  orderId: string, 
  fileName: string,
  file: Buffer, 
  mimeType: string
): Promise<UploadResult> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Storage not configured' }
  }

  const validation = validateFile(BUCKETS.DOCUMENTS, file, mimeType)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  try {
    const path = `orders/${orderId}/${fileName}`

    // Upload to Supabase (no processing for documents)
    const { error } = await supabaseAdmin.storage
      .from(BUCKETS.DOCUMENTS)
      .upload(path, file, {
        contentType: mimeType,
        upsert: true,
      })

    if (error) {
      console.error('Document upload error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, path }
  } catch (error) {
    console.error('Document upload error:', error)
    return { success: false, error: 'Failed to upload document' }
  }
}

/**
 * Generate a signed URL for private documents
 */
export async function getSignedDocumentUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
  if (!supabaseAdmin) {
    return null
  }

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKETS.DOCUMENTS)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Signed URL error:', error)
    return null
  }

  return data.signedUrl
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: BucketName, path: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false
  }

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Delete file error:', error)
    return false
  }

  return true
}

/**
 * List documents for an order
 */
export async function listOrderDocuments(orderId: string): Promise<string[]> {
  if (!supabaseAdmin) {
    return []
  }

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKETS.DOCUMENTS)
    .list(`orders/${orderId}`)

  if (error) {
    console.error('List documents error:', error)
    return []
  }

  return data.map(file => file.name)
}
