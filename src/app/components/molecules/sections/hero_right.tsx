'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaPlay, FaStar, FaLinkedin } from "react-icons/fa";
import { IoIosPlay } from "react-icons/io";
import { HiShieldCheck, HiClock, HiUsers } from "react-icons/hi";
import Image from 'next/image';
import Newsletter from '../newsletter/subscribe';
import { useTranslations } from 'next-intl';

export default function HeroRight() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const t = useTranslations('HeroRight');

  const trustItems = [
    {
      icon: <HiUsers className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: t('Trust1'),
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30"
    },
    {
      icon: <HiShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: t('Trust2'),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      icon: <HiClock className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: t('Trust3'),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="pt-2 sm:pt-4 flex w-full"
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col items-center h-full">
          <motion.div 
            className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-900 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden flex flex-col h-full w-full max-w-sm sm:max-w-xl border border-white/20 dark:border-gray-700/50"
            whileHover={{ 
              boxShadow: "0 20px 40px -12px rgba(245, 158, 11, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              scale: 1.01 
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Video Section */}
            <motion.div 
              className="relative w-full aspect-video rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700"
              onHoverStart={() => setIsVideoHovered(true)}
              onHoverEnd={() => setIsVideoHovered(false)}
              onClick={() => setShowVideo(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: isVideoHovered ? 1.15 : 1,
                    boxShadow: isVideoHovered ? "0 0 25px rgba(34, 197, 94, 0.6)" : "0 0 0px rgba(34, 197, 94, 0)"
                  }}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/95 dark:bg-gray-100/95 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPlay className="text-amber-600 dark:text-amber-700 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-0.5 sm:ml-1" />
                </motion.div>
              </div>
              
              {/* Video Label */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20">
                <motion.div 
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t('VideoLabel')}</span>
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

            {/* Content Section */}
            <div className="p-4 sm:p-6 md:p-8 flex-grow bg-gradient-to-b from-white/90 via-blue-50/20 to-white/80 dark:from-gray-800/90 dark:via-gray-800/95 dark:to-gray-900/90">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4 sm:mb-6"
              >
                
                <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                  <Image
                    src="/logo.png"
                    alt="Fabiel.Net Logo"
                    width={48}
                    height={30}
                    className="opacity-90 dark:hidden sm:w-18 sm:h-6"
                  />
                  <Image
                    src="/darklogo.png"
                    alt="Fabiel.Net Logo"
                    width={48}
                    height={30}
                    className="opacity-90 hidden dark:block sm:w-18 sm:h-6"
                  />
                 
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-2">
                  {t('Title')}
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-center mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t('Description')}
              </motion.p>

              {/* Trust Indicators */}
              <motion.div 
                className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {trustItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 sm:space-x-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/60 dark:border-gray-600/60 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02, x: 3 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`${item.color} ${item.bgColor} p-1.5 sm:p-2 rounded-lg shadow-sm`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Newsletter Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-white"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-center">{t('NewsletterTitle')}</h3>
                <p className="text-blue-100 dark:text-blue-200 text-center mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm">{t('NewsletterSubtitle')}</p>
                
                <Newsletter
                  
                  title={t('NewsletterCTA')}
                  
                /> 
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}