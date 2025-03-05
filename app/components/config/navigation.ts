// config/navigation.ts
import { NavItem } from '../types/navigation';

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
      {
        name: 'Marketing',
        subSections: [
          { name: 'Redes Sociales', path: '/services/marketing/social-media' },
          { name: 'Creación de Contenido', path: '/services/marketing/content-creation' },
          { name: 'Blog', path: '/services/marketing/blog' },
        ],
      },
      {
        name: 'Formación de Empresas',
        subSections: [
          { name: 'Forma tu LLC', path: '/services/business-formations/form-your-llc' },
          { name: 'Agente Registrado', path: '/services/business-formations/registered-agent' },
          { name: 'Cumplimiento', path: '/services/business-formations/compliance' },
        ],
      },
    ],
  },
  {
    name: 'Clientes',
    path: '/clientes',
  },
  {
    name: 'Servicio Black',
    subItems: [
      {
        name: 'Servicio de Concierge',
        subSections: [
          { name: 'Paquete Todo Incluido', path: '/services/vip/concierge' },
        ],
      },
      {
        name: 'Asesoría Exclusiva',
        subSections: [
          { name: 'Consultoría Personalizada', path: '/services/vip/consulting' },
          { name: 'Soporte Prioritario', path: '/services/vip/priority-support' },
        ],
      },
    ],
  },
  {
    name: 'Blog',
    path: '/blog',
  },
  {
    name: 'Contacto',
    path: '/contact',
  },
];