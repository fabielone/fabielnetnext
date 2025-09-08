'use client';

import { motion, Variants } from 'framer-motion';
import { HiArrowRight, HiDocumentText, HiGlobe, HiIdentification } from 'react-icons/hi';
import { SocialIcons } from '../socials/socialicons';
import { useTranslations } from 'next-intl';
import { FiFileText } from 'react-icons/fi';
import { FaLinkedin , FaStar } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import LoadingSpinner from '../../atoms/LoadingSpinner';

export default function HeroLeft() {
  const t = useTranslations('Hero');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  
  const benefits = [
    {
      text: t('Bullet1'),
      icon: <HiDocumentText className="text-amber-500 w-6 h-6" />,
    },
    {
      text: t('Bullet2'),
      icon: <FiFileText className="text-amber-500 w-6 h-6" />,
    },
    {
      text: t('Bullet3'),
      icon: <HiIdentification className="text-amber-500 w-6 h-6" />,
    },
    {
      text: t('Bullet4'),
      icon: <HiGlobe className="text-amber-500 w-6 h-6" />,
    },
  ];

  // Simplified animation variants for better performance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced stagger for faster loading
        delayChildren: 0.1 // Reduced delay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 }, // Reduced movement
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200, // Increased stiffness for snappier animation
        damping: 20
      }
    }
  };

 

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="relative font-serif px-0 md:px-4 pt-1 md:pt-6 mx-auto overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-16">
          {/* Heading Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center sm:mt-2 mb-2 md:mb-12"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 dark:text-white"
              whileHover={{ scale: 1.01 }} // Reduced hover scale
            >
              <motion.span className="text-gray-600 dark:text-gray-300">
                {t('Heading')}
              </motion.span>
            </motion.h1>
            <motion.p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 mt-4 font-medium">
              {t('Subheading')}
            </motion.p>
            <motion.div className="mt-4 text-lg text-amber-600 dark:text-amber-400 font-semibold">
              {t('PriceTimeline')}
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex justify-center items-center space-x-3 mt-4 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }} // Faster animation
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg border border-amber-100 dark:border-amber-800/30"
              whileHover={{ scale: 1.02 }} // Reduced hover scale
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotate: -90 }} // Reduced rotation
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + i * 0.05, type: 'spring' }} // Faster stagger
                  >
                    <FaStar className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">5.0</span>
              {/* <span className="text-xs text-gray-600 dark:text-gray-400">({t('ReviewCount')})</span> */}
            </motion.div>
          </motion.div>
          {/* Infinite Scrolling Pills - Temporarily Hidden
          <motion.div
            className="flex overflow-hidden whitespace-nowrap mb-8"
          >
            <motion.div
              className="flex space-x-4"
              variants={pillContainerVariants}
              animate="animate"
            >
              {[...pills, ...pills].map((pill, index) => (
                <motion.span
                  key={`pill-${index}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          */}

          {/* Benefits Section */}
          <motion.div 
            className="text-gray-800 dark:text-gray-200 my-12 p-2 md:p-8 mx-6 sm:mx-8 md:mx-8 bg-gradient-to-br from-white via-amber-50/30 to-white dark:from-gray-800 dark:via-amber-900/10 dark:to-gray-800 rounded-3xl shadow-2xl border border-amber-100 dark:border-amber-800/30"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.005, // Reduced scale for better performance
              boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.1)'
            }}
            transition={{ type: 'spring', stiffness: 400 }} // Faster spring
          >
            <motion.h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {t('BenefitsTitle')}
            </motion.h3>
            <motion.ul className="space-y-4 sm:space-y-6">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start bg-white dark:bg-gray-700/50 p-2 rounded-lg sm:rounded-xl"
                  whileHover={{ x: 2, scale: 1.005 }} // Reduced movement and scale
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }} // Faster stagger
                >
                  <motion.div 
                    className="mr-4 sm:mr-6 p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg sm:rounded-xl"
                    whileHover={{ scale: 1.05, rotate: 2 }} // Reduced rotation
                  >
                    {benefit.icon}
                  </motion.div>
                  <div className="relative">
                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white block">
                      {benefit.text}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 block">
                      {t(`BulletDescription${index + 1}`)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div 
            className="text-lg mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
            variants={containerVariants}
          >
            {/* Temporarily commented out - will implement later
            <motion.a
              href="/checkout/schedule"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                color: "#4b5563" // darker gray
              }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 dark:text-gray-300 px-8 md:px-2 py-4 md:py-1 flex items-center"
            >
              <IoIosCalendar className="mr-2 h-6 w-6 md:w-8" />
              {t('Schedule')}
            </motion.a>
            */}

            <motion.button
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, // Reduced scale
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateWithLoading('/checkout/businessformation')}
              disabled={isNavigating}
              className={`bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold px-12 py-6 rounded-2xl flex items-center shadow-xl hover:shadow-2xl relative overflow-hidden text-xl transition-all duration-300 ${
                isNavigating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" color="text-white" message="" />
                  <span className="ml-3">Loading...</span>
                </div>
              ) : (
                <>
                  <motion.span className="relative z-10">
                    {t('CTA')}
                  </motion.span>
                  <motion.span
                    className="ml-3"
                    animate={{
                      x: [0, 3, 0], // Reduced movement
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 2 // Slower animation
                    }}
                  >
                    <HiArrowRight className="h-6 w-6" />
                  </motion.span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="flex justify-center p-4 space-x-4"
            variants={itemVariants}
          >
            <SocialIcons />
            <motion.a
              href="https://www.linkedin.com/your-linkedin-page"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <FaLinkedin className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}