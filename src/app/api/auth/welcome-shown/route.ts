import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/auth/welcome-shown - Mark welcome modal as shown
export async function POST() {
  try {
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        welcomeShown: true,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome shown error:', error)
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    )
  }
}
