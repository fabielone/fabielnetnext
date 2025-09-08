import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from 'src/lib/magic-link'

export const runtime = 'nodejs'

async function authorize(req: NextRequest, orderId: string) {
  const { searchParams } = new URL(req.url)
  const t = searchParams.get('t')
  if (!t) return { ok: false, res: NextResponse.json({ error: 'Missing token' }, { status: 401 }) }
  const payload = await verifyToken(t)
  const email = payload.email
  if (!email) return { ok: false, res: NextResponse.json({ error: 'Token missing email' }, { status: 400 }) }
  const { default: prisma } = await import('src/lib/prisma')
  const order = await prisma.order.findUnique({ where: { orderId }, select: { id: true, contactEmail: true } })
  if (!order) return { ok: false, res: NextResponse.json({ error: 'Order not found' }, { status: 404 }) }
  if (order.contactEmail.toLowerCase() !== email.toLowerCase()) {
    return { ok: false, res: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) }
  }
  return { ok: true, prisma, order }
}

export async function GET(req: NextRequest, context: { params: Promise<{ orderId: string }> } | any) {
  try {
    const params = typeof context?.params?.then === 'function' ? await context.params : context.params
    const orderId = params.orderId
    const auth = await authorize(req, orderId)
    if (!('ok' in auth) || !auth.ok) return (auth as any).res
    const { prisma, order } = auth as any
    const docs = await prisma.document.findMany({
      where: { orderId: order.id },
      orderBy: { generatedAt: 'desc' },
      select: { id: true, documentType: true, fileName: true, filePath: true, isFinal: true, isLatest: true, generatedAt: true }
    })
    return NextResponse.json({ documents: docs })
  } catch (e: any) {
    console.error('documents GET error:', e)
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ orderId: string }> } | any) {
  try {
    const params = typeof context?.params?.then === 'function' ? await context.params : context.params
    const orderId = params.orderId
    const auth = await authorize(req, orderId)
    if (!('ok' in auth) || !auth.ok) return (auth as any).res
    const { prisma, order } = auth as any

    // Expect JSON body with metadata and a pre-uploaded file path (for simplicity)
    // In production, use signed uploads (e.g., S3 direct upload) and save the returned key
    const body = await req.json()
    const { documentType, fileName, filePath, fileSize } = body as { documentType: string; fileName: string; filePath: string; fileSize?: number }
    if (!documentType || !fileName || !filePath) {
      return NextResponse.json({ error: 'Missing document fields' }, { status: 400 })
    }

    const created = await prisma.document.create({
      data: {
        orderId: order.id,
        documentType: documentType as any,
        fileName,
        filePath,
        fileSize: fileSize ?? null,
        isLatest: true,
      },
      select: { id: true }
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (e: any) {
    console.error('documents POST error:', e)
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
