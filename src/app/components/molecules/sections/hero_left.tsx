'use client';

import { motion, Variants } from 'framer-motion';
import { IoIosCalendar, IoIosCheckmarkCircle, IoIosRocket } from "react-icons/io";
import { IoFlash } from 'react-icons/io5';
import { HiArrowRight } from "react-icons/hi";
import Pills, { PillsProps } from '../../atoms/pills/pills';
import { SocialIcons } from '../socials/socialicons';
import { useTranslations } from 'next-intl';
import { Link } from 'src/i18n/navigation';


interface HeroLeftProps {
  heading: string;
  pills: PillsProps[];
}

export default function HeroLeft({ heading, pills }: HeroLeftProps) {
  const t = useTranslations('Hero');
  
  const benefits = [
    {
      text: t('Bullet1'),
      icon: <IoIosCheckmarkCircle className="text-amber-500 w-6 h-6" />,
    },
    {
      text: t('Bullet2'),
      icon: <IoFlash className="text-amber-500 w-6 h-6" />,
    },
    {
      text: t('Bullet3'),
      icon: <IoIosRocket className="text-amber-500 w-6 h-6" />,
    },
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pillContainerVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear"
        }
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative font-serif px-0 md:px-4 pt-1 md:pt-6 mx-auto overflow-hidden"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-16">
          {/* Heading Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center sm:mt-2 mb-2 md:mb-12"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900"
              whileHover={{ scale: 1.02 }}
            >
              <motion.span className="text-gray-600">
                {t('Heading')}
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Infinite Scrolling Pills */}
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

          {/* Benefits Section */}
          <motion.div 
            className="text-gray-800 my-8 p-4 mx-6 sm:p-8 md:p-8 sm:mx-8 md:mx-8 bg-white rounded-3xl shadow-xl md:shadow-2xl border-2 border-gray-100"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.ul className="space-y-2 md:space-y-6">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-center bg-white md:bg-amber-50 p-1 md:p-4 rounded-xl"
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="mr-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    {benefit.icon}
                  </motion.span>
                  <span className="font-xs md:font-medium">{benefit.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div 
            className="text-lg mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
            variants={containerVariants}
          >
            <motion.a
              href="/checkout/schedule"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                color: "#4b5563" // darker gray
              }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 px-8 md:px-2 py-4 md:py-1 flex items-center"
            >
              <IoIosCalendar className="mr-2 h-6 w-6 md:w-8" />
              {t('Schedule')}
            </motion.a>

        

            <motion.button
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(21, 128, 61, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-50 text-green-700 border-2 border-green-700 px-8 md:px-4 py-4 rounded-xl flex items-center shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <Link href="/checkout/businessformation" className="flex items-center" passHref>
                <motion.span 
                  className="relative z-10"
                  whileHover={{ x: 2 }}
                >
                  {t('CTA')}
                </motion.span>
                <motion.span
                  className="ml-2"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5
                  }}
                >
                  <HiArrowRight className="h-6 w-6" />
                </motion.span>
              </Link>
            </motion.button>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="flex justify-center p-4"
            variants={itemVariants}
          >
            <SocialIcons />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}