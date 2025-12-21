import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const REDIRECT_URI = process.env.NEXTAUTH_URL 
  ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get('locale') || 'en'
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
  googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'email profile')
  googleAuthUrl.searchParams.set('access_type', 'offline')
  googleAuthUrl.searchParams.set('prompt', 'select_account')
  googleAuthUrl.searchParams.set('state', locale) // Pass locale in state
  
  return NextResponse.redirect(googleAuthUrl)
}
