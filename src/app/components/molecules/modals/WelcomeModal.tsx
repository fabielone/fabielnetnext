'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import {
  RiCloseLine,
  RiRocketLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiSparklingLine,
} from 'react-icons/ri'

interface WelcomeModalProps {
  userName?: string
  onClose: () => void
}

export default function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
  const locale = useLocale()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = async () => {
    setIsVisible(false)
    // Mark welcome as shown
    try {
      await fetch('/api/auth/welcome-shown', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignore errors
    }
    setTimeout(onClose, 200)
  }

  const features = [
    'Track your order progress in real-time',
    'Manage all your businesses in one place',
    'Access important documents anytime',
    'Get compliance reminders',
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-8 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <RiCloseLine className="w-5 h-5" />
                </button>

                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 1,
                    }}
                  >
                    <RiRocketLine className="w-16 h-16" />
                  </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">
                  Welcome{userName ? `, ${userName}` : ''}! 🎉
                </h2>
                <p className="text-white/90 text-center text-sm">
                  Thank you for your purchase! Your business journey starts here.
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <RiSparklingLine className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">
                    Here&apos;s what you can do in your dashboard:
                  </h3>
                </div>

                <ul className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <RiCheckboxCircleLine className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={handleClose}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Go to Dashboard
                    <RiArrowRightLine className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleClose}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    I&apos;ll explore later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
