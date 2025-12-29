'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAuth } from '@/app/components/providers/AuthProvider'
import { 
  RiBuilding2Line, 
  RiAddLine, 
  RiFileTextLine, 
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiSettings4Line,
  RiArrowRightLine,
  RiAlertLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiGlobalLine
} from 'react-icons/ri'
import type { Business, DashboardSummary } from '@/app/components/types/dashboard'
import AddBusinessModal from './components/AddBusinessModal'
import BusinessCard from './components/BusinessCard'
import PendingTasksList from './components/PendingTasksList'
import WelcomeModal from '@/app/components/molecules/modals/WelcomeModal'

export default function DashboardPage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [bizRes, summaryRes] = await Promise.all([
        fetch('/api/businesses', { credentials: 'include' }),
        fetch('/api/dashboard/summary', { credentials: 'include' })
      ])
      
      if (bizRes.ok) {
        const bizData = await bizRes.json()
        setBusinesses(bizData.businesses)
      }
      
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData.summary)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
      return
    }
    
    if (user) {
      fetchData()
      
      // Show welcome modal for checkout users who haven't seen it
      if (user.createdViaCheckout && !user.welcomeShown) {
        setShowWelcomeModal(true)
      }
      // Redirect to onboarding if needed (not checkout user and not completed)
      else if (!user.onboardingCompleted && !user.onboardingSkippedAt && !user.createdViaCheckout) {
        router.push(`/${locale}/onboarding`)
      }
    }
  }, [user, authLoading, router, locale, fetchData])

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false)
    refreshUser()
  }

  const handleBusinessCreated = () => {
    setShowAddModal(false)
    fetchData()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Modal for checkout users */}
      {showWelcomeModal && (
        <WelcomeModal 
          userName={user.firstName} 
          onClose={handleWelcomeClose} 
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your businesses, documents, and compliance from one place.
          </p>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <RiBuilding2Line className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalBusinesses}</p>
                  <p className="text-xs text-gray-500">Businesses</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RiCheckboxCircleLine className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.activeBusinesses}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <RiAlertLine className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.pendingTasks}</p>
                  <p className="text-xs text-gray-500">Pending Tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RiCalendarLine className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.upcomingEvents}</p>
                  <p className="text-xs text-gray-500">Events</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RiFileTextLine className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalDocuments}</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <RiSettings4Line className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{summary.activeServices}</p>
                  <p className="text-xs text-gray-500">Services</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Tasks Section */}
        <div className="mb-8">
          <PendingTasksList />
        </div>

        {/* Businesses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Businesses</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              <RiAddLine className="w-4 h-4" />
              Add Business
            </button>
          </div>

          {businesses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiBuilding2Line className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No businesses yet</h4>
                <p className="text-gray-600 mb-6">
                  Get started by forming a new LLC or adding an existing business.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  <RiAddLine className="w-5 h-5" />
                  Add Your First Business
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map(business => (
                <BusinessCard 
                  key={business.id} 
                  business={business}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`/${locale}/checkout/businessformation`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <RiBuilding2Line className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Form New LLC</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Start a new California LLC from $49.99
                </p>
                <span className="text-amber-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Get Started <RiArrowRightLine />
                </span>
              </div>
            </div>
          </a>

          <a
            href={`/${locale}/webdevelopment`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <RiGlobalLine className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Website Services</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Professional websites for your business
                </p>
                <span className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore Plans <RiArrowRightLine />
                </span>
              </div>
            </div>
          </a>

          <a
            href={`/${locale}/contact`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <RiShieldCheckLine className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Compliance Help</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Stay compliant with expert guidance
                </p>
                <span className="text-green-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Contact Us <RiArrowRightLine />
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Important Dates Section */}
        {summary && summary.pendingTasks > 0 && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-200 rounded-lg">
                <RiTimeLine className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Upcoming Deadlines</h4>
                <p className="text-sm text-amber-800">
                  You have {summary.pendingTasks} pending compliance task{summary.pendingTasks !== 1 ? 's' : ''}. 
                  Select a business above to view and manage your deadlines.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Business Modal */}
      {showAddModal && (
        <AddBusinessModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleBusinessCreated}
          locale={locale}
        />
      )}
    </div>
  )
}
