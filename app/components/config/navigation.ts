// config/navigation.ts
import { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
  {
    name: 'Servicios',
    subItems: [
      {
        name: 'Desarrollo de Software',
        subSections: [
          { name: 'Desarrollo Web ', path: '/software-development/web' },
          { name: 'Tienda En Línea', path: '/software-development/applications' },
          { name: 'Automatización', path: '/software-development/solutions' },
        ],
      },
      {
        name: 'Marketing',
        subSections: [
          { name: 'Redes Sociales', path: '/marketing/social-media' },
          { name: 'Creación de Contenido', path: '/marketing/content-creation' },
          { name: 'Blog Posts', path: '/marketing/blog-posts' },
        ],
      },
      {
        name: 'Formación de Empresas',
        subSections: [
          { name: 'Forma tu LLC', path: '/services/business-formations/form-your-llc' },
          { name: 'Agente Registrado', path: '/services/business-formations/registered-agent' },
          { name: 'Cumplimiento Anual', path: '/services/business-formations/compliance' },
        ],
      },
    ],
  },
  {
    name: 'Clientes',
    path: '/allies',
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
    name: 'Nuestro Proceso',
    path: '/ourprocess',
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