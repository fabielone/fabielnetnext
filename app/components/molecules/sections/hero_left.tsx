'use client';

import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { IoIosCalendar, IoIosCheckmarkCircle, IoIosGlobe, IoIosRocket } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";

import Pills, { PillsProps } from '../../atoms/pills/pills';

interface HeroLeftProps {
  heading: string;
  pills: PillsProps[];
}

export default function HeroLeft({ heading, pills }: HeroLeftProps) {
    const benefits = [
        {
          text: "Establece tu negocio con confianza.",
          icon: <IoIosCheckmarkCircle className="text-blue-500 w-6 h-6" />,
        },
        {
          text: "Potencia tu presencia en línea, nosotros nos encargamos.",
          icon: <IoIosGlobe className="text-blue-500 w-6 h-6" />,
        },
        {
          text: "Impulsa el crecimiento de tu negocio, sin estrés.",
          icon: <IoIosRocket className="text-blue-500 w-6 h-6" />,
        },
      ];
      const reviews1 = [
        {
          text: "¡Fabiel.Net nos cambió la vida! Lanzamos nuestra tienda en línea en solo 2 semanas y ya estamos vendiendo como nunca antes.",
          author: "María G., Fundadora de Tienda Latina",
        },
        {
          text: "La experiencia con Fabiel.Net fue increíble. Nos guiaron paso a paso y nos ayudaron a evitar errores costosos. ¡Son los mejores!",
          author: "Juan P., Emprendedor de Tecnología",
        },
        {
          text: "Me encanta cómo Fabiel.Net se toma el tiempo para entender tus necesidades y objetivos. Son verdaderos socios en el éxito de tu negocio.",
          author: "Sofía R., Dueña de un negocio de servicios",
        },
      ];
      
      const reviews2 = [
        {
          text: "El equipo de marketing digital de Fabiel.Net es excepcional. Nuestras ventas han aumentado un 50% en solo 3 meses y nuestra presencia en línea es más fuerte que nunca.",
          author: "Carlos M., Gerente de Marketing de una empresa de retail",
        },
        {
          text: "Muy profesionales y atentos. Nos ayudaron a crear una página web moderna y funcional que refleja perfectamente nuestra marca y valores.",
          author: "Ana L., Diseñadora Gráfica y Emprendedora",
        },
        {
          text: "Lo que más me gusta de Fabiel.Net es su capacidad para explicar conceptos complejos de manera sencilla y accesible. Son verdaderos expertos en su campo.",
          author: "Luis G., Emprendedor de una startup de tecnología",
        },
        {
          text: "Después de trabajar con varios proveedores de servicios digitales, puedo decir que Fabiel.Net es el mejor. Su dedicación, profesionalismo y resultados son incomparables.",
          author: "Elena T., Dueña de un negocio de consultoría",
        },
      ];

  return (
    <div className="relative px-2 pt-4 mx-auto overflow-hidden">
      <div className="max-w-xl mx-auto lg:flex">
        <div className="mb-16 lg:mb-0">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
            <div className="max-w-xl mb-6">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
  <span className="text-orange-500">Fabiel.Net</span>: Soluciones Personalizadas para tu Negocio
</h1>     
              {/* Scrolling Pills Band */}
              <div className="overflow-hidden whitespace-nowrap mb-4">
                <div className="animate-scroll-right inline-block" style={{animationDuration: '30s'}}>
                  {pills.map((pill, index) => (
                    <span key={index} className="inline-block mx-4">
                      <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
                    </span>
                  ))}
                  {pills.map((pill, index) => (
                    <span key={`duplicate-${index}`} className="inline-block mx-4">
                      <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-t border-amber-100 my-4" />
              
              {/* Benefits Section */}
              <div className="text-lg text-gray-800 mt-2 mb-4 p-4 bg-yellow-200">
                <ul className="list-none list-inside space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3">{benefit.icon}</span>
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-orange-500 font-bold text-center mt-4 text-2xl">
  <span className="underline">Te ayudamos</span> a establecer y crecer tu negocio</p>
              </div>
 {/* Social Media Links */}
 <div className="flex justify-center space-x-4 mb-6">
              <a href="https://github.com/fabielone" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
              <a href="https://www.linkedin.com/in/fabielone" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
              <a href="https://www.facebook.com/fabielone" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
              <a href="https://www.instagram.com/fabielone" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
              <a href="https://www.tiktok.com/@fabiel.one" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
              <a href="https://www.youtube.com/c/fabielone" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="text-black h-6 w-6 hover:text-red-500 transition-colors" />
              </a>
            </div>

            {/* // ... (previous code remains the same) */}

{/* Call-to-Action Buttons */}
<div className="flex items-center space-x-4 justify-center mt-8">
  <a
    href="/contact"
    className="bg-amber-100 text-black px-6 py-3 rounded-lg flex items-center hover:bg-amber-200 transition-colors"
  >
    <IoIosCalendar className="mr-2 h-5 w-5" />
    Consulta Gratis
  </a>
  <button
    className="bg-white text-green-700 border-2 border-green-700 px-6 py-3 rounded-lg flex items-center hover:bg-green-50 transition-colors"
  >
    Empezar Ahora
    <HiArrowRight className="ml-2 h-5 w-5" />
  </button>
</div>

{/* // ... (rest of the code remains the same) */}

            </div>

            <hr className="border-t border-amber-100 my-4" />

           

          {/* Reviews Section - Two Rows */}
<div className="mb-8">
  {/* First row - scrolling left */}
  <div className="overflow-hidden whitespace-nowrap mb-6">
    <div className="animate-scroll-left inline-block" style={{animationDuration: '60s'}}>
      {reviews1.map((review, index) => (
        <div key={index} className="inline-block mx-8 p-4  rounded-lg shadow-md">
          <p className="text-gray-500 text-xl">{review.text}</p>
          <p className="text-gray-700 text-sm mt-2">{review.author}</p>
        </div>
      ))}
      {reviews1.map((review, index) => (
        <div key={`duplicate-${index}`} className="inline-block mx-8 p-4  rounded-lg shadow-md">
          <p className="text-gray-500 text-xl">{review.text}</p>
          <p className="text-gray-700 text-sm mt-2">{review.author}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Second row - scrolling right */}
  <div className="overflow-hidden whitespace-nowrap">
    <div className="animate-scroll-right inline-block" style={{animationDuration: '60s'}}>
      {reviews2.map((review, index) => (
        <div key={index} className="inline-block mx-8 p-4  rounded-lg shadow-md">
          <p className="text-gray-500 text-xl">{review.text}</p>
          <p className="text-gray-700 text-sm mt-2">{review.author}</p>
        </div>
      ))}
      {reviews2.map((review, index) => (
        <div key={`duplicate-${index}`} className="inline-block mx-8 p-4  rounded-lg shadow-md">
          <p className="text-gray-500 text-xl">{review.text}</p>
          <p className="text-gray-700 text-sm mt-2">{review.author}</p>
        </div>
      ))}
    </div>
  </div>
</div>

           
          </div>
        </div>
      </div>
    </div>
  );
}