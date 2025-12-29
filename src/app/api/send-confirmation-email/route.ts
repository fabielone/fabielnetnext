import { NextResponse } from 'next/server'
import { signToken } from 'src/lib/magic-link'

export const runtime = 'nodejs'

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 400) {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e: any) {
      lastErr = e
      const msg = e?.message || ''
      const rateLimited = msg.includes('Too many requests') || e?.statusCode === 429
      if (!rateLimited || i === attempts - 1) break
      const delay = baseDelayMs * Math.pow(2, i)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw lastErr
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get('content-type') || ''
    if (!ct.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 })
    }
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const {
      orderId,
      email,
      companyName,
      customerName,
      totalAmount,
    } = body as {
      orderId: string
      email: string
      companyName?: string
      customerName?: string
      totalAmount?: number
    }

    const url = new URL(req.url)
    if (url.searchParams.get('debug') === '1') {
      return NextResponse.json({
        ok: true,
        env: {
          hasResend: !!process.env.RESEND_API_KEY,
          hasFrom: !!process.env.FROM_EMAIL,
          nodeEnv: process.env.NODE_ENV,
          hasEmailSecret: !!process.env.EMAIL_LINK_SECRET,
        }
      })
    }

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Missing orderId or email' }, { status: 400 })
    }

    console.log('[send-confirmation-email] Received', { orderId, email, companyName, customerName, totalAmount })

    // Backfill from DB if values are missing
    let resolvedCompany = companyName
    let resolvedCustomer = customerName
    let resolvedAmount = totalAmount
    let questionnaireAccessToken: string | null = null
    
    const { default: prisma } = await import('src/lib/prisma')
    
    // Always fetch from DB to get questionnaire token
    const db = await prisma.order.findUnique({
      where: { orderId },
      select: {
        id: true,
        companyName: true,
        contactFirstName: true,
        contactLastName: true,
        totalAmount: true,
        contactEmail: true,
      }
    })
    
    if (db) {
      if (!resolvedCompany) resolvedCompany = db.companyName
      if (!resolvedCustomer) resolvedCustomer = [db.contactFirstName, db.contactLastName].filter(Boolean).join(' ') || email
      if (typeof resolvedAmount !== 'number' && db.totalAmount) resolvedAmount = Number(db.totalAmount)
      // Optional: ensure email matches
      if (db.contactEmail && db.contactEmail.toLowerCase() !== email.toLowerCase()) {
        console.warn('[send-confirmation-email] Email mismatch between payload and order record')
      }
      
      // Get questionnaire access token
      const questionnaire = await prisma.questionnaireResponse.findUnique({
        where: { orderId: db.id },
        select: { accessToken: true }
      })
      if (questionnaire?.accessToken) {
        questionnaireAccessToken = questionnaire.accessToken
      }
    }

    // Send order confirmation
    const { sendLLCConfirmation, sendQuestionnaireLink } = await import('src/lib/email-service')

    const dashboardToken = await signToken({ orderId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
    const confirmResp = await withRetry(() => sendLLCConfirmation({
      email,
      companyName: resolvedCompany || 'Your Company',
      customerName: resolvedCustomer || email,
      orderId,
      totalAmount: resolvedAmount ?? 0,
      token: dashboardToken,
    }))

    console.log('[send-confirmation-email] Confirmation sent', confirmResp)

    // Send questionnaire link (only if we have the questionnaire access token)
    if (questionnaireAccessToken) {
      const questionnaireResp = await withRetry(() => sendQuestionnaireLink({
        email,
        customerName: resolvedCustomer || email,
        companyName: resolvedCompany || 'Your Company',
        orderId,
        questionnaires: [
          'Business Details Questionnaire',
          'Members & Ownership Questionnaire',
          'Operating Agreement Preferences',
        ],
        token: questionnaireAccessToken || undefined,
      }))

      console.log('[send-confirmation-email] Questionnaire sent', questionnaireResp)
    } else {
      console.warn('[send-confirmation-email] No questionnaire token found, skipping questionnaire email')
    }

    return NextResponse.json({ success: true, token: questionnaireAccessToken || dashboardToken })
  } catch (err: any) {
    console.error('send-confirmation-email error:', err)
    const message = typeof err?.message === 'string' ? err.message : String(err)
    const name = err?.name
    const stack = process.env.NODE_ENV !== 'production' ? err?.stack : undefined
    return NextResponse.json({ error: message, name, stack }, { status: 500 })
  }
}
