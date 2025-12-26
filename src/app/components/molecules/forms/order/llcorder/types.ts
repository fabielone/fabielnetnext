import { ComponentType, SVGProps } from 'react';

export interface StateFee {
  stateCode: string;
  stateName: string;
  filingFee: number;
  rushFee: number | null;
  rushAvailable: boolean;
  rushDays: number | null;
  standardDays: number;
}

export interface RegisteredAgentPrice {
  stateCode: string;
  annualFee: number;
  firstYearFee: number | null;
}

export interface LLCFormData {
  // Basic Info
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessAddress: string;
  businessCity: string;
  businessZip: string;
  businessPurpose: string;
  registeredAgent: boolean;
  compliance: boolean;
  paymentMethod: 'stripe' | 'paypal';
  website: string | null;
  phone: string;
  address: string;
  managementStructure?: string;
  numberOfMembers?: string;
  principalActivity?: string;
  businessStartDate?: string;
  responsiblePartySSN?: string;
  expectedEmployees?: string;
  profitDistribution?: string;
  votingRights?: string;
  allowMemberTransfer?: boolean;
  requireMeetings?: boolean;
  paymentTransactionId?: string;
  paymentProvider?: 'stripe' | 'paypal';
  
  // Formation State
  formationState: string;      // State code (e.g., "CA", "TX")
  rushProcessing: boolean;     // Rush processing option
  
  // Service Selection Fields (just types, not initial values)
  needLLCFormation?: boolean;  // Required service
  needEIN?: boolean;
  needOperatingAgreement?: boolean;
  needBankLetter?: boolean;
}

export type Step = {
  id: number;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type UpdateFormData = <K extends keyof LLCFormData>(field: K, value: LLCFormData[K]) => void;