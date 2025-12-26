'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/components/providers/AuthProvider'
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiSkipForwardLine,
  RiRocketLine,
  RiUserLine,
  RiLightbulbLine,
  RiMegaphoneLine,
  RiLoader4Line,
  RiBuildingLine,
  RiGlobalLine,
  RiTeamLine,
  RiShoppingBagLine,
} from 'react-icons/ri'

type OnboardingData = {
  phone: string
  referralSource: string
  businessGoals: string[]
}

const referralOptions = [
  { id: 'google', label: 'Google Search', icon: RiGlobalLine },
  { id: 'social', label: 'Social Media', icon: RiMegaphoneLine },
  { id: 'friend', label: 'Friend/Colleague', icon: RiTeamLine },
  { id: 'ad', label: 'Online Ad', icon: RiShoppingBagLine },
  { id: 'other', label: 'Other', icon: RiLightbulbLine },
]

const goalOptions = [
  { id: 'start-llc', label: 'Start a new LLC' },
  { id: 'manage-existing', label: 'Manage existing business' },
  { id: 'compliance', label: 'Stay compliant' },
  { id: 'website', label: 'Build a website' },
  { id: 'marketing', label: 'Grow my business' },
  { id: 'explore', label: 'Just exploring' },
]

export default function OnboardingPage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    phone: '',
    referralSource: '',
    businessGoals: [],
  })

  // Redirect if already completed onboarding or not logged in
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push(`/${locale}/login`)
      } else if (user.onboardingCompleted || user.onboardingSkippedAt) {
        router.push(`/${locale}/dashboard`)
      }
    }
  }, [user, authLoading, router, locale])

  // Pre-fill phone if user has it
  useEffect(() => {
    if (user?.phone) {
      setData(prev => ({ ...prev, phone: user.phone || '' }))
    }
  }, [user])

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Fabiel! 👋',
      subtitle: 'Let\'s personalize your experience',
      skipLabel: null, // Can't skip welcome
    },
    {
      id: 'contact',
      title: 'How can we reach you?',
      subtitle: 'Optional: Add your phone for important updates',
      skipLabel: 'Skip for now',
    },
    {
      id: 'referral',
      title: 'How did you hear about us?',
      subtitle: 'This helps us serve you better',
      skipLabel: 'Skip this step',
    },
    {
      id: 'goals',
      title: 'What brings you here?',
      subtitle: 'Select all that apply',
      skipLabel: 'Skip this step',
    },
  ]

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      await handleComplete(true)
    }
  }

  const handleSkipAll = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skipped: true }),
        credentials: 'include',
      })
      await refreshUser()
      router.push(`/${locale}/dashboard`)
    } catch (error) {
      console.error('Failed to skip onboarding:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async (skipped = false) => {
    setIsSubmitting(true)
    try {
      await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          businessGoals: data.businessGoals.join(','),
          skipped,
        }),
        credentials: 'include',
      })
      await refreshUser()
      router.push(`/${locale}/dashboard`)
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      businessGoals: prev.businessGoals.includes(goalId)
        ? prev.businessGoals.filter(g => g !== goalId)
        : [...prev.businessGoals, goalId],
    }))
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Skip all button */}
      {currentStep > 0 && (
        <div className="absolute top-6 right-6">
          <button
            onClick={handleSkipAll}
            disabled={isSubmitting}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <RiSkipForwardLine className="w-4 h-4" />
            Skip all
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-amber-500'
                        : index < currentStep
                        ? 'w-2 bg-amber-400'
                        : 'w-2 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step content */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-gray-500">{steps[currentStep].subtitle}</p>
              </div>

              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <RiRocketLine className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-lg text-gray-700">
                      Hi <span className="font-semibold text-amber-600">{user.firstName || 'there'}</span>! 
                    </p>
                    <p className="text-gray-600">
                      We&apos;re excited to help you with your business journey. 
                      Let&apos;s take a quick moment to set things up for you.
                    </p>
                    <p className="text-sm text-gray-400">
                      This will only take about 30 seconds
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Phone */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <RiUserLine className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={e => setData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-lg"
                    />
                    <p className="mt-2 text-xs text-gray-400 text-center">
                      We&apos;ll only use this for important business updates
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Referral Source */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {referralOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setData(prev => ({ ...prev, referralSource: option.id }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        data.referralSource === option.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          data.referralSource === option.id
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <option.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`font-medium ${
                          data.referralSource === option.id ? 'text-amber-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </span>
                      {data.referralSource === option.id && (
                        <RiCheckLine className="w-5 h-5 text-amber-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          data.businessGoals.includes(goal.id)
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                              data.businessGoals.includes(goal.id)
                                ? 'bg-amber-500'
                                : 'border-2 border-gray-300'
                            }`}
                          >
                            {data.businessGoals.includes(goal.id) && (
                              <RiCheckLine className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              data.businessGoals.includes(goal.id) ? 'text-amber-700' : 'text-gray-700'
                            }`}
                          >
                            {goal.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RiArrowLeftLine className="w-4 h-4" />
                      Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {steps[currentStep].skipLabel && (
                    <button
                      onClick={handleSkip}
                      disabled={isSubmitting}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {steps[currentStep].skipLabel}
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RiLoader4Line className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : currentStep === totalSteps - 1 ? (
                      <>
                        <span>Get Started</span>
                        <RiBuildingLine className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <RiArrowRightLine className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
