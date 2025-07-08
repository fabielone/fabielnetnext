// app/privacidad/page.tsx
import { 
  RiShieldLine, 
  RiTimeLine, 
  RiUserLine, 
  RiLockLine,
  RiGlobalLine,
  RiMailLine,
  RiQuestionLine
} from 'react-icons/ri';

import {BiCookie} from 'react-icons/bi'
  
export const metadata = {
  title: 'Política de Privacidad | Fabiel.net',
  description: 'Conoce cómo protegemos y manejamos tu información personal.',
};
  
const lastUpdated = '15 de Diciembre de 2023';
  
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-amber-100 rounded-full">
                <RiShieldLine className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Política de Privacidad
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Esta política describe cómo recopilamos, 
              usamos y protegemos tu información personal.
            </p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <RiTimeLine className="h-5 w-5 mr-2" />
              Última actualización: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
  
      {/* Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {[
                { id: 'recopilacion', icon: RiUserLine, text: 'Recopilación de Información' },
                { id: 'uso', icon: RiGlobalLine, text: 'Uso de la Información' },
                { id: 'proteccion', icon: RiLockLine, text: 'Protección de Datos' },
                { id: 'cookies', icon: BiCookie, text: 'Cookies' },
                { id: 'comunicaciones', icon: RiMailLine, text: 'Comunicaciones' },
                { id: 'derechos', icon: RiShieldLine, text: 'Tus Derechos' },
                { id: 'contacto', icon: RiQuestionLine, text: 'Contacto' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-white hover:shadow-md transition-all"
                >
                  <item.icon className="mr-3 h-5 w-5 text-amber-600" />
                  <span className="text-gray-900">{item.text}</span>
                </a>
              ))}
            </nav>
          </div>
  
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section id="recopilacion" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recopilación de Información
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Recopilamos información que nos proporcionas directamente cuando:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Creas una cuenta en nuestra plataforma</li>
                  <li>Realizas una compra o transacción</li>
                  <li>Te comunicas con nuestro equipo de soporte</li>
                  <li>Te suscribes a nuestro boletín</li>
                  <li>Participas en encuestas o promociones</li>
                </ul>
              </div>
            </section>
  
            <section id="uso" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Uso de la Información
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Utilizamos la información recopilada para:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Proporcionar y mantener nuestros servicios</li>
                  <li>Procesar tus transacciones</li>
                  <li>Enviar comunicaciones administrativas</li>
                  <li>Mejorar nuestros servicios</li>
                  <li>Prevenir actividades fraudulentas</li>
                </ul>
              </div>
            </section>
  
            <section id="proteccion" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Protección de Datos
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Encriptación de datos sensibles</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Copias de seguridad regulares</li>
                </ul>
              </div>
            </section>
  
            <section id="cookies" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cookies
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Utilizamos cookies y tecnologías similares para:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Mantener tu sesión activa</li>
                  <li>Recordar tus preferencias</li>
                  <li>Analizar el uso de nuestros servicios</li>
                  <li>Personalizar tu experiencia</li>
                </ul>
              </div>
            </section>
  
            <section id="comunicaciones" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Comunicaciones
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Podrás recibir comunicaciones nuestras relacionadas con:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Actualizaciones de servicio</li>
                  <li>Cambios en políticas</li>
                  <li>Boletines informativos (si te suscribiste)</li>
                  <li>Ofertas especiales (con tu consentimiento)</li>
                </ul>
              </div>
            </section>
  
            <section id="derechos" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tus Derechos
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Tienes derecho a:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Acceder a tu información personal</li>
                  <li>Rectificar datos incorrectos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de datos</li>
                  <li>Retirar tu consentimiento</li>
                </ul>
              </div>
            </section>
  
            <section id="contacto" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contacto
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  Para cualquier consulta sobre esta política o tus derechos, puedes contactarnos:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Email: privacy@fabiel.net</li>
                  <li>Teléfono: +1 (555) 123-4567</li>
                  <li>Dirección: 123 Privacy Street, Tech City, TC 12345</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
  
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Fabiel.net. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}