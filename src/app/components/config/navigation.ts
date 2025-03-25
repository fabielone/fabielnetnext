// config/navigation.ts
import { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
  {
    name: 'Servicios',
    subItems: [
      {
        name: 'Desarrollo de Software',
        subSections: [
          { name: 'Desarrollo Web y Blog ', path: '/software-development/web-and-blog-development' },
          { name: 'eCommerce: Creacion de Tiendas', path: '/software-development/ecommerce-development' },
          { name: 'Otros: Servicios Personalizados', path: '/software-development/other-services-personalized' },
        ],
      },{
        name: 'Marketing',
        subSections: [
          { 
            name: 'Marketing Digital y Contenido', 
            path: '/marketing/online-marketing-and-content-creation' 
          },
          { 
            name: 'Influencers y Colaboraciones', 
            path: '/marketing/influencers-collaboration' 
          },
          { 
            name: 'Campañas de Publicidad', 
            path: '/marketing/campanas-de-publicidad' 
          },
          { name: "Otros: Servicios Personalizados",
            path: '/marketing/other-services-personalized'
          }
        ],
      },
      {
        name: 'Formación de Empresas',
        subSections: [
          { name: 'Forma tu LLC', path: '/services/business-formations/form-your-llc' },
          { name: 'Agente Registrado', path: '/services/business-formations/registered-agent' },
          { name: 'Cumplimiento Anual', path: '/services/business-formations/compliance' },
          { name: 'Otros: Servicios Personalizados', 
            path: '/services/other-services-personalized'
           }
        ],
      },
    ],
  },
  {
    name: 'Clientes',
    path: '/allies',
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