// Service tier definitions for web development and blog services

export type ServiceTier = 'basics' | 'pro' | 'high-traffic';

export interface ServicePricing {
  tier: ServiceTier;
  name: string;
  price: number;
  priceDisplay: string;
  billingPeriod: 'monthly' | 'one-time';
  description: string;
  features: string[];
  recommended?: boolean;
}

// Web Development Service Tiers
export const WEB_DEVELOPMENT_TIERS: ServicePricing[] = [
  {
    tier: 'basics',
    name: 'Web Basics',
    price: 29.99,
    priceDisplay: '$29.99',
    billingPeriod: 'monthly',
    description: 'Perfect for small businesses and startups needing a professional online presence',
    features: [
      'Up to 5 pages',
      'Mobile-responsive design',
      'Basic SEO optimization',
      'Contact form integration',
      'SSL certificate included',
      'Monthly performance reports',
      'Email support'
    ]
  },
  {
    tier: 'pro',
    name: 'Web Pro',
    price: 59.99,
    priceDisplay: '$59.99',
    billingPeriod: 'monthly',
    description: 'Advanced features for growing businesses that need more functionality',
    features: [
      'Up to 15 pages',
      'Custom design & branding',
      'Advanced SEO optimization',
      'Content Management System (CMS)',
      'Payment gateway integration',
      'Social media integration',
      'Google Analytics setup',
      'Weekly performance reports',
      'Priority email & chat support',
      'Monthly content updates (up to 3 pages)'
    ],
    recommended: true
  },
  {
    tier: 'high-traffic',
    name: 'Web High Traffic',
    price: 299.00,
    priceDisplay: '$299',
    billingPeriod: 'monthly',
    description: 'Enterprise-grade solution for high-traffic websites and complex requirements',
    features: [
      'Unlimited pages',
      'Premium custom design',
      'Enterprise SEO optimization',
      'Advanced CMS with multi-user access',
      'E-commerce platform integration',
      'Multiple payment gateways',
      'CDN & performance optimization',
      'Advanced security features',
      'Load balancing & scaling',
      'Real-time analytics dashboard',
      'Dedicated account manager',
      '24/7 priority support',
      'Unlimited content updates',
      'Monthly strategy consultation'
    ]
  }
];

// Blog Service Tiers
export const BLOG_SERVICE_TIERS: ServicePricing[] = [
  {
    tier: 'basics',
    name: 'Blog Basics',
    price: 29.99,
    priceDisplay: '$29.99',
    billingPeriod: 'monthly',
    description: 'Start your content marketing journey with essential blog features',
    features: [
      'Up to 4 blog posts per month',
      'Basic blog design',
      'Comment system integration',
      'RSS feed setup',
      'Social sharing buttons',
      'Basic SEO for posts',
      'Email notifications',
      'Monthly analytics report'
    ]
  },
  {
    tier: 'pro',
    name: 'Blog Pro',
    price: 59.99,
    priceDisplay: '$59.99',
    billingPeriod: 'monthly',
    description: 'Enhanced blogging platform with advanced content management and marketing tools',
    features: [
      'Up to 12 blog posts per month',
      'Custom blog design & templates',
      'Advanced comment moderation',
      'Newsletter integration',
      'Multi-author support',
      'Advanced SEO & keyword optimization',
      'Social media auto-posting',
      'Email subscriber management',
      'Content calendar planning',
      'Weekly analytics & insights',
      'Editorial support & proofreading'
    ],
    recommended: true
  },
  {
    tier: 'high-traffic',
    name: 'Blog High Traffic',
    price: 299.00,
    priceDisplay: '$299',
    billingPeriod: 'monthly',
    description: 'Professional content platform for serious publishers and content creators',
    features: [
      'Unlimited blog posts',
      'Premium custom design',
      'Advanced editorial workflow',
      'Multi-site blog network',
      'Advanced newsletter & automation',
      'Content personalization engine',
      'A/B testing for content',
      'Enterprise SEO tools',
      'Advanced analytics & attribution',
      'CDN & caching optimization',
      'Podcast & video integration',
      'Dedicated content strategist',
      'Professional editing & optimization',
      'Real-time performance monitoring',
      '24/7 priority support'
    ]
  }
];

export type ServiceType = 'web' | 'blog';

export interface CheckoutProduct {
  serviceType: ServiceType;
  tier: ServiceTier;
  pricing: ServicePricing;
}

// Helper functions
export function getServiceTierByName(serviceType: ServiceType, tierName: ServiceTier): ServicePricing | undefined {
  const tiers = serviceType === 'web' ? WEB_DEVELOPMENT_TIERS : BLOG_SERVICE_TIERS;
  return tiers.find(tier => tier.tier === tierName);
}

export function getAllTiers(serviceType: ServiceType): ServicePricing[] {
  return serviceType === 'web' ? WEB_DEVELOPMENT_TIERS : BLOG_SERVICE_TIERS;
}
