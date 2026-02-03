import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadDocument, listOrderDocuments, getSignedDocumentUrl } from '@/lib/storage'
import prisma from '@/lib/prisma'

// POST - Upload document for an order (authenticated users)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: { orderId, userId: user.id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = formData.get('documentType') as string || 'document'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type

    // Generate filename
    const ext = file.name.split('.').pop() || 'pdf'
    const fileName = `${documentType}-${Date.now()}.${ext}`

    // Upload document to Supabase storage
    const result = await uploadDocument(orderId, fileName, buffer, mimeType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Also create a Document record in the database
    await prisma.document.create({
      data: {
        orderId: order.id,
        documentType: documentType.toUpperCase().replace(/-/g, '_') as any,
        fileName,
        filePath: result.path!,
        generatedAt: new Date(),
        isFinal: true,
        isLatest: true,
      }
    })

    return NextResponse.json({ 
      success: true,
      path: result.path,
      fileName
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

// GET - List documents for an order with signed URLs (authenticated users)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: { orderId, userId: user.id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // First, get documents from the database (more reliable)
    const dbDocuments = await prisma.document.findMany({
      where: { orderId: order.id },
      orderBy: { generatedAt: 'desc' }
    })

    // Generate signed URLs for database documents
    const documentsWithUrls = await Promise.all(
      dbDocuments.map(async (doc) => {
        let url: string | null = null
        
        if (doc.filePath) {
          // Check if filePath is already a full URL (public bucket) or relative path (private bucket)
          if (doc.filePath.startsWith('http://') || doc.filePath.startsWith('https://')) {
            // Already a public URL - use directly
            url = doc.filePath
          } else {
            // Relative path - generate signed URL
            url = await getSignedDocumentUrl(doc.filePath)
          }
        }
        
        return {
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          path: doc.filePath,
          url,
          generatedAt: doc.generatedAt
        }
      })
    )

    // Also check storage directly for any files not in DB
    // Note: Files are stored under the order's database ID, not the orderId string
    const storageDocuments = await listOrderDocuments(order.id)
    const dbFilePaths = new Set(dbDocuments.map(d => d.filePath))
    
    // Add storage-only documents (not in DB)
    for (const fileName of storageDocuments) {
      const path = `orders/${order.id}/${fileName}`
      if (!dbFilePaths.has(path)) {
        const signedUrl = await getSignedDocumentUrl(path)
        documentsWithUrls.push({
          id: null,
          fileName,
          documentType: 'OTHER',
          path,
          url: signedUrl,
          generatedAt: null
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      documents: documentsWithUrls
    })
  } catch (error) {
    console.error('List documents error:', error)
    return NextResponse.json(
      { error: 'Failed to list documents' },
      { status: 500 }
    )
  }
}
