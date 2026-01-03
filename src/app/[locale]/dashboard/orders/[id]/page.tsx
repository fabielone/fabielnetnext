'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useAuth } from '@/app/components/providers/AuthProvider'
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
  paymentDate: string | null
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

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING_PROCESSING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Processing' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
}

const paymentStatusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PAID: { bg: 'bg-green-100', text: 'text-green-800' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/orders/${orderId}`, { 
        credentials: 'include' 
      })
      
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
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

  // Calculate what services are included
  const includedServices = [
    { name: 'LLC Formation', included: true, price: order.basePrice },
    { name: 'State Filing Fee', included: Number(order.stateFilingFee) > 0, price: order.stateFilingFee },
    { name: 'EIN Application', included: order.needEIN, price: 0 },
    { name: 'Operating Agreement', included: order.needOperatingAgreement, price: 0 },
    { name: 'Banking Resolution Letter', included: order.needBankLetter, price: 0 },
    { name: 'Registered Agent (1 year)', included: order.registeredAgent, price: order.registeredAgentPrice },
    { name: 'Annual Compliance', included: order.compliance, price: order.compliancePrice },
    { name: 'Rush Processing', included: order.rushProcessing, price: order.rushFee },
  ].filter(s => s.included)

  // Progress steps based on order status
  const progressSteps = [
    { label: 'Order Received', completed: true, date: order.createdAt },
    { label: 'Payment Confirmed', completed: order.paymentStatus === 'PAID', date: order.paymentDate },
    { label: 'State Filing', completed: !!order.stateFilingNumber, date: order.stateFilingDate },
    { label: 'EIN Obtained', completed: order.einObtained, date: order.einIssuedDate },
    { label: 'Completed', completed: order.status === 'COMPLETED', date: order.completedAt },
  ]

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
              Back to Orders
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
                    Order #{order.orderId} • {order.formationState || order.businessState} LLC
                  </p>
                </div>
              </div>
              
              {order.business && (
                <Link
                  href={`/${locale}/dashboard/business/${order.business.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  <RiBuilding2Line className="w-4 h-4" />
                  View Business
                </Link>
              )}
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
                  {progressSteps.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.completed ? (
                          <RiCheckLine className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {step.completed && step.date && (
                          <p className="text-sm text-gray-500">{formatDate(step.date)}</p>
                        )}
                      </div>
                    </div>
                  ))}
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
                {includedServices.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}</span>
                    {Number(service.price) > 0 && (
                      <span className="text-gray-900">{formatCurrency(service.price)}</span>
                    )}
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Payment</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentStatus.bg} ${paymentStatus.text}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Method</span>
                  <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                </div>
                {order.paymentDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid on</span>
                    <span className="text-sm text-gray-900">{formatDate(order.paymentDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Dates</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Placed</span>
                  <span className="text-sm text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">{formatDate(order.updatedAt)}</span>
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
    </div>
  )
}
