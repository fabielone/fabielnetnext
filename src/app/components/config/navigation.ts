// config/navigation.ts
import { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
  {
    name: 'services.title',
    subItems: [
      {
        name: 'services.software.title',
        subSections: [
          { name: 'services.software.web', path: '/webdevelopment' },
        ],
      },
      {
        name: 'services.business.title',
        subSections: [
          { name: 'services.business.llc', path: '/business' },
        ]
      }
    ]
  },
  {
    name: 'clients',
    path: '/allies'
  },
  {
    name: 'partners',
    path: '/partners'
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