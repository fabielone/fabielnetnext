// Questionnaire Service
// Handles questionnaire creation, retrieval, and submission

import prisma from '@/lib/prisma';
import { QuestionnaireStatus, TaskPriority, TaskStatus } from '@prisma/client';
import { questionnaireSchema, getVisibleSections } from './schema';
import { randomBytes } from 'crypto';

// Generate a secure access token
function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Determine products from order
function determineProducts(order: any): string[] {
  const products: string[] = ['llc']; // Always include LLC formation
  
  if (order.needEIN) products.push('ein');
  if (order.needOperatingAgreement) products.push('operating_agreement');
  if (order.needBankLetter) products.push('bank_resolution');
  if (order.registeredAgent) products.push('registered_agent');
  if (order.compliance) products.push('annual_compliance');
  
  return products;
}

// Create pre-populated data from order
function createPrePopulatedData(order: any): Record<string, any> {
  return {
    // Business info
    business_name: order.companyName?.replace(/\s*(LLC|L\.L\.C\.)?\s*$/i, '').trim(),
    business_purpose: order.businessPurpose,
    
    // Business address
    business_address: {
      street: order.businessAddress,
      city: order.businessCity,
      state: order.businessState,
      zipCode: order.businessZip
    },
    
    // Contact/responsible party
    responsible_party_name: `${order.contactFirstName} ${order.contactLastName}`,
    contactName: `${order.contactFirstName} ${order.contactLastName}`,
    
    // First member (assume purchaser is first member)
    member_list: [{
      member_type: 'individual',
      full_name: `${order.contactFirstName} ${order.contactLastName}`,
      email: order.contactEmail,
      phone: order.contactPhone || '',
      street_address: order.contactAddress || order.businessAddress,
      city: order.businessCity,
      state: order.businessState,
      zip_code: order.businessZip,
      ownership_percentage: 100
    }],
    
    // Registered agent selection
    ra_selection: order.registeredAgent ? 'our_service' : 'self'
  };
}

// Create questionnaire for a completed order
export async function createQuestionnaireForOrder(orderId: string) {
  // Get the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (!order.userId) {
    throw new Error('Order has no associated user');
  }

  // Check if questionnaire already exists
  const existing = await prisma.questionnaireResponse.findUnique({
    where: { orderId }
  });

  if (existing) {
    return existing;
  }

  const products = determineProducts(order);
  const prePopulatedData = createPrePopulatedData(order);
  const accessToken = generateSecureToken();

  // Create questionnaire
  const questionnaire = await prisma.questionnaireResponse.create({
    data: {
      orderId: order.id,
      userId: order.userId,
      stateCode: order.formationState || order.businessState || 'CA',
      products: products,
      prePopulatedData: prePopulatedData,
      responses: prePopulatedData, // Start with pre-populated as initial responses
      status: QuestionnaireStatus.NOT_STARTED,
      accessToken: accessToken,
      tokenExpiresAt: addDays(new Date(), 30) // 30 day expiry
    }
  });

  // Create pending task
  await prisma.pendingTask.create({
    data: {
      userId: order.userId,
      taskType: 'questionnaire',
      taskTitle: 'Complete LLC Formation Questionnaire',
      taskDescription: `Please complete the questionnaire for ${order.companyName} LLC formation in ${order.formationState || order.businessState}.`,
      referenceType: 'questionnaire',
      referenceId: questionnaire.id,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      dueDate: addDays(new Date(), 7), // 7 day suggested completion
      actionUrl: `/en/questionnaire/${order.orderId}?t=${questionnaire.accessToken}`
    }
  });

  return questionnaire;
}

