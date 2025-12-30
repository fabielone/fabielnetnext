'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useAuth } from '@/app/components/providers/AuthProvider'
import BusinessSettingsTab from './components/BusinessSettingsTab'
import { 
  RiArrowLeftLine,
  RiBuilding2Line, 
  RiFileTextLine, 
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiSettings4Line,
  RiEditLine,
  RiDownloadLine,
  RiEyeLine,
  RiAddLine,
  RiTimeLine,
  RiAlertLine,
  RiCheckLine,
  RiGlobalLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiRefreshLine
} from 'react-icons/ri'

type BusinessDetail = {
  id: string
  name: string
  legalName: string | null
  entityType: string
  state: string
  status: string
  formationDate: string | null
  einNumber: string | null
  businessAddress: string | null
  businessCity: string | null
  businessZip: string | null
  phone: string | null
  email: string | null
  website: string | null
  isExisting: boolean
  documents: Array<{
    id: string
    category: string
    name: string
    fileName: string
    createdAt: string
  }>
  events: Array<{
    id: string
    title: string
    eventType: string
    startDate: string
    status: string
  }>
  services: Array<{
    id: string
    name: string
    serviceType: string
    status: string
    price: number
  }>
  complianceTasks: Array<{
    id: string
    title: string
    taskType: string
    dueDate: string
    status: string
  }>
  notes: Array<{
    id: string
    title: string | null
    content: string
    isPinned: boolean
    createdAt: string
  }>
  subscriptions: Array<{
    id: string
    name: string
    description: string | null
    status: string
    amount: number
    interval: string
    currentPeriodEnd: string | null
    trialEndsAt: string | null
    createdAt: string
  }>
  formationOrder: {
    id: string
    orderId: string
    status: string
    companyName: string
    questionnaire?: {
      id: string
      status: string
      currentSection: string | null
      createdAt: string
      accessToken: string
    } | null
  } | null
}

type Tab = 'overview' | 'documents' | 'calendar' | 'subscriptions' | 'compliance' | 'settings'

