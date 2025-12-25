import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/auth/onboarding - Complete or skip onboarding
export async function POST(request: Request) {
  try {
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, referralSource, businessGoals, skipped } = body

    // Update user with onboarding data
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (skipped) {
      updateData.onboardingSkippedAt = new Date()
    } else {
      updateData.onboardingCompleted = true
    }

    if (phone?.trim()) {
      updateData.phone = phone.trim()
    }

    if (referralSource) {
      updateData.referralSource = referralSource
    }

    if (businessGoals) {
      updateData.businessGoals = businessGoals
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      skipped: !!skipped,
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}

// GET /api/auth/onboarding - Check onboarding status
export async function GET() {
  try {
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        onboardingCompleted: true,
        onboardingSkippedAt: true,
        createdViaCheckout: true,
        welcomeShown: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      onboardingSkipped: !!user.onboardingSkippedAt,
      createdViaCheckout: user.createdViaCheckout,
      welcomeShown: user.welcomeShown,
      needsOnboarding: !user.onboardingCompleted && !user.onboardingSkippedAt && !user.createdViaCheckout,
    })
  } catch (error) {
    console.error('Onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to get onboarding status' },
      { status: 500 }
    )
  }
}