// Get questionnaire by access token
export async function getQuestionnaireByToken(accessToken: string, userId: string) {
  const questionnaire = await prisma.questionnaireResponse.findUnique({
    where: { accessToken },
    include: {
      order: {
        select: {
          id: true,
          orderId: true,
          companyName: true,
          formationState: true,
          businessState: true,
          status: true
        }
      }
    }
  });

  if (!questionnaire) {
    return { valid: false, error: 'Questionnaire not found' };
  }

  // Check ownership
  if (questionnaire.userId !== userId) {
    return { valid: false, error: 'Unauthorized access' };
  }

  // Check expiry
  if (questionnaire.tokenExpiresAt && questionnaire.tokenExpiresAt < new Date()) {
    return { valid: false, error: 'Questionnaire link has expired' };
  }

  // Get state config
  const stateConfig = await getStateConfig(questionnaire.stateCode);

  // Get visible sections
  const products = questionnaire.products as string[];
  const responses = questionnaire.responses as Record<string, any>;
  const sections = getVisibleSections(products, responses);

  return {
    valid: true,
    questionnaire: {
      id: questionnaire.id,
      orderId: questionnaire.orderId,
      stateCode: questionnaire.stateCode,
      status: questionnaire.status,
      currentSection: questionnaire.currentSection,
      responses: responses,
      prePopulatedData: questionnaire.prePopulatedData as Record<string, any>,
      products: products,
      order: questionnaire.order
    },
    sections,
    stateConfig
  };
}

// Get questionnaire by order ID
export async function getQuestionnaireByOrderId(orderId: string, userId: string) {
  const questionnaire = await prisma.questionnaireResponse.findUnique({
    where: { orderId },
    include: {
      order: {
        select: {
          id: true,
          orderId: true,
          companyName: true,
          formationState: true,
          businessState: true,
          status: true
        }
      }
    }
  });

  if (!questionnaire) {
    return { valid: false, error: 'Questionnaire not found' };
  }

  // Check ownership
  if (questionnaire.userId !== userId) {
    return { valid: false, error: 'Unauthorized access' };
  }

  return {
    valid: true,
    questionnaire,
    accessToken: questionnaire.accessToken
  };
}

// Save questionnaire progress
export async function saveQuestionnaireProgress(
  accessToken: string,
  userId: string,
  responses: Record<string, any>,
  currentSection?: string
) {
  const questionnaire = await prisma.questionnaireResponse.findUnique({
    where: { accessToken }
  });

  if (!questionnaire) {
    throw new Error('Questionnaire not found');
  }

  if (questionnaire.userId !== userId) {
    throw new Error('Unauthorized access');
  }

  if (questionnaire.status === QuestionnaireStatus.COMPLETED) {
    throw new Error('Questionnaire already completed');
  }

  // Merge responses with existing
  const existingResponses = questionnaire.responses as Record<string, any> || {};
  const mergedResponses = { ...existingResponses, ...responses };

  // Update questionnaire
  const updated = await prisma.questionnaireResponse.update({
    where: { accessToken },
    data: {
      responses: mergedResponses,
      currentSection: currentSection || questionnaire.currentSection,
      status: questionnaire.status === QuestionnaireStatus.NOT_STARTED 
        ? QuestionnaireStatus.IN_PROGRESS 
        : questionnaire.status,
      lastSavedAt: new Date()
    }
  });

  // Update pending task status
  await prisma.pendingTask.updateMany({
    where: {
      referenceType: 'questionnaire',
      referenceId: questionnaire.id,
      status: TaskStatus.PENDING
    },
    data: {
      status: TaskStatus.IN_PROGRESS
    }
  });

  return { success: true, savedAt: updated.lastSavedAt };
}

