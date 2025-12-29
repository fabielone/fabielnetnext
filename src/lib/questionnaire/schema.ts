// Questionnaire Schema Definition
// This defines all sections and questions for the LLC formation questionnaire
//
// PRODUCT VISIBILITY RULES:
// - LLC Formation (base): Basic Info, Members, Management, Review sections (always shown)
// - EIN Product: Shows Tax Classification and EIN sections
// - Operating Agreement Product: Shows Operating Agreement section
// - Bank Resolution Product: Shows Bank Resolution section
// - Registered Agent Product: Shows Registered Agent section
//
// EXAMPLE SCENARIOS:
// 1. LLC Only: Basic Info → Members → Management → Review (4 sections)
// 2. LLC + EIN: Basic Info → Members → Management → Tax → EIN → Review (6 sections)
// 3. LLC + Operating Agreement: Basic Info → Members → Management → Operating Agreement → Review (5 sections)
// 4. LLC + EIN + Operating Agreement: All except Bank Resolution and Registered Agent (7 sections)
// 5. Full Package (all products): All 9 sections

import { QuestionnaireSection } from './types';

export const questionnaireSchema: QuestionnaireSection[] = [
  // ============================================
  // SECTION 1: BASIC BUSINESS INFORMATION
  // ============================================
  {
    id: 'basic_info',
    title: 'Basic Business Information',
    description: 'Confirm and complete your business details',
    order: 1,
    visibility: { type: 'always' },
    questions: [
      {
        id: 'business_name',
        type: 'text',
        label: 'Desired Business Name',
        helpText: 'This should match what you entered during checkout. Do not include "LLC" - we will add it.',
        required: true,
        visibility: { type: 'always' },
        prePopulateFrom: 'companyName',
        validation: [
          { type: 'required', message: 'Business name is required' },
          { type: 'minLength', value: 2, message: 'Business name must be at least 2 characters' },
          { type: 'maxLength', value: 100, message: 'Business name must be less than 100 characters' }
        ]
      },
      {
        id: 'business_address',
        type: 'address',
        label: 'Business Address',
        helpText: 'The principal place of business for your LLC',
        required: true,
        visibility: { type: 'always' },
        prePopulateFrom: 'businessAddress'
      },
      {
        id: 'mailing_address_same',
        type: 'radio',
        label: 'Is your mailing address the same as your business address?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'yes', label: 'Yes, use the same address' },
          { value: 'no', label: 'No, I have a different mailing address' }
        ],
        defaultValue: 'yes'
      },
      {
        id: 'mailing_address',
        type: 'address',
        label: 'Mailing Address',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'mailing_address_same',
          answerValue: 'no',
          operator: 'equals'
        }
      },
      {
        id: 'business_purpose',
        type: 'textarea',
        label: 'Business Purpose',
        helpText: 'Describe the primary activities of your business. Example: "To engage in any lawful business activity" or be specific like "To provide consulting services in the field of technology"',
        required: true,
        visibility: { type: 'always' },
        prePopulateFrom: 'businessPurpose',
        validation: [
          { type: 'required', message: 'Business purpose is required' },
          { type: 'minLength', value: 10, message: 'Please provide a more detailed description' }
        ]
      }
    ]
  },

  // ============================================
  // SECTION 2: MEMBER INFORMATION
  // ============================================
  {
    id: 'members',
    title: 'Ownership (Member Information)',
    description: 'Add all members (owners) of the LLC',
    order: 2,
    visibility: { type: 'always' },
    questions: [
      {
        id: 'member_count',
        type: 'radio',
        label: 'How many owners will your LLC have?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'single', label: 'Single Member (just me)', description: 'You are the only owner' },
          { value: 'multi', label: 'Multiple Members', description: 'Two or more owners' }
        ],
        defaultValue: 'single'
      },
      {
        id: 'member_list',
        type: 'member_list',
        label: 'LLC Members',
        helpText: 'Add all individuals or entities that will own the LLC. Ownership percentages must total 100%.',
        required: true,
        visibility: { type: 'always' },
        prePopulateFrom: 'members',
        memberFields: [
          { id: 'member_type', type: 'radio', label: 'Member Type', options: [
            { value: 'individual', label: 'Individual' },
            { value: 'entity', label: 'Business Entity' }
          ], required: true },
          { id: 'full_name', type: 'text', label: 'Full Legal Name', required: true, helpText: 'For individuals: your full legal name. For entities: the entity\'s legal name.' },
          { id: 'entity_type', type: 'select', label: 'Entity Type', visibility: { type: 'answer', questionId: 'member_type', answerValue: 'entity', operator: 'equals' }, required: true, options: [
            { value: 'llc', label: 'LLC' },
            { value: 'corporation', label: 'Corporation' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'trust', label: 'Trust' }
          ]},
          { id: 'street_address', type: 'text', label: 'Street Address', required: true },
          { id: 'city', type: 'text', label: 'City', required: true },
          { id: 'state', type: 'text', label: 'State', required: true },
          { id: 'zip_code', type: 'text', label: 'ZIP Code', required: true },
          { id: 'email', type: 'email', label: 'Email Address', required: true },
          { id: 'phone', type: 'phone', label: 'Phone Number', required: true },
          { id: 'ownership_percentage', type: 'number', label: 'Ownership Percentage', required: true, min: 0.01, max: 100, helpText: 'For single-member LLCs, this will be 100%' },
          { id: 'ssn', type: 'text', label: 'Social Security Number (SSN)', helpText: 'Required for tax purposes. Format: XXX-XX-XXXX', required: true, visibility: { type: 'answer', questionId: 'member_type', answerValue: 'individual', operator: 'equals' }},
          { id: 'ein', type: 'text', label: 'Employer Identification Number (EIN)', helpText: 'The entity\'s EIN. Format: XX-XXXXXXX', required: true, visibility: { type: 'answer', questionId: 'member_type', answerValue: 'entity', operator: 'equals' }}
        ]
      }
    ]
  },

  // ============================================
  // SECTION 3: MANAGEMENT STRUCTURE
  // ============================================
  {
    id: 'management',
    title: 'Management Structure',
    description: 'Define how your LLC will be managed',
    order: 3,
    visibility: { type: 'always' },
    questions: [
      {
        id: 'management_type',
        type: 'radio',
        label: 'How will the LLC be managed?',
        helpText: 'Member-Managed: All members participate in daily operations. Manager-Managed: Designated manager(s) handle operations while members are passive investors.',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'member_managed', label: 'Member-Managed', description: 'All members participate in running the business' },
          { value: 'manager_managed', label: 'Manager-Managed', description: 'One or more designated managers run the business' }
        ],
        defaultValue: 'member_managed'
      },
      {
        id: 'managers',
        type: 'member_list',
        label: 'Manager(s)',
        helpText: 'List all managers. Managers can be members or outside individuals.',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'management_type',
          answerValue: 'manager_managed',
          operator: 'equals'
        },
        memberFields: [
          { id: 'manager_name', type: 'text', label: 'Manager Full Name', required: true },
          { id: 'is_member', type: 'radio', label: 'Is this manager also a member?', options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]},
          { id: 'manager_street', type: 'text', label: 'Street Address', required: true },
          { id: 'manager_city', type: 'text', label: 'City', required: true },
          { id: 'manager_state', type: 'text', label: 'State', required: true },
          { id: 'manager_zip', type: 'text', label: 'ZIP Code', required: true }
        ]
      }
    ]
  },

  // ============================================
  // SECTION 4: TAX CLASSIFICATION
  // ============================================
  {
    id: 'tax',
    title: 'Tax Classification',
    description: 'Important tax decisions for your LLC',
    order: 4,
    visibility: { type: 'product', product: 'ein' },
    questions: [
      {
        id: 'tax_classification',
        type: 'radio',
        label: 'Tax Classification',
        helpText: 'Most LLCs are taxed as partnerships (pass-through). Consult a tax professional for your specific situation.',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'default', label: 'Default Tax Treatment', description: 'Single-member: Disregarded entity. Multi-member: Partnership.' },
          { value: 's_corp', label: 'S-Corporation Election', description: 'Pass-through with potential self-employment tax savings' },
          { value: 'c_corp', label: 'C-Corporation Election', description: 'LLC taxed as a corporation' }
        ],
        defaultValue: 'default'
      },
      {
        id: 'fiscal_year_end',
        type: 'radio',
        label: 'Fiscal Year End',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'december_31', label: 'December 31st (calendar year - typical)' },
          { value: 'other', label: 'Other fiscal year end' }
        ],
        defaultValue: 'december_31'
      },
      {
        id: 'fiscal_year_end_date',
        type: 'date',
        label: 'Fiscal Year End Date',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'fiscal_year_end',
          answerValue: 'other',
          operator: 'equals'
        }
      }
    ]
  },

  // ============================================
  // SECTION 5: EIN INFORMATION
  // ============================================
  {
    id: 'ein',
    title: 'EIN Application Information',
    description: 'Information needed to obtain your Employer Identification Number',
    order: 5,
    visibility: { type: 'product', product: 'ein' },
    questions: [
      {
        id: 'responsible_party_name',
        type: 'text',
        label: 'Responsible Party (Full Name)',
        helpText: 'The individual who has authority over the LLC\'s finances. This must be an individual, not an entity.',
        required: true,
        visibility: { type: 'always' },
        prePopulateFrom: 'contactName'
      },
      {
        id: 'responsible_party_ssn',
        type: 'text',
        label: 'Social Security Number (SSN)',
        helpText: 'Required by IRS to process EIN application. This information is encrypted and secure.',
        required: true,
        visibility: { type: 'always' },
        validation: [
          { type: 'required', message: 'SSN is required for EIN application' },
          { type: 'pattern', value: '^\\d{3}-?\\d{2}-?\\d{4}$', message: 'Please enter a valid SSN format (XXX-XX-XXXX)' }
        ]
      },
      {
        id: 'expect_employees',
        type: 'radio',
        label: 'Do you expect to have employees in the next 12 months?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        defaultValue: 'no'
      },
      {
        id: 'highest_employee_count',
        type: 'select',
        label: 'Highest number of employees expected',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'expect_employees',
          answerValue: 'yes',
          operator: 'equals'
        },
        options: [
          { value: '1-4', label: '1-4' },
          { value: '5-9', label: '5-9' },
          { value: '10-19', label: '10-19' },
          { value: '20-49', label: '20-49' },
          { value: '50+', label: '50 or more' }
        ]
      }
    ]
  },

  // ============================================
  // SECTION 6: OPERATING AGREEMENT DETAILS
  // ============================================
  {
    id: 'operating_agreement',
    title: 'Operating Agreement Details',
    description: 'Customize your operating agreement',
    order: 6,
    visibility: { type: 'product', product: 'operating_agreement' },
    questions: [
      {
        id: 'profit_allocation',
        type: 'radio',
        label: 'How will profits and losses be allocated?',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'member_count',
          answerValue: 'multi',
          operator: 'equals'
        },
        options: [
          { value: 'proportional', label: 'Proportional to ownership', description: 'Each member receives their ownership percentage' },
          { value: 'equal', label: 'Equal share to all members', description: 'Each member gets the same share regardless of ownership' }
        ],
        defaultValue: 'proportional'
      },
      {
        id: 'distribution_schedule',
        type: 'radio',
        label: 'When will profits be distributed?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'as_determined', label: 'As determined by members/managers' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'annually', label: 'Annually' },
          { value: 'monthly', label: 'Monthly' }
        ],
        defaultValue: 'as_determined'
      },
      {
        id: 'voting_rights',
        type: 'radio',
        label: 'How will member votes be determined?',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'member_count',
          answerValue: 'multi',
          operator: 'equals'
        },
        options: [
          { value: 'by_ownership', label: 'By ownership share', description: 'Votes weighted by ownership percentage' },
          { value: 'equal', label: 'Equal vote for each member', description: 'Each member gets one vote regardless of ownership' }
        ],
        defaultValue: 'by_ownership'
      },
      {
        id: 'allow_new_members',
        type: 'radio',
        label: 'Can new members be admitted in the future?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'yes_unanimous', label: 'Yes - Unanimous vote required' },
          { value: 'yes_majority', label: 'Yes - Majority vote required' },
          { value: 'no', label: 'No - No new members allowed' }
        ],
        defaultValue: 'yes_unanimous'
      },
      {
        id: 'allow_transfer',
        type: 'radio',
        label: 'Can members transfer their ownership to non-members?',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'member_count',
          answerValue: 'multi',
          operator: 'equals'
        },
        options: [
          { value: 'yes_rofr', label: 'Yes - But other members have right of first refusal' },
          { value: 'yes_approval', label: 'Yes - But requires approval from other members' },
          { value: 'no', label: 'No - Transfers to non-members not allowed' }
        ],
        defaultValue: 'yes_rofr'
      }
    ]
  },

  // ============================================
  // SECTION 7: REGISTERED AGENT
  // ============================================
  {
    id: 'registered_agent',
    title: 'Registered Agent Information',
    description: 'Your LLC\'s official contact for legal documents',
    order: 7,
    visibility: { type: 'product', product: 'registered_agent' },
    questions: [
      {
        id: 'ra_selection',
        type: 'radio',
        label: 'Registered Agent Service',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'our_service', label: 'Use our Registered Agent Service', description: 'We handle all legal document delivery for you' },
          { value: 'self', label: 'I will be my own registered agent', description: 'You must have a physical address in the state and be available during business hours' },
          { value: 'other', label: 'I have another registered agent' }
        ],
        defaultValue: 'our_service'
      },
      {
        id: 'ra_name',
        type: 'text',
        label: 'Registered Agent Name',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'ra_selection',
          answerValue: 'other',
          operator: 'equals'
        }
      },
      {
        id: 'ra_address',
        type: 'address',
        label: 'Registered Agent Address',
        helpText: 'Must be a physical address in the state of formation (no P.O. boxes)',
        required: true,
        visibility: {
          type: 'compound',
          logic: 'or',
          conditions: [
            { type: 'answer', questionId: 'ra_selection', answerValue: 'self', operator: 'equals' },
            { type: 'answer', questionId: 'ra_selection', answerValue: 'other', operator: 'equals' }
          ]
        }
      }
    ]
  },

  // ============================================
  // SECTION 8: BANK RESOLUTION
  // ============================================
  {
    id: 'bank_resolution',
    title: 'Bank Resolution Information',
    description: 'Information needed for your banking authorization documents',
    order: 8,
    visibility: { type: 'product', product: 'bank_resolution' },
    questions: [
      {
        id: 'bank_name',
        type: 'text',
        label: 'Bank Name (if known)',
        helpText: 'Leave blank if you haven\'t chosen a bank yet',
        required: false,
        visibility: { type: 'always' }
      },
      {
        id: 'authorized_signers_count',
        type: 'radio',
        label: 'How many people will be authorized to sign checks?',
        required: true,
        visibility: { type: 'always' },
        options: [
          { value: 'one', label: 'One person' },
          { value: 'multiple', label: 'Multiple people' }
        ],
        defaultValue: 'one'
      },
      {
        id: 'dual_signature_required',
        type: 'radio',
        label: 'Require two signatures for large transactions?',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'authorized_signers_count',
          answerValue: 'multiple',
          operator: 'equals'
        },
        options: [
          { value: 'no', label: 'No - Single signature always sufficient' },
          { value: 'yes', label: 'Yes - Require two signatures over a threshold' }
        ],
        defaultValue: 'no'
      },
      {
        id: 'dual_signature_threshold',
        type: 'currency',
        label: 'Dual signature required for amounts over:',
        required: true,
        visibility: {
          type: 'answer',
          questionId: 'dual_signature_required',
          answerValue: 'yes',
          operator: 'equals'
        }
      }
    ]
  },

  // ============================================
  // SECTION 9: REVIEW & CONFIRM
  // ============================================
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your information before submitting',
    order: 9,
    visibility: { type: 'always' },
    questions: [
      {
        id: 'confirmation',
        type: 'checkbox',
        label: 'I confirm that all information provided is accurate and complete to the best of my knowledge.',
        required: true,
        visibility: { type: 'always' }
      },
      {
        id: 'terms_agreement',
        type: 'checkbox',
        label: 'I understand that this information will be used to prepare my LLC formation documents and that I may be contacted for clarification if needed.',
        required: true,
        visibility: { type: 'always' }
      }
    ]
  }
];

