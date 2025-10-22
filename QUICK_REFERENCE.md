# Quick Reference: New Application Structure

## Service Pages

### Business Formation
- **URL**: `/business` (same in both EN/ES)
- **Checkout**: `/checkout/businessformation`
- **Price**: $299 + State Fees (one-time)
- **Features**: All-in-one package (LLC + Registered Agent + Compliance)

### Web Development & Blog
- **URL**: `/webdevelopment` (ES: `/desarrollo-web`)
- **Checkout**: `/checkout/web` (ES: `/checkout/desarrollo-web`)
- **Pricing**:
  - Basic: $29.99/month
  - Pro: $59.99/month (recommended)
  - High Traffic: $299/month

## Checkout URLs with Product Selection

### Web Development Checkout
```
/checkout/web?product=web&tier=basics
/checkout/web?product=web&tier=pro
/checkout/web?product=web&tier=high-traffic
```

### Blog Service Checkout
```
/checkout/web?product=blog&tier=basics
/checkout/web?product=blog&tier=pro
/checkout/web?product=blog&tier=high-traffic
```

## Old URLs → New URLs

| Old URL | New URL | Status |
|---------|---------|--------|
| `/software` | `/webdevelopment` | Deleted |
| `/software/web-blog` | `/webdevelopment` | Deleted |
| `/software/ecommerce` | `/webdevelopment` | Deleted |
| `/software/custom` | `/webdevelopment` | Deleted |
| `/business/llc-formation` | `/business` | Deleted |
| `/business/compliance` | `/business` | Deleted |
| `/business/registered-agent` | `/business` | Deleted |
| `/checkout/schedule` | `/checkout/web` or `/checkout/businessformation` | Deleted |
| `/checkout/software` | `/checkout/web` | Deleted |

## Component Structure

### Service Types (TypeScript)
```typescript
import { 
  ServiceTier,           // 'basics' | 'pro' | 'high-traffic'
  ServiceType,           // 'web' | 'blog'
  ServicePricing,        // Pricing interface
  WEB_DEVELOPMENT_TIERS, // Web pricing array
  BLOG_SERVICE_TIERS,    // Blog pricing array
  getServiceTierByName,  // Helper function
  getAllTiers            // Helper function
} from '@/app/components/types/services';
```

## Navigation Patterns

### From Homepage
1. User sees two services: Business Formation, Web Development
2. Clicks "Get Started" → Goes to checkout
3. Clicks "Learn More" → Goes to service detail page

### Web Development Flow
1. User visits `/webdevelopment`
2. Toggles between Web and Blog tabs
3. Selects pricing tier
4. Clicks "Get Started" → Redirects to `/checkout/web?product=X&tier=Y`

### Business Formation Flow
1. User visits `/business`
2. Sees complete package details
3. Clicks CTA → Goes to `/checkout/businessformation`

## Key Features Removed
- ❌ Scheduling system (calendar, appointments)
- ❌ Individual business service pages
- ❌ Multiple software development pages
- ❌ Consultation scheduling

## Key Features Added
- ✅ Tiered pricing for web/blog services
- ✅ Product preselection in checkout
- ✅ Consolidated business formation package
- ✅ Modern pricing cards with feature comparison
- ✅ Bilingual support maintained

## Next Implementation Steps
1. Add Stripe payment integration to `/checkout/web`
2. Set up subscription management system
3. Create admin dashboard for service tracking
4. Add 301 redirects for old URLs
5. Update sitemap.xml with new routes
6. Test all translation strings
