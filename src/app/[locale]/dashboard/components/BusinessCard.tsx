'use client'
import Link from 'next/link'
import { 
  RiBuilding2Line, 
  RiFileTextLine, 
  RiCalendarLine,
  RiAlertLine,
  RiArrowRightLine,
  RiSettings4Line,
  RiCheckboxCircleLine,
  RiTimeLine
} from 'react-icons/ri'
import type { Business } from '@/app/components/types/dashboard'

interface BusinessCardProps {
  business: Business
  locale: string
}

const statusColors = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
  INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
  SUSPENDED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
  DISSOLVED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Dissolved' },
}

const entityTypeLabels: Record<string, string> = {
  LLC: 'LLC',
  CORPORATION: 'Corporation',
  S_CORPORATION: 'S-Corp',
  SOLE_PROPRIETORSHIP: 'Sole Prop',
  PARTNERSHIP: 'Partnership',
  NON_PROFIT: 'Non-Profit',
}

export default function BusinessCard({ business, locale }: BusinessCardProps) {
  const status = statusColors[business.status] || statusColors.PENDING
  
  return (
    <Link
      href={`/${locale}/dashboard/business/${business.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all group block"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
            <RiBuilding2Line className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
              {business.name}
            </h4>
            <p className="text-xs text-gray-500">
              {entityTypeLabels[business.entityType] || business.entityType} • {business.state}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RiFileTextLine className="w-4 h-4 text-gray-400" />
          <span>{business.documentCount} Documents</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RiSettings4Line className="w-4 h-4 text-gray-400" />
          <span>{business.serviceCount} Services</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RiCalendarLine className="w-4 h-4 text-gray-400" />
          <span>{business.eventCount} Events</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RiCheckboxCircleLine className="w-4 h-4 text-gray-400" />
          <span>{business.taskCount} Tasks</span>
        </div>
      </div>

      {/* Alert for pending tasks */}
      {business.pendingTaskCount > 0 && (
        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-sm mb-4">
          <RiAlertLine className="w-4 h-4 text-amber-600" />
          <span className="text-amber-800">
            {business.pendingTaskCount} pending task{business.pendingTaskCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* EIN if available */}
      {business.einNumber && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span>EIN: {business.einNumber}</span>
        </div>
      )}

      {/* Formation date or created date */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <RiTimeLine className="w-3 h-3" />
          <span>
            {business.formationDate 
              ? `Formed ${new Date(business.formationDate).toLocaleDateString()}`
              : `Added ${new Date(business.createdAt).toLocaleDateString()}`
            }
          </span>
        </div>
        <span className="text-amber-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          View <RiArrowRightLine className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
