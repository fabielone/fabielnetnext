// config/navigation.ts
import { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
  {
    name: 'services.title',
    subItems: [
      {
        name: 'services.software.title',
        subSections: [
          { name: 'services.software.web', path: '/software-development/web-and-blog-development' },
          { name: 'services.software.ecommerce', path: '/software-development/ecommerce-development' },
          { name: 'services.software.other', path: '/software-development/other-services-personalized' },
        ],
      },
      {
        name: 'services.marketing.title',
        subSections: [
          { name: 'services.marketing.digital', path: '/marketing/online-marketing-and-content-creation' },
          { name: 'services.marketing.influencers', path: '/marketing/influencers-collaboration' },
          { name: 'services.marketing.campaigns', path: '/marketing/campanas-de-publicidad' },
          { name: 'services.marketing.other', path: '/marketing/other-services-personalized' }
        ]
      },
      {
        name: 'services.business.title',
        subSections: [
          { name: 'services.business.llc', path: '/services/business-formations/form-your-llc' },
          { name: 'services.business.agent', path: '/services/business-formations/registered-agent' },
          { name: 'services.business.compliance', path: '/services/business-formations/compliance' },
          { name: 'services.business.other', path: '/services/other-services-personalized' }
        ]
      }
    ]
  },
  {
    name: 'clients',
    path: '/allies'
  },
  {
    name: 'process',
    path: '/ourprocess'
  },
  {
    name: 'blog',
    path: 'https://blog.fabiel.net'
  },
  {
    name: 'contact',
    path: '/contact'
  }
];