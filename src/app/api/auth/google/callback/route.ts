import { NextRequest, NextResponse } from 'next/server'
import { findOrCreateOAuthUser, createSession, setSessionCookie } from '@/lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = process.env.NEXTAUTH_URL 
  ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const stateParam = searchParams.get('state') || '{}'
  
  // Parse state to get locale and redirect
  let locale = 'en'
  let customRedirect = ''
  try {
    const state = JSON.parse(stateParam)
    locale = state.locale || 'en'
    customRedirect = state.redirect || ''
  } catch {
    // If state is not JSON (legacy format), treat it as locale
    locale = stateParam
  }
  
  // Error from Google
  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL(`/${locale}/login?error=oauth_error`, request.url))
  }
  
  // No code - redirect to Google OAuth
  if (!code) {
    const state = JSON.stringify({ locale, redirect: customRedirect })
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'email profile')
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'select_account')
    googleAuthUrl.searchParams.set('state', state)
    
    return NextResponse.redirect(googleAuthUrl)
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(new URL(`/${locale}/login?error=token_exchange_failed`, request.url))
    }
    
    const tokens = await tokenResponse.json()
    
    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info')
      return NextResponse.redirect(new URL(`/${locale}/login?error=user_info_failed`, request.url))
    }
    
    const googleUser = await userInfoResponse.json()
    
    // Find or create user
    const user = await findOrCreateOAuthUser(
      'GOOGLE',
      googleUser.id,
      googleUser.email,
      googleUser.given_name || googleUser.name?.split(' ')[0] || 'User',
      googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
      googleUser.picture
    )
    
    // Create session
    const { sessionToken } = await createSession(
      user.id,
      request.headers.get('x-forwarded-for') ?? undefined,
      request.headers.get('user-agent') ?? undefined
    )
    
    // Set session cookie
    await setSessionCookie(sessionToken)
    
    // Redirect to custom URL if provided (e.g., checkout flow), otherwise dashboard
    if (customRedirect) {
      // Ensure redirect starts with /
      let redirectPath = customRedirect.startsWith('/') ? customRedirect : `/${customRedirect}`
      
      // Check if path already has a locale prefix (e.g., /en/dashboard, /es/checkout)
      const localePattern = /^\/[a-z]{2}(\/|$)/
      if (!localePattern.test(redirectPath)) {
        // Add locale prefix only if not already present
        redirectPath = `/${locale}${redirectPath}`
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL(`/${locale}/login?error=oauth_failed`, request.url))
  }
}
