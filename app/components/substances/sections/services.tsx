'use client'; 

import Header from '../../molecules/cards/servicecard'

const services = [
  {
    pill: 'Formación de Empresas',
    title: 'Establece tu Negocio con Confianza',
    subtitle: 'Formación de empresas en EE.UU. de manera rápida y segura',
    description: 'Nuestros expertos te ayudan a establecer tu negocio en los Estados Unidos de manera eficiente y cumpliendo con todos los requisitos legales.',
    buttonText: 'Empezar Ahora',
    buttonLink: '#',
    learnMoreLink: '#',
    imageUrl: './formacion.jpeg',
    items: [
      { icon: '📈', text: 'Registro de Empresa' },
      { icon: '📆', text: 'Cumplimiento Anual' },
      { icon: '📝', text: 'Documentación Legal' },
    ],
    imagePosition: 'right' as const,
  },
  {
    pill: 'Desarrollo Web',
    title: 'Crea una Presencia en Línea Fuerte',
    subtitle: 'Desarrollo de sitios web personalizados y responsivos',
    description: 'Nuestros desarrolladores web crean sitios web atractivos y fáciles de navegar que reflejan tu marca y atraen a tus clientes.',
    buttonText: 'Empezar Ahora',
    buttonLink: '#',
    learnMoreLink: '#',
    imageUrl: './web.jpeg',
    items: [
      { icon: '📱', text: 'Diseño Profesional' },
      { icon: '💻', text: 'Desarrollo Personalizado' },
      { icon: '⚡', text: 'Optimización de Rendimiento' },
    ],
    imagePosition: 'left' as const,
  },
  {
    pill: 'Marketing Digital',
    title: 'Aumenta tu Visibilidad en Línea',
    subtitle: 'Estrategias de marketing digital efectivas para tu negocio',
    description: 'Nuestros expertos en marketing digital te ayudan a crear campañas que atraen a tus clientes y aumentan tus ventas.',
    buttonText: 'Empezar Ahora',
    buttonLink: '#',
    learnMoreLink: '#',
    imageUrl: './marketing.jpeg',
    items: [
      { icon: '📈', text: 'SEO y Posicionamiento' },
      { icon: '💼', text: 'Gestión de Redes Sociales' },
      { icon: '📊', text: 'Análisis y Reportes' },
    ],
    imagePosition: 'right' as const,
  },
];

const MyServices = () => {
  return (
    <div className="flex flex-col items-center p-6 ">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-600">Servicios</h2>
      <span className="text-xl font-semibold text-center mb-8 text-gray-500">Soluciones para tu Negocio</span>
      <div className="flex flex-col space-y-12">
        {services.map((service, index) => (
          <Header
            key={index}
            pill={service.pill}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            buttonText={service.buttonText}
            buttonLink={service.buttonLink}
            learnMoreLink={service.learnMoreLink}
            imageUrl={service.imageUrl}
            items={service.items}
            imagePosition={service.imagePosition}
          />
        ))}
      </div>
    </div>
  );
};

export default MyServices;