// config/navigation.ts
import { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
  {
    name: 'services.title',
    subItems: [
      {
        name: 'services.software.title',
        subSections: [
          { name: 'services.software.web', path: '/software/web-blog' },
          { name: 'services.software.ecommerce', path: '/software/ecommerce' },
          { name: 'services.software.other', path: '/software/custom' },
        ],
      },
      {
        name: 'services.marketing.title',
        subSections: [
          { name: 'services.marketing.digital', path: '/marketing/digital' },
          { name: 'services.marketing.influencers', path: '/marketing/influencer' },
          { name: 'services.marketing.campaigns', path: '/marketing/social-media' },
          { name: 'services.marketing.other', path: '/contact' }
        ]
      },
      {
        name: 'services.business.title',
        subSections: [
          { name: 'services.business.llc', path: '/business/llc-formation' },
          { name: 'services.business.agent', path: '/business/registered-agent' },
          { name: 'services.business.compliance', path: '/business/compliance' },
          { name: 'services.business.other', path: '/contact' }
        ]
      },
      {
        name: 'services.bpo.title',
        subSections: [
          { name: 'services.bpo.outbound', path: '/bpo/outbound' },
          { name: 'services.bpo.backoffice', path: '/bpo/backoffice' }
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