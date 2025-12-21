import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, createSession, setSessionCookie } from '@/lib/auth'

// Login API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user
    const user = await getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if user has a password (might be OAuth-only user)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'This account uses social login. Please sign in with Google.' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }
    
    // Create session
    const { sessionToken } = await createSession(
      user.id,
      request.headers.get('x-forwarded-for') ?? undefined,
      request.headers.get('user-agent') ?? undefined
    )
    
    // Set session cookie
    await setSessionCookie(sessionToken)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    )
  }
}
