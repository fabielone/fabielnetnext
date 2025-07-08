// components/common/Newsletter.tsx
'use client';

import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';

interface NewsletterProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export default function Newsletter({
  title = 'Recibe consejos y actualizaciones empresariales',
  description = 'Suscríbete a nuestro newsletter para recibir las últimas noticias y actualizaciones.',
  className = '',
  compact = false
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className={`rounded-xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800 ${className}`}>
      {!compact && (
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <FaEnvelope 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm sm:text-base
                bg-white dark:bg-gray-800/50 
                border border-gray-200 dark:border-gray-700 
                focus:border-amber-300 dark:focus:border-amber-500 
                focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-500/20
                placeholder:text-gray-400 focus:outline-none 
                text-gray-900 dark:text-gray-100
                transition-all duration-300"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg transition-colors duration-300 
              font-medium text-sm sm:text-base whitespace-nowrap
              bg-amber-50 dark:bg-amber-500 
              text-gray-700 dark:text-gray-900 
              border border-amber-200 dark:border-amber-500
              hover:bg-amber-100 dark:hover:bg-amber-400"
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
              className="absolute top-0 left-0 w-full h-full flex items-center 
                justify-center bg-white/95 dark:bg-gray-900/95 
                rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center text-green-600 dark:text-green-400">
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