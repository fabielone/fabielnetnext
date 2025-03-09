'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { IoIosPlay } from "react-icons/io";
import Image from 'next/image';
import Newsletter from '../newsletter/subscribe';

export default function HeroRight() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="pt-4 flex"
    >
      <div className="container mx-auto px-0 md:px-4">
        <div className="flex flex-col items-center h-full">
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col h-full w-full max-w-xl border border-gray-100"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            {/* Video Section */}
            <motion.div 
              className="relative w-full aspect-video rounded-t-2xl overflow-hidden"
              onHoverStart={() => setIsVideoHovered(true)}
              onHoverEnd={() => setIsVideoHovered(false)}
            >
              <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: isVideoHovered ? 1.1 : 1 }}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <IoIosPlay className="text-amber-500 w-8 h-8 ml-1" />
                </motion.div>
              </div>
              <video
                className="w-full h-full object-cover"
                poster="https://img.youtube.com/vi/SABZN5JfGAQ/maxresdefault.jpg"
              >
                <source
                  src="https://www.youtube.com/watch?v=SABZN5JfGAQ"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </motion.div>

            <div className="p-8 flex-grow bg-gradient-to-b from-amber-50/50 to-white/50">
              <motion.h2 
                className="text-2xl font-semibold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tu Aliado Empresarial
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 mt-4 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                ¡Bienvenido a{' '}
                <span className="inline-flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Fabiel.Net Logo"
                    width={80}
                    height={32}
                    className="inline-block align-middle mr-1 opacity-90"
                  />
                </span>
                ! Estamos aquí para ayudarte a establecer y crecer tu negocio en los Estados Unidos.
              </motion.p>

              {/* Newsletter Subscription Form */}
              <Newsletter
              variant='light'
              title='Noticias, Consejos y mas '
              /> 
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}