// Submit completed questionnaire
export async function submitQuestionnaire(
  accessToken: string,
  userId: string,
  responses: Record<string, any>
) {
  const questionnaire = await prisma.questionnaireResponse.findUnique({
    where: { accessToken },
    include: { order: true }
  });

  if (!questionnaire) {
    throw new Error('Questionnaire not found');
  }

  if (questionnaire.userId !== userId) {
    throw new Error('Unauthorized access');
  }

  if (questionnaire.status === QuestionnaireStatus.COMPLETED) {
    throw new Error('Questionnaire already completed');
  }

  // Merge final responses
  const existingResponses = questionnaire.responses as Record<string, any> || {};
  const finalResponses = { ...existingResponses, ...responses };

  // Use a transaction to update everything
  const result = await prisma.$transaction(async (tx) => {
    // Update questionnaire
    const updated = await tx.questionnaireResponse.update({
      where: { accessToken },
      data: {
        responses: finalResponses,
        status: QuestionnaireStatus.COMPLETED,
        completedAt: new Date(),
        lastSavedAt: new Date()
      }
    });

    // Complete pending task
    await tx.pendingTask.updateMany({
      where: {
        referenceType: 'questionnaire',
        referenceId: questionnaire.id
      },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    // Create operating agreement record if purchased
    const products = questionnaire.products as string[];
    if (products.includes('operating_agreement')) {
      await createOperatingAgreementFromResponses(tx, questionnaire.orderId, finalResponses);
    }

    return updated;
  });

  return { success: true, completedAt: result.completedAt };
}

// Create operating agreement from questionnaire responses
async function createOperatingAgreementFromResponses(
  tx: any,
  orderId: string,
  responses: Record<string, any>
) {
  // Check if already exists
  const existing = await tx.operatingAgreement.findUnique({
    where: { orderId }
  });

  if (existing) {
    // Update existing
    return tx.operatingAgreement.update({
      where: { orderId },
      data: mapResponsesToOperatingAgreement(responses)
    });
  }

  // Create new
  return tx.operatingAgreement.create({
    data: {
      orderId,
      ...mapResponsesToOperatingAgreement(responses),
      isCompleted: true
    }
  });
}

// Map questionnaire responses to operating agreement fields
function mapResponsesToOperatingAgreement(responses: Record<string, any>) {
  const memberList = responses.member_list || [];
  const isSingleMember = responses.member_count === 'single' || memberList.length <= 1;

  return {
    memberCount: memberList.length || 1,
    isSingleMember,
    managementType: responses.management_type === 'manager_managed' ? 'MANAGER_MANAGED' : 'MEMBER_MANAGED',
    profitDistMethod: responses.profit_allocation === 'equal' ? 'EQUAL_SHARES' : 'PROPORTIONAL',
    distFrequency: mapDistributionFrequency(responses.distribution_schedule),
    taxClassification: mapTaxClassification(responses.tax_classification, isSingleMember),
    fiscalYearEnd: responses.fiscal_year_end === 'december_31' ? 'DECEMBER' : 'CUSTOM',
    allowMemberTransfer: responses.allow_transfer !== 'no',
    rightOfFirstRefusal: responses.allow_transfer === 'yes_rofr',
    principalActivity: responses.business_purpose
  };
}

function mapDistributionFrequency(value: string) {
  const map: Record<string, string> = {
    'as_determined': 'AS_DECIDED',
    'quarterly': 'QUARTERLY',
    'annually': 'ANNUALLY',
    'monthly': 'MONTHLY'
  };
  return map[value] || 'AS_DECIDED';
}

function mapTaxClassification(value: string, isSingleMember: boolean) {
  if (value === 's_corp') return 'S_CORPORATION';
  if (value === 'c_corp') return 'C_CORPORATION';
  return isSingleMember ? 'DISREGARDED_ENTITY' : 'PARTNERSHIP';
}

// Get state configuration
export async function getStateConfig(stateCode: string) {
  const configs = await prisma.questionnaireConfig.findMany({
    where: {
      OR: [
        { stateCode },
        { stateCode: 'ALL' }
      ],
      isActive: true
    }
  });

  // Merge configs, state-specific overrides ALL
  const result: Record<string, any> = { stateCode };
  
  for (const config of configs) {
    if (config.stateCode === 'ALL') {
      result[config.configType] = config.configData;
    }
  }
  
  for (const config of configs) {
    if (config.stateCode === stateCode) {
      result[config.configType] = config.configData;
    }
  }

  return result;
}

// Get user's pending tasks
export async function getUserPendingTasks(userId: string) {
  return prisma.pendingTask.findMany({
    where: {
      userId,
      status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' }
    ]
  });
}

// Complete a task
export async function completeTask(taskId: string, userId: string) {
  const task = await prisma.pendingTask.findUnique({
    where: { id: taskId }
  });

  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }

  return prisma.pendingTask.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.COMPLETED,
      completedAt: new Date()
    }
  });
}

// Dismiss a task
export async function dismissTask(taskId: string, userId: string) {
  const task = await prisma.pendingTask.findUnique({
    where: { id: taskId }
  });

  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }

  return prisma.pendingTask.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.DISMISSED
    }
  });
}

// Snooze a task
export async function snoozeTask(taskId: string, userId: string, snoozeUntil: Date) {
  const task = await prisma.pendingTask.findUnique({
    where: { id: taskId }
  });

  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }

  return prisma.pendingTask.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.SNOOZED,
      dueDate: snoozeUntil
    }
  });
}
