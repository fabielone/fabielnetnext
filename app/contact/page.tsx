// app/contacto/page.tsx
import { 
    RiCustomerService2Line, 
    RiTimeLine, 
    RiMailLine, 
    RiPhoneLine, 
    RiMessage2Line,
    RiTeamLine,
    RiQuestionLine,
    RiBookReadLine
  } from 'react-icons/ri';
  import { SocialIcons } from '../components/molecules/socials/socialicons';
  
  export const metadata = {
    title: 'Contacto | Fabiel.net',
    description: 'Ponte en contacto con nuestro equipo de ventas y soporte.',
  };
  
  export default function                          Page() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Sección Hero */}
        <div className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Conecta con Nosotros</span>
                    <span className="block text-blue-600">Estamos para Ayudarte</span>
                  </h1>
                  <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Ya sea que estés interesado en nuestros servicios o necesites soporte, nuestro equipo está listo para asistirte.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>
  
        {/* Secciones de Contacto */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sección de Ventas */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <RiTeamLine className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">Equipo de Ventas</h2>
                      <p className="text-gray-500">Crezcamos juntos</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Disponible
                  </span>
                </div>
  
                <div className="mt-8 space-y-6">
                  <div className="flex items-center">
                    <RiMailLine className="h-6 w-6 text-gray-400" />
                    <a href="mailto:sales@fabiel.net" className="ml-3 text-gray-600 hover:text-blue-500">
                      sales@fabiel.net
                    </a>
                  </div>
                  <div className="flex items-center">
                    <RiTimeLine className="h-6 w-6 text-gray-400" />
                    <span className="ml-3 text-gray-600">
                      8:00 AM - 5:00 PM (Hora del Pacífico)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <RiMessage2Line className="h-6 w-6 text-gray-400" />
                    <span className="ml-3 text-gray-600">
                      Chat en Vivo Disponible
                    </span>
                  </div>
                </div>
  
                <div className="mt-8">
                  <SocialIcons  />
                </div>
              </div>
            </div>
  
            {/* Sección de Soporte */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center">
                        <RiCustomerService2Line className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">Soporte Premium Gold</h2>
                      <p className="text-gray-600">Asistencia preferencial</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800">
                    24/7
                  </span>
                </div>
  
                <div className="mt-8 space-y-6">
                  <div className="flex items-center">
                    <RiMailLine className="h-6 w-6 text-gray-400" />
                    <a href="mailto:support@fabiel.net" className="ml-3 text-gray-600 hover:text-yellow-600">
                      support@fabiel.net
                    </a>
                  </div>
                  <div className="flex items-center">
                    <RiPhoneLine className="h-6 w-6 text-gray-400" />
                    <span className="ml-3 text-gray-600">
                      Líneas Telefónicas Próximamente
                    </span>
                  </div>
                  <div className="flex items-center">
                    <RiMessage2Line className="h-6 w-6 text-gray-400" />
                    <span className="ml-3 text-gray-600">
                      Soporte por Chat Prioritario
                    </span>
                  </div>
                </div>
  
                <div className="mt-8">
                  <SocialIcons  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Opciones Adicionales de Contacto */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Formas Adicionales de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <RiMessage2Line className="h-8 w-8 text-blue-500 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Chat en Vivo</h4>
                  <p className="text-gray-600">
                    Obtén respuestas instantáneas a través de nuestro sistema de chat.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <RiTeamLine className="h-8 w-8 text-blue-500 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Redes Sociales</h4>
                  <p className="text-gray-600">
                    Síguenos y contáctanos a través de tu red social preferida.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <RiMailLine className="h-8 w-8 text-blue-500 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Correo Electrónico</h4>
                  <p className="text-gray-600">
                    Envíanos un correo y responderemos en menos de 24 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Sección FAQ */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Buscas Respuestas Rápidas?
            </h3>
            <p className="text-gray-600 mb-8">
              Consulta nuestras preguntas frecuentes o base de conocimientos.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/preguntas-frecuentes"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <RiQuestionLine className="mr-2" />
                Preguntas Frecuentes
              </a>
              <a
                href="/base-de-conocimiento"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RiBookReadLine className="mr-2" />
                Base de Conocimiento
              </a>
            </div>
          </div>
        </div>
  
        {/* Footer Note */}
        <div className="text-center py-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Fabiel.net. Todos los derechos reservados.</p>
        </div>
      </div>
    );
  }