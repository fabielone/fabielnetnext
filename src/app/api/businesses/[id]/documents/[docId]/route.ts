import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getSignedDocumentUrl } from '@/lib/storage'

// GET - Get signed URL for a business document (from BusinessDocument or Order's Document)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: businessId, docId } = await params

    // Verify business ownership and get formation order
    const business = await prisma.business.findFirst({
      where: { id: businessId, ownerId: user.id },
      include: { formationOrder: { select: { id: true } } }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // First try to find in BusinessDocument table
    let document = await prisma.businessDocument.findFirst({
      where: { id: docId, businessId }
    })

    let fileName: string
    let filePath: string | null = null
    let name: string

    if (document) {
      fileName = document.fileName
      filePath = document.filePath
      name = document.name
    } else if (business.formationOrder) {
      // Try to find in Order's Document table
      const orderDocument = await prisma.document.findFirst({
        where: { id: docId, orderId: business.formationOrder.id }
      })

      if (!orderDocument) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }

      fileName = orderDocument.fileName
      filePath = orderDocument.filePath
      name = orderDocument.documentType.replace(/_/g, ' ')
    } else {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (!filePath) {
      return NextResponse.json({ error: 'Document file not available' }, { status: 404 })
    }

    let downloadUrl: string | null = null

    // Check if filePath is already a full URL (public bucket) or relative path (private bucket)
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // Already a public URL - use directly
      downloadUrl = filePath
    } else {
      // Relative path - generate signed URL from Supabase (1 hour expiry)
      downloadUrl = await getSignedDocumentUrl(filePath, 3600)
    }

    if (!downloadUrl) {
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      url: downloadUrl,
      fileName: fileName,
      name: name
    })
  } catch (error) {
    console.error('Document download error:', error)
    return NextResponse.json({ error: 'Failed to get document' }, { status: 500 })
  }
}
