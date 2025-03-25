'use client';

import { motion } from 'framer-motion'; // Add animation
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { IoIosCalendar, IoIosCheckmarkCircle, IoIosRocket } from "react-icons/io";
import { IoFlash } from 'react-icons/io5';
import { HiArrowRight } from "react-icons/hi";
import Image from 'next/image';
import Pills, { PillsProps } from '../../atoms/pills/pills';
import { SocialIcons } from '../socials/socialicons';
import Link from 'next/link'

interface HeroLeftProps {
  heading: string;
  pills: PillsProps[];
}

export default function HeroLeft({ heading, pills }: HeroLeftProps) {
  const benefits = [
    {
      text: "Establece tu negocio con confianza.",
      icon: <IoIosCheckmarkCircle className="text-amber-500 w-6 h-6" />,
    },
    {
      text: "Potencia tu presencia en línea, nosotros nos encargamos.",
      icon: <IoFlash className="text-amber-500 w-6 h-6" />,
    },
    {
      text: "Impulsa el crecimiento de tu negocio, sin estrés.",
      icon: <IoIosRocket className="text-amber-500 w-6 h-6" />,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative font-serif px-0 md:px-4 pt-1 md:pt-6 mx-auto overflow-hidden "
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-16">
          {/* Heading Section with Animated Logo */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center sm:mt-2  mb-2 md:mb-12"
          >
           
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900">
              
              <span className="text-gray-600">
                Soluciones Personalizadas para tu Negocio
              </span>
            </h1>
          </motion.div>

          {/* Animated Pills Band */}
          <motion.div
  className="flex overflow-hidden whitespace-nowrap mb-8"
>
  <motion.div
    className="flex space-x-4"
    animate={{
      x: ["0%", "-100%"] // Moves from right to left
    }}
    transition={{
      duration: 20, // Adjust speed (higher = slower)
      ease: "linear", // Constant speed
      repeat: Infinity, // Loops forever
      repeatType: "loop" // Smooth continuous loop
    }}
  >
    {/* First set of pills */}
    {pills.map((pill, index) => (
      <motion.span
        key={`first-${index}`}
        whileHover={{ scale: 1.1 }}
        className="inline-block"
      >
        <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
      </motion.span>
    ))}
    
    {/* Duplicate set for seamless looping */}
    {pills.map((pill, index) => (
      <motion.span
        key={`second-${index}`}
        whileHover={{ scale: 1.1 }}
        className="inline-block"
      >
        <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
      </motion.span>
    ))}
  </motion.div>
</motion.div>

          {/* Benefits Section */}
          <motion.div 
            className=" text-gray-800 my-8 p-4 mx-6 sm:p-8 md:p-8 sm:mx-8 md:mx-8 bg-white rounded-3xl shadow-xl md:shadow-2xl border-2 border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ul className="space-y-2 md:space-y-6">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center bg-white md:bg-amber-50  p-1 md:p-4 rounded-xl"
                >
                  <span className="mr-4 transform hover:scale-110 transition-transform">
                    {benefit.icon}
                  </span>
                  <span className="font-xs md:font-medium">{benefit.text}</span>
                </motion.li>
              ))}
            </ul>
          
          </motion.div>

          
          {/* Call-to-Action Buttons */}
          <motion.div 
            className="text-lg mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="/checkout/schedule"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className=" text-gray-600 px-8 md:px-2 py-4 md:py-1 flex items-center transition-all transform hover:-translate-y-1"
            >
              <IoIosCalendar className="mr-2 h-6 w-6 md:w-8" />
              Consulta Gratis
            </motion.a>
           

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-green-50 text-green-700 border-2 border-green-700 px-8 md:px-4 py-4 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden group"
>
  <Link href="/checkout/businessformation" className="flex items-center" passHref>
   
      <span className="relative z-10">Empezar Ahora</span>
      <HiArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
    
  </Link>
  <motion.div
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
    initial={false}
  />
</motion.button>
          </motion.div>
          <div className='flex justify-center p-4'>
          <SocialIcons />
          </div>
        </div>
      </div>
    </motion.div>
  );
}