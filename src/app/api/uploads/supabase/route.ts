import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from 'src/lib/supabase-admin'
import { verifyToken } from 'src/lib/magic-link'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t')
    if (!t) return NextResponse.json({ error: 'Missing token' }, { status: 401 })
    const payload = await verifyToken(t)
    if (!payload.email) return NextResponse.json({ error: 'Token missing email' }, { status: 400 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = String(formData.get('folder') || 'uploads')
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })

    const ext = file.name.split('.').pop() || 'bin'
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { data, error } = await supabaseAdmin.storage.from('public').upload(key, Buffer.from(arrayBuffer), {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: pub } = supabaseAdmin.storage.from('public').getPublicUrl(key)

    return NextResponse.json({ key, url: pub.publicUrl })
  } catch (e: any) {
    console.error('supabase upload error:', e)
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
