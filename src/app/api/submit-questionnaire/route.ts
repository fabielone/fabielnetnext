import { NextResponse } from 'next/server'
import { sendQuestionnaireLink } from 'src/lib/email-service'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let data: any = {}

    if (contentType.includes('application/json')) {
      data = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData()
      form.forEach((value, key) => { (data as any)[key] = value })
    } else if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      form.forEach((value, key) => { (data as any)[key] = value })
    }

    const { orderId, email, companyName, customerName } = data

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // TODO: persist questionnaire answers in DB (Prisma/Supabase)

    // Acknowledge submission via email (optional)
    if (email && companyName) {
      await sendQuestionnaireLink({
        email,
        customerName: customerName || email,
        companyName,
        orderId,
        questionnaires: ['Thanks! We received your answers. We will follow up shortly.']
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('submit-questionnaire error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to submit questionnaire' }, { status: 500 })
  }
}
