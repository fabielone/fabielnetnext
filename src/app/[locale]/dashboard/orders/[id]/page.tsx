'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/app/components/providers/AuthProvider'
import OrderCancellationFlow from '../OrderCancellationFlow'
import { 
  RiArrowLeftLine,
  RiFileList3Line, 
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiAlertLine,
  RiBuilding2Line,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiBankLine,
  RiCheckLine,
  RiCloseCircleLine,
} from 'react-icons/ri'

// Progress event types
type ProgressEventType = 
  | 'ORDER_RECEIVED'
  | 'LLC_FILED'
  | 'LLC_APPROVED'
  | 'EIN_FILED'
  | 'EIN_OBTAINED'
  | 'OPERATING_AGREEMENT_GENERATED'
  | 'BANK_RESOLUTION_LETTER_GENERATED';

interface ProgressEvent {
  id: string
  eventType: ProgressEventType
  completedAt: string | null
  notes: string | null
  createdAt: string
}

interface SubscriptionIntent {
  id: string
  service: string
  amount: number
  frequency: string
  status: string
  scheduledDate: string
  stripeSubscriptionId: string | null
  processedAt: string | null
}

interface WebsiteSubscription {
  id: string
  tier: string
  monthlyPrice: number
  status: string
  nextBillingDate: string | null
  startDate: string
}

interface OrderSubscription {
  id: string
  name: string
  amount: number
  interval: string
  status: string
  currentPeriodEnd: string | null
  trialEndsAt: string | null
  stripeSubscriptionId: string | null
}

interface OrderDetail {
  id: string
  orderId: string
  companyName: string
  formationState: string | null
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPurpose: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string | null
  needEIN: boolean
  needOperatingAgreement: boolean
  needBankLetter: boolean
  registeredAgent: boolean
  compliance: boolean
  websiteService: string | null
  basePrice: number
  registeredAgentPrice: number
  compliancePrice: number
  websiteSetupFee: number
  stateFilingFee: number
  rushFee: number
  totalAmount: number
  status: string
  priority: string
  paymentStatus: string
  paymentMethod: string
  paymentCardLast4: string | null
  paymentCardBrand: string | null
  paymentDate: string | null
  progressLastUpdatedAt: string | null
  stateFilingDate: string | null
  stateFilingNumber: string | null
  ein: string | null
  einIssuedDate: string | null
  articlesGenerated: boolean
  operatingAgreementGenerated: boolean
  bankLetterGenerated: boolean
  einObtained: boolean
  rushProcessing: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
  customerNotes: string | null
  progressEvents: ProgressEvent[]
  subscriptionIntents: SubscriptionIntent[]
  websiteSubscription: WebsiteSubscription | null
  business: {
    id: string
    name: string
    status: string
  } | null
  questionnaire: {
    id: string
    status: string
    currentSection: string | null
  } | null
}

