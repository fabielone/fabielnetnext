import { cookies } from 'next/headers'
import prisma from './prisma'
import { randomBytes, createHash } from 'crypto'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_DURATION_DAYS = 30

// Password hashing using built-in crypto
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  const inputHash = createHash('sha256').update(password + salt).digest('hex')
  return hash === inputHash
}

// Session management
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)
  
  const session = await prisma.userSession.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })
  
  return { session, sessionToken }
}

export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60, // 30 days in seconds
  })
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null
}

export async function validateSession() {
  const sessionToken = await getSessionToken()
  if (!sessionToken) return null
  
  const session = await prisma.userSession.findUnique({
    where: { sessionToken },
    include: { user: true },
  })
  
  if (!session) return null
  if (session.expiresAt < new Date()) {
    // Session expired, delete it
    await prisma.userSession.delete({ where: { id: session.id } })
    return null
  }
  
  return session
}

export async function getCurrentUser() {
  const session = await validateSession()
  return session?.user ?? null
}

export async function invalidateSession() {
  const sessionToken = await getSessionToken()
  if (sessionToken) {
    await prisma.userSession.deleteMany({ where: { sessionToken } })
  }
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Token generation for password reset and email verification
export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createPasswordResetToken(email: string) {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry
  
  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } })
  
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })
  
  return token
}

export async function createEmailVerificationToken(email: string) {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry
  
  // Delete any existing tokens for this email
  await prisma.emailVerificationToken.deleteMany({ where: { email } })
  
  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })
  
  return token
}

// User lookup
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

// OAuth helpers
export async function findOrCreateOAuthUser(
  provider: 'GOOGLE' | 'FACEBOOK' | 'APPLE',
  providerAccountId: string,
  email: string,
  firstName: string,
  lastName: string,
  avatarUrl?: string
) {
  // Check if OAuth account already exists
  const existingOAuth = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: { user: true },
  })
  
  if (existingOAuth) {
    return existingOAuth.user
  }
  
  // Check if user with this email exists
  const existingUser = await getUserByEmail(email)
  
  if (existingUser) {
    // Link OAuth to existing user
    await prisma.oAuthAccount.create({
      data: {
        userId: existingUser.id,
        provider,
        providerAccountId,
      },
    })
    return existingUser
  }
  
  // Create new user with OAuth account
  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstName,
      lastName,
      avatarUrl,
      emailVerified: true, // OAuth users are verified by provider
      oauthAccounts: {
        create: {
          provider,
          providerAccountId,
        },
      },
    },
  })
  
  return newUser
}
