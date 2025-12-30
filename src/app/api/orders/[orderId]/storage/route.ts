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

    // List documents from Supabase storage
    const storageDocuments = await listOrderDocuments(orderId)

    // Generate signed URLs for each document
    const documentsWithUrls = await Promise.all(
      storageDocuments.map(async (fileName) => {
        const path = `orders/${orderId}/${fileName}`
        const signedUrl = await getSignedDocumentUrl(path)
        return {
          fileName,
          path,
          url: signedUrl
        }
      })
    )

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
