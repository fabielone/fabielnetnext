// components/ProcesoPage.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaChartLine, FaHeadset, FaFileAlt, FaPlusCircle, FaCheckCircle, FaQuestionCircle, FaArrowRight, FaLaptop } from 'react-icons/fa';
import { MdPayment, MdPayments } from 'react-icons/md';
export default function ProcesoPage() {
  const [mostrarFAQ, setMostrarFAQ] = useState<number | null>(null);

  const alternarFAQ = (index: number) => {
    setMostrarFAQ(mostrarFAQ === index ? null : index);
  };

  // Pasos actualizados según tu requerimiento
  const pasosProceso = [
    {
      icono: <FaShoppingCart className="text-amber-500 w-8 h-8" />,
      titulo: 'Selección de Servicio',
      descripcion: 'Elige entre nuestros servicios principales o combínalos según tus necesidades.'
    },
    {
      icono: <FaHeadset className="text-amber-500 w-8 h-8" />,
      titulo: 'Consulta con Agente',
      descripcion: 'Si lo necesitas, habla con un especialista para asesoría personalizada.'
    },
    {
      icono: <MdPayment className="text-amber-500 w-8 h-8" />,
      titulo: 'Procesar Pedido',
      descripcion: 'Confirmamos los detalles y comenzamos a trabajar en tu solicitud.'
    },
    {
      icono: <FaPlusCircle className="text-amber-500 w-8 h-8" />,
      titulo: 'Requisitos Adicionales',
      descripcion: 'Si necesitamos más información, nos comunicaremos contigo rápidamente.'
    },
    {
      icono: <FaCheckCircle className="text-green-500 w-8 h-8" />,
      titulo: 'Pedido Completado',
      descripcion: 'Finalizamos el proceso y te entregamos los resultados acordados.'
    }
  ];

  const servicios = [
    {
      id: 'formacion',
      nombre: 'Formación de Empresas',
      descripcion: 'Constitución legal de LLCs, corporaciones y otros tipos de entidades comerciales.',
      icono: <FaFileAlt className="text-amber-500 w-6 h-6" />,
      url: '/servicios/formacion'
    },
    {
      id: 'software',
      nombre: 'Desarrollo de Software',
      descripcion: 'Soluciones tecnológicas personalizadas para optimizar tus operaciones.',
      icono: <FaLaptop className="text-amber-500 w-6 h-6" />,
      url: '/servicios/software'
    },
    {
      id: 'marketing',
      nombre: 'Estrategias de Marketing',
      descripcion: 'Campañas digitales efectivas para aumentar tu presencia en el mercado.',
      icono: <FaChartLine className="text-amber-500 w-6 h-6" />,
      url: '/servicios/marketing'
    }
  ];

  const preguntasFrecuentes = [
    { 
      pregunta: '¿Cómo selecciono el servicio adecuado?', 
      respuesta: 'Nuestra página de servicios detalla cada opción. Si tienes dudas, puedes solicitar una consulta gratuita con un agente para recibir recomendaciones personalizadas.' 
    },
    { 
      pregunta: '¿Qué información necesitan para procesar mi pedido?', 
      respuesta: 'Depende del servicio. Para formación de empresas necesitaremos documentos de identificación y detalles comerciales. Para software y marketing, analizaremos tus requerimientos específicos.' 
    },
    { 
      pregunta: '¿Puedo añadir servicios adicionales después?', 
      respuesta: 'Sí, nuestro sistema es flexible. Puedes complementar tu pedido inicial con otros servicios cuando lo necesites.' 
    },
    { 
      pregunta: '¿Qué pasa si no respondo a solicitudes de información adicional?', 
      respuesta: 'Pausaremos temporalmente el procesamiento hasta recibir toda la información necesaria, pero siempre nos comunicaremos claramente sobre los plazos.' 
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Cómo Trabajamos</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Un proceso claro y transparente desde la selección de servicios hasta la entrega final.
        </p>
      </div>

      {/* Pasos del Proceso - Versión actualizada */}
      <div className="mb-20">
        <div className="relative">
          {/* Línea de progreso */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {pasosProceso.map((paso, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center"
              >
                <div className="flex justify-center mb-4 bg-white p-2 rounded-full">
                  {paso.icono}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="bg-gray-100 text-gray-800 font-medium rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">{paso.titulo}</h3>
                  </div>
                  <p className="text-gray-600">{paso.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Nuestros Servicios */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <motion.div
              key={servicio.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {servicio.icono}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{servicio.nombre}</h3>
                </div>
                <p className="text-gray-600 mb-6">{servicio.descripcion}</p>
                <a
                  href={servicio.url}
                  className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700"
                >
                  Seleccionar servicio <FaArrowRight className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Preguntas Comunes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {preguntasFrecuentes.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => alternarFAQ(index)}
                className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-800">{faq.pregunta}</span>
                <FaQuestionCircle className={`w-5 h-5 ${mostrarFAQ === index ? 'text-amber-500' : 'text-gray-400'}`} />
              </button>
              
              {mostrarFAQ === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5 text-gray-600"
                >
                  {faq.respuesta}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿Preparado para Iniciar?</h2>
        <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
          Selecciona tu servicio ahora o habla con un agente para una recomendación personalizada.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/servicios"
            className="px-6 py-3 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Ver Servicios <FaArrowRight className="ml-2" />
          </a>
          <a
            href="/contacto"
            className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center"
          >
            Hablar con Agente <FaHeadset className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}