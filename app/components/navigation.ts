// config/navigation.ts
import { NavItem } from './types';

export const navItems: NavItem[] = [
  {
    name: 'Servicios',
    subItems: [
      {
        name: 'Desarrollo de Software',
        subSections: [
          { name: 'Web', path: '/services/software-development/web' },
          { name: 'Tienda En Línea', path: '/services/software-development/applications' },
          { name: 'Automatización', path: '/services/software-development/solutions' },
        ],
      },
      // ... rest of your navigation items
    ],
  },
  // ... rest of your top-level items
];