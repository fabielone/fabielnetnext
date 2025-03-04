'use client';

import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { IoIosCalendar, IoIosCheckmarkCircle, IoIosRocket } from "react-icons/io";
import { IoFlash } from 'react-icons/io5'; // Import the thunderbolt
import { HiArrowRight } from "react-icons/hi";
import Image from 'next/image'; // Import the Image component
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
      icon: <IoFlash className="text-blue-500 w-6 h-6" />,
    },
    {
      text: "Impulsa el crecimiento de tu negocio, sin estrés.",
      icon: <IoIosRocket className="text-blue-500 w-6 h-6" />,
    },
  ];

  return (
    <div className="relative px-2 pt-4 mx-auto overflow-hidden">
      <div className="max-w-xl mx-auto lg:flex">
        <div className="mb-16 lg:mb-0">
          <div className="bg-white">
            <div className="max-w-xl mb-6">
              {/* Heading Section with Inline Logo */}
              <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
                {/* Logo */}
                <Image
                  src="/logo.png" // Path to your logo in the public folder
                  alt="Fabiel.Net Logo"
                  width={250} // Adjust width as needed
                  height={100} // Adjust height as needed
                  className="inline-block align-middle mr-2" // Make the logo inline
                />
                {/* Colon and Text */}
                <span className="text-orange-500 text-4xl align-middle">:</span> Soluciones Personalizadas para tu Negocio
              </h1>

              {/* Scrolling Pills Band */}
              <div className="overflow-hidden whitespace-nowrap mb-4">
                <div className="flex justify-center" style={{ animationDuration: '30s' }}>
                  {pills.map((pill, index) => (
                    <span key={index} className="inline-block text-med mx-4">
                      <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-t border-amber-100 my-4" />

              {/* Benefits Section */}
              <div className="text-lg text-gray-800 mt-2 mb-4 p-4 bg-yellow-100 border-2 border-dashed border-gray-500 rounded-2xl">
                <ul className="list-none list-inside space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3">{benefit.icon}</span>
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-orange-500 font-bold text-center mt-4 text-2xl">
                  <span className="underline">Te ayudamos</span> a establecer y crecer tu negocio
                </p>
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
                  className="bg-yellow-300 text-back border-2 border-black px-6 py-3 rounded-lg flex items-center hover:bg-green-50 transition-colors"
                >
                  Empezar Ahora
                  <HiArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            <hr className="border-t border-amber-100 my-4" />
          </div>
        </div>
      </div>
    </div>
  );
}