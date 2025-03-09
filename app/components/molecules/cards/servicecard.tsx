import { useSpring, animated, config } from '@react-spring/web';
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

  const imageSlideProps = useSpring({
    from: { 
      transform: imagePosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)',
      opacity: 0 
    },
    to: { 
      transform: 'translateX(0)',
      opacity: 1 
    },
    config: config.molasses,
  });

  const contentSlideProps = useSpring({
    from: { 
      opacity: 0, 
      transform: 'translateY(30px)',
      scale: 0.95
    },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      scale: inView ? 1 : 0.95
    },
    config: config.gentle,
  });

  return (
    <div ref={contentRef} className="relative px-4 py-8 lg:py-16 md:px-8 xl:px-2 sm:max-w-xl md:max-w-full bg-gradient-to-b from-amber-50/50 to-white">
      <div className={`max-w-7xl mx-auto lg:flex items-center gap-12 ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
        {/* Image Section */}
        <animated.div 
          style={imageSlideProps} 
          className="flex justify-center lg:w-1/2"
        >
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-100 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <img
                src={imageUrl}
                className="w-full h-full object-fit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            transition-transform duration-700 group-hover:scale-[1.01]"
                alt=""
              />
            </div>
          </div>
        </animated.div>

        {/* Content Section */}
        <animated.div
          style={contentSlideProps} 
          className="lg:w-1/2 space-y-8"
        >
          {/* Pill and Titles */}                                                                    
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full shadow-sm">
              {pill}
            </span>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            
            <h3 className="text-2xl lg:text-3xl font-medium text-gray-700">
              {subtitle}
            </h3>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <a
              href={buttonLink}
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-2 border-green-700"
            >
              {buttonText}
              <HiArrowRight className="ml-2 w-5 h-5" />
            </a>
            
            <a
              href={learnMoreLink}
              className="text-lg font-medium text-amber-700 hover:text-amber-800 transition-colors duration-200 flex items-center gap-2"
            >
              Conoce más
              <span className="text-xl">→</span>
            </a>
          </div>

          {/* Features List */}
          <ul className="space-y-4 mt-8">
            {items.map((item, index) => (
              <li 
                key={index} 
                className="flex items-center gap-3 text-gray-700 bg-amber-50 px-4 py-3 rounded-lg shadow-sm"
              >
                <span className="text-amber-500 text-xl">{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </li>
            ))}
          </ul>
        </animated.div>
      </div>
    </div>
  );
};

export default Header;