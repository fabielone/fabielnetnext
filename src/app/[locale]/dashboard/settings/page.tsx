'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useAuth } from '@/app/components/providers/AuthProvider'
import {
  RiArrowLeftLine,
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiLockLine,
  RiCameraLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiLoader4Line,
  RiBankCardLine,
  RiAddLine,
  RiStarLine,
  RiStarFill
} from 'react-icons/ri'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SavedPaymentMethod {
  id: string
  provider: string
  type: string
  cardBrand: string | null
  cardLast4: string | null
  cardExpMonth: number | null
  cardExpYear: number | null
  paypalEmail: string | null
  isDefault: boolean
  nickname: string | null
  createdAt: string
}

interface PasswordStrength {
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

// Card brand icons mapping
const cardBrandIcons: Record<string, string> = {
  visa: '💳 Visa',
  mastercard: '💳 Mastercard',
  amex: '💳 Amex',
  discover: '💳 Discover',
  diners: '💳 Diners',
  jcb: '💳 JCB',
  unionpay: '💳 UnionPay',
}

// Add Card Form Component
function AddCardForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess: () => void
  onCancel: () => void 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [setAsDefault, setSetAsDefault] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // 1. Create SetupIntent
      const setupRes = await fetch('/api/dashboard/payment-methods/setup-intent', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (!setupRes.ok) {
        throw new Error('Failed to create setup intent')
      }
      
      const { clientSecret } = await setupRes.json()
      
      // 2. Confirm the SetupIntent with the card
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }
      
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })
      
      if (stripeError) {
        throw new Error(stripeError.message)
      }
      
      if (!setupIntent?.payment_method) {
        throw new Error('Payment method not created')
      }
      
      // 3. Save the payment method to our database
      const saveRes = await fetch('/api/dashboard/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethodId: setupIntent.payment_method,
          setAsDefault,
          nickname: nickname || null
        })
      })
      
      if (!saveRes.ok) {
        const data = await saveRes.json()
        throw new Error(data.error || 'Failed to save payment method')
      }
      
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nickname (optional)
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g., Personal Card, Business Card"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={setAsDefault}
          onChange={(e) => setSetAsDefault(e.target.checked)}
          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700">Set as default payment method</span>
      </label>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !stripe}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RiLoader4Line className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <RiAddLine className="w-4 h-4" />
              Add Card
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function SettingsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payment'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([])
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState<string | null>(null)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, authLoading, router, locale])

  const checkPasswordStrength = useCallback((password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    })
  }, [])

  // Fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    setLoadingPaymentMethods(true)
    try {
      const res = await fetch('/api/dashboard/payment-methods', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setPaymentMethods(data.paymentMethods || [])
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoadingPaymentMethods(false)
    }
  }, [])

  // Load payment methods when tab is active
  useEffect(() => {
    if (activeTab === 'payment' && user) {
      fetchPaymentMethods()
    }
  }, [activeTab, user, fetchPaymentMethods])

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    
    setDeletingPaymentMethodId(id)
    try {
      const res = await fetch(`/api/dashboard/payment-methods/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== id))
        setMessage({ type: 'success', text: 'Payment method removed' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to remove payment method' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove payment method' })
    } finally {
      setDeletingPaymentMethodId(null)
    }
  }

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/payment-methods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ setAsDefault: true })
      })
      
      if (res.ok) {
        setPaymentMethods(prev => prev.map(pm => ({
          ...pm,
          isDefault: pm.id === id
        })))
        setMessage({ type: 'success', text: 'Default payment method updated' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to update payment method' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update payment method' })
    }
  }

  const handleCardAdded = () => {
    setShowAddCard(false)
    fetchPaymentMethods()
    setMessage({ type: 'success', text: 'Payment method added successfully!' })
  }

  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName?.charAt(0)?.toUpperCase() || ''
    const last = user.lastName?.charAt(0)?.toUpperCase() || ''
    return first + last || user.email?.charAt(0)?.toUpperCase() || '?'
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' })
      return
    }

    setIsUploadingAvatar(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        await refreshUser()
        setMessage({ type: 'success', text: 'Profile picture updated!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/avatar', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await refreshUser()
        setMessage({ type: 'success', text: 'Profile picture removed' })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to remove image' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove image' })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        await refreshUser()
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    // Validate
    const isPasswordValid = Object.values(passwordStrength).every(Boolean)
    if (!isPasswordValid) {
      setMessage({ type: 'error', text: 'New password does not meet requirements' })
      setIsSaving(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setIsSaving(false)
      return
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setPasswordStrength({
          hasMinLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        })
        setMessage({ type: 'success', text: 'Password updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update password' })
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and security</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <RiCheckLine className="w-5 h-5 flex-shrink-0" />
            ) : (
              <RiAlertLine className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto p-1 hover:bg-black/5 rounded"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RiUserLine className="w-4 h-4" />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RiShieldCheckLine className="w-4 h-4" />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'payment'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RiBankCardLine className="w-4 h-4" />
                Payment Methods
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                            {getInitials()}
                          </div>
                        )}
                      </div>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <RiLoader4Line className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        onClick={handleAvatarClick}
                        disabled={isUploadingAvatar}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <RiCameraLine className="w-4 h-4" />
                        Upload Photo
                      </button>
                      {user.avatarUrl && (
                        <button
                          onClick={handleRemoveAvatar}
                          disabled={isUploadingAvatar}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, firstName: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative">
                        <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, lastName: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RiLoader4Line className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <RiCheckLine className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.current ? (
                          <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                          checkPasswordStrength(e.target.value)
                        }}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.new ? (
                          <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {[
                        { key: 'hasMinLength', label: 'At least 8 characters' },
                        { key: 'hasUpperCase', label: 'One uppercase letter' },
                        { key: 'hasLowerCase', label: 'One lowercase letter' },
                        { key: 'hasNumber', label: 'One number' },
                        { key: 'hasSpecialChar', label: 'One special character' },
                      ].map((req) => (
                        <div key={req.key} className="flex items-center gap-2">
                          {passwordStrength[req.key as keyof PasswordStrength] ? (
                            <RiCheckLine className="w-4 h-4 text-green-500" />
                          ) : (
                            <RiCloseLine className="w-4 h-4 text-gray-300" />
                          )}
                          <span
                            className={`text-xs ${
                              passwordStrength[req.key as keyof PasswordStrength]
                                ? 'text-green-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                          passwordData.confirmPassword &&
                          passwordData.newPassword !== passwordData.confirmPassword
                            ? 'border-red-300'
                            : passwordData.confirmPassword &&
                              passwordData.newPassword === passwordData.confirmPassword
                            ? 'border-green-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.confirm ? (
                          <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                      )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        isSaving ||
                        !passwordData.currentPassword ||
                        !Object.values(passwordStrength).every(Boolean) ||
                        passwordData.newPassword !== passwordData.confirmPassword
                      }
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <RiLoader4Line className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <RiShieldCheckLine className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Additional Security Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Verified</p>
                        <p className="text-xs text-gray-500">Your email address status</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your saved payment methods for faster checkout
                    </p>
                  </div>
                  {!showAddCard && (
                    <button
                      onClick={() => setShowAddCard(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      <RiAddLine className="w-4 h-4" />
                      Add Card
                    </button>
                  )}
                </div>

                {/* Add Card Form */}
                {showAddCard && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Add New Card</h4>
                    <Elements stripe={stripePromise}>
                      <AddCardForm 
                        onSuccess={handleCardAdded}
                        onCancel={() => setShowAddCard(false)}
                      />
                    </Elements>
                  </div>
                )}

                {/* Payment Methods List */}
                {loadingPaymentMethods ? (
                  <div className="flex items-center justify-center py-8">
                    <RiLoader4Line className="w-6 h-6 animate-spin text-amber-600" />
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <RiBankCardLine className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">No payment methods saved</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add a card to speed up your checkout process
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          pm.isDefault 
                            ? 'border-amber-300 bg-amber-50/50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <RiBankCardLine className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {pm.nickname || cardBrandIcons[pm.cardBrand || ''] || `${pm.cardBrand || 'Card'}`}
                              </span>
                              {pm.isDefault && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              •••• {pm.cardLast4}
                              {pm.cardExpMonth && pm.cardExpYear && (
                                <span className="ml-2">
                                  Expires {pm.cardExpMonth.toString().padStart(2, '0')}/{pm.cardExpYear.toString().slice(-2)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!pm.isDefault && (
                            <button
                              onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Set as default"
                            >
                              <RiStarLine className="w-5 h-5" />
                            </button>
                          )}
                          {pm.isDefault && (
                            <div className="p-2 text-amber-500">
                              <RiStarFill className="w-5 h-5" />
                            </div>
                          )}
                          <button
                            onClick={() => handleDeletePaymentMethod(pm.id)}
                            disabled={deletingPaymentMethodId === pm.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove"
                          >
                            {deletingPaymentMethodId === pm.id ? (
                              <RiLoader4Line className="w-5 h-5 animate-spin" />
                            ) : (
                              <RiDeleteBinLine className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex gap-3">
                    <RiShieldCheckLine className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Your payment info is secure</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Card details are encrypted and stored securely with Stripe. 
                        We never store your full card number.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
