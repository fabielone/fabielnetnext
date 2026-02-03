'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  avatarUrl?: string
  phone?: string
  role: string
  businessCount: number
  // Onboarding fields
  onboardingCompleted?: boolean
  onboardingSkippedAt?: string | null
  createdViaCheckout?: boolean
  welcomeShown?: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

type RegisterData = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        // Non-OK response (404, 500, HTML error page) — treat as unauthenticated
        setUser(null)
        return
      }

      // Only parse JSON when the response is OK
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data.user || null)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      let data: any = {}
      try {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) data = await res.json()
      } catch (e) {
        console.error('Failed to parse login response as JSON', e)
      }

      if (!res.ok) {
        return { success: false, error: (data && data.error) || 'Login failed' }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
        credentials: 'include',
      })
      let data: any = {}
      try {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) data = await res.json()
      } catch (e) {
        console.error('Failed to parse register response as JSON', e)
      }

      if (!res.ok) {
        return { success: false, error: (data && data.error) || 'Registration failed' }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      // Don't redirect here - let the calling component handle it
      // This prevents double redirects
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user on error
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
