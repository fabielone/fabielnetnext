'use client';

import { motion, Variants } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { SocialIcons } from '../socials/socialicons';
import { useTranslations } from 'next-intl';
import { FaLinkedin, FaStar, FaBuilding, FaFileContract, FaIdCard, FaUniversity } from 'react-icons/fa';
import { MdBusiness, MdAccountBalance } from 'react-icons/md';
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
  
  const services = [
    {
      title: t('services.llcFormation.title'),
      description: t('services.llcFormation.description'),
      icon: <MdAccountBalance className="w-7 h-7" />,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: t('services.operatingAgreement.title'),
      description: t('services.operatingAgreement.description'),
      icon: <FaFileContract className="w-7 h-7" />,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: t('services.einFormation.title'),
      description: t('services.einFormation.description'),
      icon: <FaIdCard className="w-7 h-7" />,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: t('services.bankResolution.title'),
      description: t('services.bankResolution.description'),
      icon: <FaUniversity className="w-7 h-7" />,
      gradient: 'from-orange-500 to-orange-600'
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
      className="relative font-serif px-0 md:px-4 pt-2 md:pt-4 mx-auto overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          {/* Heading Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-6"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <motion.span className="text-gray-600 dark:text-gray-300">
                {t('Heading')}
              </motion.span>
            </motion.h1>
            <motion.p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mt-3 font-medium">
              {t('subtitle')}
            </motion.p>
            <motion.div className="mt-3 text-base text-emerald-600 dark:text-emerald-400 font-semibold">
              {t('pricing')}
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex justify-center items-center space-x-3 mt-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-2 shadow-lg border border-amber-100 dark:border-amber-800/30"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <FaStar className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">5.0</span>
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

          {/* LLC Formation Services */}
          <motion.div 
            className="text-gray-800 dark:text-gray-200 my-6 p-6 mx-4 sm:mx-6 md:mx-8 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-blue-900/10 dark:to-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800/30"
            variants={itemVariants}
          >
            <motion.h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {t('packageTitle')}
            </motion.h3>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group bg-white dark:bg-gray-700/50 p-5 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600/30"
                  whileHover={{ y: -3, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`mx-auto mb-4 p-4 bg-gradient-to-r ${service.gradient} rounded-2xl w-fit shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                  >
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </motion.div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center text-lg">{service.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {t('valueProposition.price')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('valueProposition.stateFees')}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>{t('valueProposition.benefits.fastProcessing')}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>{t('valueProposition.benefits.clientCount')}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>{t('valueProposition.benefits.expertSupport')}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>{t('valueProposition.benefits.moneyBack')}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-800/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {t('valueProposition.footnote')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div 
            className="text-lg mb-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
            variants={containerVariants}
          >
            <motion.button
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateWithLoading('/checkout/businessformation')}
              disabled={isNavigating}
              className={`bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl flex items-center shadow-lg hover:shadow-xl relative overflow-hidden text-lg transition-all duration-300 ${
                isNavigating ? 'opacity-90' : ''
              }`}
            >
              <motion.span className="relative z-10">
                {t('cta')}
              </motion.span>
              {isNavigating ? (
                <div className="ml-3">
                  <LoadingSpinner size="small" color="text-white" message="" />
                </div>
              ) : (
                <motion.span
                  className="ml-3"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                >
                  <HiArrowRight className="h-5 w-5" />
                </motion.span>
              )}
            </motion.button>
          </motion.div>

          {/* Remove Social Icons from here - moving to right side */}
        </div>
      </div>
    </motion.div>
  );
}