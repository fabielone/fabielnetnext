import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }
    
    // Get user's businesses count
    const businessCount = await prisma.business.count({
      where: { ownerId: user.id }
    })
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        role: user.role,
        businessCount,
        // Onboarding fields
        onboardingCompleted: user.onboardingCompleted,
        onboardingSkippedAt: user.onboardingSkippedAt,
        createdViaCheckout: user.createdViaCheckout,
        welcomeShown: user.welcomeShown,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}
