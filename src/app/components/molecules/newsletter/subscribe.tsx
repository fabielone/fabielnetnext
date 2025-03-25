// components/common/Newsletter.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";

interface NewsletterProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export default function Newsletter({
  title = "Recibe consejos y actualizaciones empresariales",
  description = "Suscríbete a nuestro newsletter para recibir las últimas noticias y actualizaciones.",
  className = "",
  variant = 'light',
  compact = false
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  const variants = {
    light: {
      container: "bg-white/80 backdrop-blur-sm ",
      input: "bg-white border-gray-200 focus:border-amber-300 focus:ring-amber-100",
      button: "bg-amber-50 text-gray-700 border border-amber-200 hover:bg-amber-100",
      text: "text-gray-700"
    },
    dark: {
      container: "bg-gray-900/80 backdrop-blur-sm border border-gray-800",
      input: "bg-gray-800/50 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20",
      button: "bg-amber-500 text-gray-900 hover:bg-amber-400",
      text: "text-gray-200"
    }
  };

  const styles = variants[variant];

  return (
    <div className={`rounded-xl  p-6 sm:p-8 ${styles.container} ${className}`}>
      {!compact && (
        <div className="mb-6">
          <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${styles.text}`}>
            {title}
          </h3>
          <p className={`text-sm sm:text-base ${variant === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {description}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <FaEnvelope 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                variant === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} 
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm sm:text-base
                placeholder:text-gray-400 focus:outline-none focus:ring-2
                transition-all duration-300 ${styles.input}`}
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2.5 rounded-lg transition-colors duration-300 
              font-medium text-sm sm:text-base whitespace-nowrap ${styles.button}`}
          >
            Suscribirse
          </motion.button>
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-0 left-0 w-full h-full flex items-center 
                justify-center ${variant === 'light' ? 'bg-white/95' : 'bg-gray-900/95'} 
                rounded-lg backdrop-blur-sm`}
            >
              <div className={`flex items-center ${
                variant === 'light' ? 'text-green-600' : 'text-green-400'
              }`}>
                <FaCheckCircle className="text-xl sm:text-2xl mr-2" />
                <span className="font-medium text-sm sm:text-base">
                  ¡Gracias por suscribirte!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}