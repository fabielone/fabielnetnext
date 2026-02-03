import { NextResponse } from 'next/server'
import { invalidateSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    await invalidateSession()
    
    // Also explicitly clear the cookie in the response
    const response = NextResponse.json({ success: true })
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
      expires: new Date(0),
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