// Progress step configuration
const progressStepConfig: { type: ProgressEventType; label: string; requiresService?: 'needEIN' | 'needOperatingAgreement' | 'needBankLetter' }[] = [
  { type: 'ORDER_RECEIVED', label: 'Order Received' },
  { type: 'LLC_FILED', label: 'LLC Filed' },
  { type: 'LLC_APPROVED', label: 'LLC Approved' },
  { type: 'EIN_FILED', label: 'EIN Filed', requiresService: 'needEIN' },
  { type: 'EIN_OBTAINED', label: 'EIN Obtained', requiresService: 'needEIN' },
  { type: 'OPERATING_AGREEMENT_GENERATED', label: 'Operating Agreement Generated', requiresService: 'needOperatingAgreement' },
  { type: 'BANK_RESOLUTION_LETTER_GENERATED', label: 'Bank Resolution Letter Generated', requiresService: 'needBankLetter' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING_PROCESSING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Processing' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
}

const paymentStatusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
}

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()
  const t = useTranslations('orders')
  const orderId = params.id as string
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [subscriptions, setSubscriptions] = useState<OrderSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showCancellationFlow, setShowCancellationFlow] = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/orders/${orderId}`, { 
        credentials: 'include' 
      })
      
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        setSubscriptions(data.subscriptions || [])
      } else if (res.status === 404) {
        router.push(`/${locale}/dashboard/orders`)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }, [orderId, router, locale])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
      return
    }
    
    if (user && orderId) {
      fetchOrder()
    }
  }, [user, authLoading, orderId, router, locale, fetchOrder])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!user || !order) return null

  const status = statusColors[order.status] || statusColors.PENDING_PROCESSING
  const paymentStatus = paymentStatusColors[order.paymentStatus] || paymentStatusColors.PENDING

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper to safely convert Prisma Decimal/string/number to number
  const toNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0
    // Handle Prisma Decimal objects (they have a toNumber method)
    if (typeof value === 'object' && value !== null && 'toNumber' in value) {
      return (value as { toNumber: () => number }).toNumber()
    }
    // Handle string representation of decimals
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? 0 : parsed
    }
    // Handle regular numbers
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // Normalize subscription status for display
  // PENDING, TRIALING, ACTIVE all show as "Active" (user signed up for service)
  // Only show different status for CANCELLED, PAST_DUE, PAUSED
  const normalizeStatus = (status: string | null): { label: string; bg: string; text: string } => {
    if (!status) return { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' }
    const upper = status.toUpperCase()
    if (['PENDING', 'TRIALING', 'ACTIVE', 'SCHEDULED'].includes(upper)) {
      return { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' }
    }
    if (upper === 'PAST_DUE' || upper === 'PASTDUE') {
      return { label: 'Past Due', bg: 'bg-red-100', text: 'text-red-700' }
    }
    if (upper === 'CANCELLED' || upper === 'CANCELED') {
      return { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600' }
    }
    if (upper === 'PAUSED') {
      return { label: 'Paused', bg: 'bg-yellow-100', text: 'text-yellow-700' }
    }
    return { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' }
  }

  // Calculate what services are included (one-time charges)
  const getWebsiteTierLabel = (tier: string | null) => {
    if (!tier) return null
    const labels: Record<string, string> = {
      'BASIC': 'Essential Website',
      'PRO': 'Professional Website', 
      'GROWTH': 'Blog Pro'
    }
    return labels[tier] || tier
  }

  // Helper to find subscription status by service name
  const getSubscriptionStatus = (serviceName: string): string | null => {
    const sub = subscriptions.find(s => 
      s.name.toLowerCase().includes(serviceName.toLowerCase())
    )
    return sub?.status || null
  }

  // Get numeric values with proper Prisma Decimal handling
  const basePriceAmount = toNumber(order.basePrice)
  const stateFilingFeeAmount = toNumber(order.stateFilingFee)
  const rushFeeAmount = toNumber(order.rushFee)

  const includedServices: { name: string; included: boolean; price: number }[] = [
    { name: 'LLC Formation', included: true, price: basePriceAmount },
    { name: `${order.formationState || order.businessState} State Filing Fee`, included: stateFilingFeeAmount > 0, price: stateFilingFeeAmount },
    { name: 'Rush Processing', included: order.rushProcessing && rushFeeAmount > 0, price: rushFeeAmount },
  ].filter(s => s.included)

  // Subscription services (billed separately) with normalized status
  const subscriptionServices: { name: string; included: boolean; billingNote: string; statusBadge: { label: string; bg: string; text: string } }[] = [
    { name: 'Registered Agent', included: order.registeredAgent, billingNote: 'Billed yearly', statusBadge: normalizeStatus(getSubscriptionStatus('Registered Agent')) },
    { name: 'Annual Compliance', included: order.compliance, billingNote: 'Billed yearly', statusBadge: normalizeStatus(getSubscriptionStatus('Compliance')) },
    { name: getWebsiteTierLabel(order.websiteService) || 'Website', included: !!order.websiteService, billingNote: 'Billed monthly', statusBadge: normalizeStatus(order.websiteSubscription?.status || null) },
  ].filter(s => s.included)

  // Filter progress steps based on selected services
  // Only show steps for services that were explicitly selected (=== true)
  const applicableSteps = progressStepConfig.filter(step => {
    if (!step.requiresService) return true
    return order[step.requiresService] === true
  })

  // Create a map of completed events
  const completedEvents = new Map(
    order.progressEvents.map(event => [event.eventType, event])
  )

  // Check if order can be cancelled
  const llcFiledEvent = order.progressEvents.find(e => e.eventType === 'LLC_FILED')
  const isSubmittedToState = !!llcFiledEvent?.completedAt
  const canCancel = !isSubmittedToState && ['PENDING_PROCESSING', 'PROCESSING'].includes(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link 
              href={`/${locale}/dashboard/orders`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <RiArrowLeftLine className="w-4 h-4" />
              {t('backToOrders')}
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <RiFileList3Line className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{order.companyName}</h1>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('orderNumber', { orderId: order.orderId })} • {order.formationState || order.businessState} LLC
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {canCancel && (
                  <button
                    onClick={() => setShowCancellationFlow(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <RiCloseLine className="w-4 h-4" />
                    {t('cancelOrder')}
                  </button>
                )}
                {order.business && (
                  <Link
                    href={`/${locale}/dashboard/business/${order.business.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    <RiBuilding2Line className="w-4 h-4" />
                    {t('viewBusiness')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Order Progress</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {applicableSteps.map((step, index) => {
                    const event = completedEvents.get(step.type)
                    const isCompleted = !!event?.completedAt
                    
                    return (
                      <div key={step.type} className="relative flex items-start gap-4">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <RiCheckLine className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {isCompleted && event?.completedAt ? (
                            <p className="text-sm text-gray-500">{formatDate(event.completedAt)}</p>
                          ) : (
                            <p className="text-sm text-gray-400">Pending</p>
                          )}
                          {event?.notes && (
                            <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <RiBuilding2Line className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.companyName}</p>
                        <p className="text-sm text-gray-500">{order.formationState || order.businessState} LLC</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RiMapPinLine className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">{order.businessAddress}</p>
                        <p className="text-sm text-gray-500">
                          {order.businessCity}, {order.businessState} {order.businessZip}
                        </p>
                      </div>
                    </div>
                    {order.businessPurpose && (
                      <div className="flex items-start gap-3">
                        <RiFileTextLine className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Purpose</p>
                          <p className="text-sm text-gray-900">{order.businessPurpose}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">👤</span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {order.contactFirstName} {order.contactLastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiMailLine className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-900">{order.contactEmail}</p>
                    </div>
                    {order.contactPhone && (
                      <div className="flex items-center gap-3">
                        <RiPhoneLine className="w-5 h-5 text-gray-400" />
                        <p className="text-sm text-gray-900">{order.contactPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filing Information (if available) */}
            {(order.stateFilingNumber || order.ein) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Filing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.stateFilingNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">State Filing Number</p>
                      <p className="text-lg font-medium text-gray-900">{order.stateFilingNumber}</p>
                      {order.stateFilingDate && (
                        <p className="text-sm text-gray-500">Filed on {formatDate(order.stateFilingDate)}</p>
                      )}
                    </div>
                  )}
                  {order.ein && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">EIN (Tax ID)</p>
                      <p className="text-lg font-medium text-gray-900">{order.ein}</p>
                      {order.einIssuedDate && (
                        <p className="text-sm text-gray-500">Issued on {formatDate(order.einIssuedDate)}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Generated */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RiFileTextLine className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">Articles of Organization</span>
                  </div>
                  {order.articlesGenerated ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <RiCheckboxCircleLine className="w-4 h-4" /> Ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <RiTimeLine className="w-4 h-4" /> Pending
                    </span>
                  )}
                </div>
                
                {order.needOperatingAgreement && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RiFileTextLine className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-900">Operating Agreement</span>
                    </div>
                    {order.operatingAgreementGenerated ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <RiCheckboxCircleLine className="w-4 h-4" /> Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <RiTimeLine className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </div>
                )}
                
                {order.needBankLetter && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RiBankLine className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-900">Banking Resolution Letter</span>
                    </div>
                    {order.bankLetterGenerated ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <RiCheckboxCircleLine className="w-4 h-4" /> Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <RiTimeLine className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </div>
                )}
                
                {order.needEIN && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RiFileTextLine className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-900">EIN Confirmation Letter</span>
                    </div>
                    {order.einObtained ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <RiCheckboxCircleLine className="w-4 h-4" /> Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <RiTimeLine className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {/* One-time charges */}
                {includedServices.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="text-gray-900">{formatCurrency(service.price)}</span>
                  </div>
                ))}
                
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Subscription services */}
                {subscriptionServices.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Recurring Services</p>
                    {subscriptionServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">{service.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{service.billingNote}</span>
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${service.statusBadge.bg} ${service.statusBadge.text}`}>
                            {service.statusBadge.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Payment</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentStatus.bg} ${paymentStatus.text}`}>
                    {paymentStatus.label}
                  </span>
                </div>
                {order.paymentCardLast4 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Card</span>
                    <span className="text-sm text-gray-900">
                      {order.paymentCardBrand && <span className="capitalize">{order.paymentCardBrand} </span>}
                      •••• {order.paymentCardLast4}
                    </span>
                  </div>
                )}
                {order.paymentDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid on</span>
                    <span className="text-sm text-gray-900">{formatDate(order.paymentDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subscriptions */}
            {(order.subscriptionIntents.length > 0 || order.websiteSubscription || subscriptions.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Subscriptions</h2>
                <div className="space-y-4">
                  {/* Website Subscription */}
                  {order.websiteSubscription && (() => {
                    const badge = normalizeStatus(order.websiteSubscription.status)
                    return (
                      <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Website - {order.websiteSubscription.tier.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(order.websiteSubscription.monthlyPrice)}/month
                          </p>
                          {order.websiteSubscription.nextBillingDate && (
                            <p className="text-xs text-gray-500">
                              Next billing: {formatDate(order.websiteSubscription.nextBillingDate)}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    )
                  })()}
                  
                  {/* Subscriptions from Subscription table (Registered Agent, Compliance, etc.) */}
                  {subscriptions.map((sub) => {
                    const badge = normalizeStatus(sub.status)
                    return (
                      <div key={sub.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(Number(sub.amount))}/{sub.interval}
                          </p>
                          {sub.trialEndsAt && new Date(sub.trialEndsAt) > new Date() && (
                            <p className="text-xs text-amber-600">
                              Trial ends: {formatDate(sub.trialEndsAt)}
                            </p>
                          )}
                          {sub.currentPeriodEnd && (
                            <p className="text-xs text-gray-500">
                              Next billing: {formatDate(sub.currentPeriodEnd)}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    )
                  })}

                  {/* Legacy Subscription Intents */}
                  {order.subscriptionIntents.map((sub) => {
                    const badge = normalizeStatus(sub.status)
                    return (
                      <div key={sub.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{sub.service}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(Number(sub.amount))}/{sub.frequency.toLowerCase()}
                          </p>
                          {sub.scheduledDate && (
                            <p className="text-xs text-gray-500">
                              Next billing: {formatDate(sub.scheduledDate)}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Order Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Dates</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Placed</span>
                  <span className="text-sm text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Progress Update</span>
                  <span className="text-sm text-gray-900">{formatDate(order.progressLastUpdatedAt || order.updatedAt)}</span>
                </div>
                {order.completedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm text-gray-900">{formatDate(order.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            {order.rushProcessing && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <RiAlertLine className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Rush Processing</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  This order is being expedited.
                </p>
              </div>
            )}

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-sm text-gray-600">{order.customerNotes}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Order Cancellation Flow */}
      {showCancellationFlow && (
        <OrderCancellationFlow
          order={{
            id: order.id,
            orderId: order.orderId,
            companyName: order.companyName,
            status: order.status,
            totalAmount: order.totalAmount,
            formationState: order.formationState || order.businessState
          }}
          onCancel={() => setShowCancellationFlow(false)}
          onComplete={() => {
            router.push(`/${locale}/dashboard/orders`)
          }}
        />
      )}
    </div>
  )
}
