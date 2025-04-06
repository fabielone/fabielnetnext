import { motion, useAnimation, Variants } from 'framer-motion';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { HiArrowRight } from 'react-icons/hi';

interface HeaderProps {
  pill: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  learnMoreLink: string;
  imageUrl: string;
  items: { icon: string; text: string }[];
  imagePosition?: 'left' | 'right';
}

const Header: React.FC<HeaderProps> = ({
  pill,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  learnMoreLink,
  imageUrl,
  items,
  imagePosition = 'right',
}) => {
  const [contentRef, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const imageVariants: Variants = {
    hidden: { 
      x: imagePosition === 'left' ? '-100%' : '100%',
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 20,
      }
    }
  };

  const contentVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div ref={contentRef} className="relative font-serif px-4 py-8 lg:py-16 md:px-8 xl:px-2 sm:max-w-xl md:max-w-full bg-gradient-to-b from-amber-50/50 to-white">
      <div className={`max-w-7xl mx-auto lg:flex items-center gap-12 ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
        {/* Image Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          className="flex justify-center lg:w-1/2"
        >
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-100 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <motion.img
                src={imageUrl}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.7 }}
                alt=""
              />
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={contentVariants}
          className="lg:w-1/2 space-y-8"
        >
          {/* Pill and Titles */}
          <motion.div className="space-y-6">
            <motion.span 
              variants={itemVariants}
              className="inline-block px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full shadow-sm"
            >
              {pill}
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </motion.h2>
            
            <motion.h3 variants={itemVariants} className="text-2xl lg:text-3xl font-medium text-gray-700">
              {subtitle}
            </motion.h3>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed">
              {description}
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex items-center gap-6">
            <motion.a
              href={buttonLink}
              className="inline-flex items-center px-8 py-3 text-lg font-semibold bg-green-50 text-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-2 border-green-700"
              whileHover={{ y: -2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            >
              {buttonText}
              <HiArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            
            <motion.a
              href={learnMoreLink}
              className="text-lg font-medium text-amber-700 hover:text-amber-800 transition-colors duration-200 flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              Conoce más
              <span className="text-xl">→</span>
            </motion.a>
          </motion.div>

          {/* Features List */}
          <motion.ul className="space-y-4 mt-8">
            {items.map((item, index) => (
              <motion.li 
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 text-gray-700 bg-amber-50 px-4 py-3 rounded-lg shadow-sm"
                whileHover={{ y: -2 }}
              >
                <span className="text-amber-500 text-xl">{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;