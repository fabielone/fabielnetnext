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
  llcSuffix: 'LLC' | 'L.L.C.' | 'Limited Liability Company';  // LLC suffix choice
  alternateNames: string[];  // Optional backup LLC names
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
  website: string | null;  // Primary website tier: 'essential' | 'professional'
  blogPro: boolean;  // Blog Pro can be added to any tier
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
  paymentCardLast4?: string;
  paymentCardBrand?: string;
  stripeCustomerId?: string;     // Stripe customer ID for subscription setup
  stripePaymentMethodId?: string; // Stripe payment method ID for subscription setup
  
  // Formation State
  formationState: string;      // State code (e.g., "CA", "TX")
  rushProcessing: boolean;     // Rush processing option
  stateFilingFee: number;      // State filing fee (from state-fees API)
  stateRushFee: number | null; // Rush processing fee (from state-fees API)
  
  // Coupon/Discount
  couponCode: string;          // Applied coupon code
  couponDiscount: number;      // Discount amount in dollars
  
  // Order identification
  orderId: string;             // Generated order ID (e.g., "ORD-1234567890-123")
  
  // Service Selection Fields (just types, not initial values)
  needLLCFormation?: boolean;  // Required service
  needEIN?: boolean;
  needOperatingAgreement?: boolean;
  needBankLetter?: boolean;
}

// Web service tiers
export type WebServiceTier = 'essential' | 'professional' | 'blogPro' | null;

// Web service pricing configuration
export const WEB_SERVICE_PRICING = {
  essential: {
    name: 'Essential',
    price: 29.99,
    originalPrice: 59.99,
    features: [
      'Professional business website',
      'Company information pages',
      'Contact form with notifications',
      'Portfolio/gallery section',
      'Mobile responsive design',
      'SSL certificate included',
      'Basic SEO setup'
    ]
  },
  professional: {
    name: 'Professional',
    price: 49.99,
    originalPrice: 99.99,
    features: [
      'Everything in Essential',
      'Live chat integration',
      'Chat automation & auto-responses',
      'Appointment scheduling system',
      'Basic e-commerce (up to 25 products)',
      'Payment processing setup',
      'Advanced SEO optimization',
      'Priority support'
    ]
  },
  blogPro: {
    name: 'Blog Pro',
    price: 49.99,
    originalPrice: 99.99,
    features: [
      'Everything in Essential',
      'Blog with monetization setup',
      'Ad integration (Google AdSense)',
      'Automated content scheduling',
      'Email newsletter integration',
      'Social media automation',
      'Analytics dashboard',
      'Content performance tracking'
    ]
  }
} as const;

export type Step = {
  id: number;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type UpdateFormData = <K extends keyof LLCFormData>(field: K, value: LLCFormData[K]) => void;