// Questionnaire Types & Schema

export type QuestionType = 
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkbox_group'
  | 'number'
  | 'currency'
  | 'date'
  | 'address'
  | 'member_list'
  | 'percentage_split';

export interface VisibilityCondition {
  type: 'always' | 'product' | 'state' | 'answer' | 'compound';
  product?: string;
  states?: string[];
  questionId?: string;
  answerValue?: any;
  operator?: 'equals' | 'not_equals' | 'contains' | 'in';
  conditions?: VisibilityCondition[];
  logic?: 'and' | 'or';
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'min' | 'max';
  value?: any;
  message: string;
  validator?: string;
}

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export interface MemberField {
  id: string;
  type: QuestionType;
  label: string;
  options?: Option[];
  visibility?: VisibilityCondition;
  required?: boolean;
  source?: string;
  min?: number;
  max?: number;
  helpText?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  helpText?: string;
  required: boolean;
  visibility: VisibilityCondition;
  validation?: ValidationRule[];
  options?: Option[];
  defaultValue?: any;
  prePopulateFrom?: string;
  dependsOn?: string;
  stateSpecific?: boolean;
  memberFields?: MemberField[];
  source?: string;
  min?: number;
  max?: number;
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  visibility: VisibilityCondition;
  questions: Question[];
}

export interface QuestionnaireData {
  id: string;
  orderId: string;
  stateCode: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  currentSection?: string;
  responses: Record<string, any>;
  prePopulatedData: Record<string, any>;
  products: string[];
}

export interface StateConfig {
  stateCode: string;
  stateName: string;
  defaults?: Record<string, any>;
  professionalLicenses?: Array<{ code: string; label: string }>;
  restrictions?: Record<string, boolean>;
  requiresPLLC?: boolean;
}

// Address type for form fields
export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Member data structure
export interface MemberData {
  id?: string;
  memberType: 'individual' | 'entity';
  fullName: string;
  entityType?: string;
  address: AddressData;
  email: string;
  phone: string;
  ownershipPercentage: number;
  ssnEin?: string;
}
