// app/not-found.tsx
'use client';

import { FaTools, FaClock, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto px-4 py-8 text-center"
      >
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          {/* Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6"
          >
            <FaTools className="text-6xl text-amber-500 dark:text-amber-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text">
            Coming Soon!
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            We're working on something amazing!
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-amber-50 dark:bg-gray-700 rounded-lg">
              <FaClock className="text-2xl text-amber-500 dark:text-amber-400" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Launch Date</h3>
                <p className="text-gray-600 dark:text-gray-400">Coming Q2 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-amber-50 dark:bg-gray-700 rounded-lg">
              <FaRocket className="text-2xl text-amber-500 dark:text-amber-400" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Status</h3>
                <p className="text-gray-600 dark:text-gray-400">Under Development</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <div className="bg-amber-500 dark:bg-amber-400 h-2.5 rounded-full w-3/4"></div>
          </div>

          {/* Additional Info */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We're crafting something special for you. Stay tuned for updates!
          </p>

          {/* Back Button */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-amber-500 dark:bg-amber-400 text-white rounded-lg font-semibold transition-colors hover:bg-amber-600 dark:hover:bg-amber-500"
          >
            Return to Homepage
          </motion.a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Have questions? Contact us at{' '}
          <a href="mailto:info@example.com" className="text-amber-500 dark:text-amber-400 hover:underline">
            support@fabiel.net
          </a>
        </p>
      </motion.div>
    </div>
  );
}