const secret = process.env.EMAIL_LINK_SECRET ?? (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : '')

function b64url(input: Buffer | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function b64urlJson(obj: any) {
  return b64url(Buffer.from(JSON.stringify(obj)))
}

export function signToken(payload: Record<string, any>) {
  if (!secret) throw new Error('EMAIL_LINK_SECRET not set')
  const header = { alg: 'HS256', typ: 'JWT' }
  const h = b64urlJson(header)
  const p = b64urlJson(payload)
  const data = `${h}.${p}`
  return hmacSha256Base64Url(secret, data).then((s) => `${data}.${s}`)
}

export async function verifyToken(token: string) {
  if (!secret) throw new Error('EMAIL_LINK_SECRET not set')
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  const [h, p, s] = parts
  const expected = await hmacSha256Base64Url(secret, `${h}.${p}`)
  if (s !== expected) throw new Error('Invalid signature')
  const payload = JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
  if (payload.exp && Date.now() > payload.exp) throw new Error('Token expired')
  return payload as { orderId: string; email?: string; exp?: number }
}

async function hmacSha256Base64Url(key: string, data: string): Promise<string> {
  // Use Web Crypto if available
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.subtle) {
      const enc = new TextEncoder()
      const cryptoKey = await (globalThis as any).crypto.subtle.importKey(
        'raw',
        enc.encode(key),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const sig = await (globalThis as any).crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
      const buf = Buffer.from(sig as ArrayBuffer)
      return b64url(buf)
    }
  } catch (_) {
    // Fall through to Node
  }

  // Node.js fallback via dynamic import to avoid bundling in edge
  const { createHmac } = await import('crypto')
  const sig = createHmac('sha256', key).update(data).digest()
  return b64url(sig)
}
