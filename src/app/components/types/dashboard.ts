// Dashboard Types

export type BusinessStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DISSOLVED'

export type Business = {
  id: string
  name: string
  legalName: string | null
  entityType: string
  state: string
  status: BusinessStatus
  formationDate: string | null
  einNumber: string | null
  businessAddress: string | null
  businessCity: string | null
  businessZip: string | null
  phone: string | null
  email: string | null
  website: string | null
  isExisting: boolean
  createdAt: string
  updatedAt: string
  // Counts and summaries
  documentCount: number
  eventCount: number
  serviceCount: number
  taskCount: number
  pendingTaskCount: number
}

export type BusinessDocument = {
  id: string
  businessId: string
  category: DocumentCategory
  name: string
  fileName: string
  filePath: string
  fileSize: number | null
  mimeType: string | null
  isLatest: boolean
  isFinal: boolean
  description: string | null
  createdAt: string
}

export type DocumentCategory = 
  | 'FORMATION'
  | 'TAX'
  | 'COMPLIANCE'
  | 'FINANCIAL'
  | 'LEGAL'
  | 'OTHER'

export type BusinessEvent = {
  id: string
  businessId: string
  title: string
  description: string | null
  eventType: BusinessEventType
  startDate: string
  endDate: string | null
  isAllDay: boolean
  status: EventStatus
  completedAt: string | null
  createdAt: string
}

export type BusinessEventType = 
  | 'DEADLINE'
  | 'RENEWAL'
  | 'MEETING'
  | 'TAX_DUE'
  | 'REMINDER'
  | 'MILESTONE'

export type EventStatus = 
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED'

export type BusinessService = {
  id: string
  businessId: string
  serviceType: ServiceCategory
  name: string
  description: string | null
  price: number
  billingCycle: 'MONTHLY' | 'YEARLY' | null
  status: ServiceStatus
  startDate: string
  endDate: string | null
  renewalDate: string | null
  createdAt: string
}

export type ServiceCategory = 
  | 'LLC_FORMATION'
  | 'REGISTERED_AGENT'
  | 'COMPLIANCE_PACKAGE'
  | 'WEBSITE_BASIC'
  | 'WEBSITE_PRO'
  | 'WEBSITE_GROWTH'
  | 'EIN_SERVICE'
  | 'ANNUAL_REPORT'
  | 'OTHER'

export type ServiceStatus = 
  | 'PENDING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED'

export type ComplianceTask = {
  id: string
  businessId: string
  title: string
  description: string | null
  taskType: ComplianceTaskType
  dueDate: string
  reminderDate: string | null
  status: ComplianceTaskStatus
  completedAt: string | null
  notes: string | null
  createdAt: string
}

export type ComplianceTaskType = 
  | 'ANNUAL_REPORT'
  | 'FRANCHISE_TAX'
  | 'BUSINESS_LICENSE'
  | 'REGISTERED_AGENT'
  | 'STATEMENT_INFO'
  | 'TAX_FILING'
  | 'OTHER'

export type ComplianceTaskStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'NOT_APPLICABLE'

export type BusinessNote = {
  id: string
  businessId: string
  title: string | null
  content: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export type DashboardSummary = {
  totalBusinesses: number
  activeBusinesses: number
  pendingTasks: number
  upcomingEvents: number
  totalDocuments: number
  activeServices: number
}

export type AddBusinessOption = 'form-new' | 'add-existing'