export default function BusinessDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const fetchBusiness = useCallback(async () => {
    try {
      const res = await fetch(`/api/businesses/${businessId}`, { 
        credentials: 'include' 
      })
      
      if (res.ok) {
        const data = await res.json()
        setBusiness(data.business)
      } else if (res.status === 404) {
        router.push(`/${locale}/dashboard`)
      }
    } catch (error) {
      console.error('Failed to fetch business:', error)
    } finally {
      setLoading(false)
    }
  }, [businessId, router, locale])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
      return
    }
    
    if (user && businessId) {
      fetchBusiness()
    }
  }, [user, authLoading, businessId, router, locale, fetchBusiness])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading business...</p>
        </div>
      </div>
    )
  }

  if (!user || !business) return null

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
    SUSPENDED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
    DISSOLVED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Dissolved' },
  }

  const status = statusColors[business.status] || statusColors.PENDING
  const complianceTasks = business.complianceTasks || [];
  const pendingTasks = complianceTasks.filter(t => 
    ['PENDING', 'IN_PROGRESS', 'OVERDUE'].includes(t.status)
  )

  const subscriptions = business.subscriptions || [];
  const documents = business.documents || [];
  const events = business.events || [];
  // services and notes available in business object if needed

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <RiBuilding2Line className="w-4 h-4" /> },
    { id: 'documents', label: 'Files', icon: <RiFileTextLine className="w-4 h-4" />, count: documents.length },
    { id: 'calendar', label: 'Calendar', icon: <RiCalendarLine className="w-4 h-4" />, count: events.length },
    { id: 'subscriptions', label: 'Subscriptions', icon: <RiRefreshLine className="w-4 h-4" />, count: subscriptions.length },
    { id: 'compliance', label: 'Compliance', icon: <RiCheckboxCircleLine className="w-4 h-4" />, count: pendingTasks.length },
    { id: 'settings', label: 'Settings', icon: <RiSettings4Line className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link 
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <RiArrowLeftLine className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <RiBuilding2Line className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {business.entityType} • {business.state}
                    {business.einNumber && ` • EIN: ${business.einNumber}`}
                  </p>
                </div>
              </div>
              
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                <RiEditLine className="w-4 h-4" />
                Edit Business
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Business Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Formation Order Status */}
              {business.formationOrder && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Formation Status</h3>
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{business.formationOrder.orderId}</p>
                      <p className="text-sm text-gray-600">Status: {business.formationOrder.status.replace(/_/g, ' ')}</p>
                    </div>
                    <Link 
                      href={`/${locale}/dashboard/orders/${business.formationOrder.id}`}
                      className="text-amber-600 text-sm font-medium hover:text-amber-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.businessAddress && (
                    <div className="flex items-start gap-3">
                      <RiMapPinLine className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">
                          {business.businessAddress}
                          {business.businessCity && `, ${business.businessCity}`}
                          {business.businessZip && ` ${business.businessZip}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <RiPhoneLine className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{business.phone}</p>
                      </div>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-start gap-3">
                      <RiMailLine className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{business.email}</p>
                      </div>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-start gap-3">
                      <RiGlobalLine className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Documents</h3>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="text-amber-600 text-sm font-medium hover:text-amber-700"
                  >
                    View All →
                  </button>
                </div>
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No documents yet</p>
                ) : (
                  <div className="space-y-2">
                    {documents.slice(0, 5).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <RiFileTextLine className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                            <RiEyeLine className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                            <RiDownloadLine className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Pending Tasks</h3>
                  {(pendingTasks.length > 0 || (business.formationOrder?.questionnaire && ['NOT_STARTED', 'IN_PROGRESS'].includes(business.formationOrder.questionnaire.status))) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      {pendingTasks.length + (business.formationOrder?.questionnaire && ['NOT_STARTED', 'IN_PROGRESS'].includes(business.formationOrder.questionnaire.status) ? 1 : 0)}
                    </span>
                  )}
                </div>
                
                {/* Pending Questionnaire */}
                {business.formationOrder?.questionnaire && ['NOT_STARTED', 'IN_PROGRESS'].includes(business.formationOrder.questionnaire.status) && (
                  <Link
                    href={`/${locale}/questionnaire/${business.formationOrder.questionnaire.accessToken}`}
                    className="block p-3 bg-blue-50 rounded-lg border border-blue-100 mb-3 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <RiFileTextLine className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Complete Your Questionnaire</p>
                        <p className="text-xs text-gray-500">
                          {business.formationOrder.questionnaire.status === 'NOT_STARTED' 
                            ? 'Not started yet - Click to begin' 
                            : `In progress - Section: ${business.formationOrder.questionnaire.currentSection || 'Getting started'}`}
                        </p>
                      </div>
                      <RiArrowLeftLine className="w-4 h-4 text-blue-500 rotate-180" />
                    </div>
                  </Link>
                )}
                
                {pendingTasks.length === 0 && !(business.formationOrder?.questionnaire && ['NOT_STARTED', 'IN_PROGRESS'].includes(business.formationOrder.questionnaire.status)) ? (
                  <div className="text-center py-4">
                    <RiCheckLine className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All caught up!</p>
                  </div>
                ) : pendingTasks.length > 0 && (
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 5).map(task => (
                      <div key={task.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start gap-2">
                          {task.status === 'OVERDUE' ? (
                            <RiAlertLine className="w-4 h-4 text-red-500 mt-0.5" />
                          ) : (
                            <RiTimeLine className="w-4 h-4 text-amber-500 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                </div>
                {events.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <RiCalendarLine className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <RiAddLine className="w-4 h-4" />
                    Upload Document
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <RiCalendarLine className="w-4 h-4" />
                    Add Event
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <RiSettings4Line className="w-4 h-4" />
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">All Documents</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                <RiAddLine className="w-4 h-4" />
                Upload Document
              </button>
            </div>
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <RiFileTextLine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <RiFileTextLine className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.category} • {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                        <RiEyeLine className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                        <RiDownloadLine className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Calendar & Events</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                <RiAddLine className="w-4 h-4" />
                Add Event
              </button>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <RiCalendarLine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <RiCalendarLine className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.eventType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Subscriptions</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                <RiAddLine className="w-4 h-4" />
                Add Service
              </button>
            </div>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <RiRefreshLine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No subscriptions for this business</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map(subscription => {
                  const isInGracePeriod = subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date();
                  const nextBillingDate = isInGracePeriod 
                    ? subscription.trialEndsAt 
                    : subscription.currentPeriodEnd;
                  
                  return (
                    <div key={subscription.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-medium text-gray-900">{subscription.name}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              subscription.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-700' 
                                : subscription.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {subscription.status}
                            </span>
                          </div>
                          {subscription.description && (
                            <p className="text-sm text-gray-500 mb-2">{subscription.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>
                              Amount: <span className="font-medium">${Number(subscription.amount).toFixed(2)}/{subscription.interval}</span>
                            </span>
                            {nextBillingDate && subscription.status === 'ACTIVE' && (
                              <span className="flex items-center gap-1">
                                <RiCalendarLine className="w-4 h-4" />
                                Next billing: <span className="font-medium">{new Date(nextBillingDate).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Compliance Tasks</h3>
            </div>
            {complianceTasks.length === 0 ? (
              <div className="text-center py-12">
                <RiCheckboxCircleLine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No compliance tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {complianceTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      task.status === 'COMPLETED' 
                        ? 'bg-green-50' 
                        : task.status === 'OVERDUE'
                        ? 'bg-red-50'
                        : 'bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'COMPLETED' ? (
                        <RiCheckLine className="w-5 h-5 text-green-600" />
                      ) : task.status === 'OVERDUE' ? (
                        <RiAlertLine className="w-5 h-5 text-red-600" />
                      ) : (
                        <RiTimeLine className="w-5 h-5 text-amber-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.taskType.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <span className={`text-sm font-medium ${
                        task.status === 'COMPLETED' 
                          ? 'text-green-600' 
                          : task.status === 'OVERDUE'
                          ? 'text-red-600'
                          : 'text-amber-600'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <BusinessSettingsTab businessId={business.id} businessStatus={business.status} locale={locale} />
        )}
      </main>
    </div>
  )
}