// Helper function to get visible sections based on products
export function getVisibleSections(
  products: string[],
  responses: Record<string, any>
): QuestionnaireSection[] {
  return questionnaireSchema.filter(section => 
    evaluateVisibility(section.visibility, products, responses)
  );
}

// Helper function to evaluate visibility conditions
export function evaluateVisibility(
  condition: { type: string; product?: string; questionId?: string; answerValue?: any; operator?: string; conditions?: any[]; logic?: string },
  products: string[],
  responses: Record<string, any>
): boolean {
  switch (condition.type) {
    case 'always':
      return true;
    
    case 'product':
      return products.includes(condition.product!);
    
    case 'answer': {
      const answer = responses[condition.questionId!];
      if (condition.operator === 'equals') {
        return answer === condition.answerValue;
      } else if (condition.operator === 'not_equals') {
        return answer !== condition.answerValue;
      } else if (condition.operator === 'contains') {
        return Array.isArray(answer) && answer.includes(condition.answerValue);
      }
      return false;
    }
    
    case 'compound':
      if (condition.logic === 'and') {
        return condition.conditions!.every(c => evaluateVisibility(c, products, responses));
      } else {
        return condition.conditions!.some(c => evaluateVisibility(c, products, responses));
      }
    
    default:
      return true;
  }
}

// Get visible questions for a section
export function getVisibleQuestions(
  section: QuestionnaireSection,
  products: string[],
  responses: Record<string, any>
) {
  return section.questions.filter(q => 
    evaluateVisibility(q.visibility, products, responses)
  );
}
