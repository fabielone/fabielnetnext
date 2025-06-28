export interface LLCFormData {
  // Basic Info
  companyName: string;
  firstName: string;
  lastName: string;
  // ... all other fields
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
  needEIN?: boolean;
  needOperatingAgreement?: boolean;
  needBankLetter?: boolean;
}

export type Step = {
  id: number;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type UpdateFormData = <K extends keyof LLCFormData>(field: K, value: LLCFormData[K]) => void;
