import React from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { FiCheck, FiArrowUpRight } from 'react-icons/fi';

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
  serviceKey: string;
  reverse?: boolean;
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
  serviceKey,
  reverse = false,
}) => {

  // Service-specific styling
  const getServiceTheme = (key: string) => {
    const themes = {
      businessFormation: {
        gradient: 'from-blue-50 via-blue-100/50 to-indigo-50',
        pillBg: 'bg-blue-100 text-blue-800',
        buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
        darkGradient: 'dark:from-blue-900/20 dark:via-blue-800/20 dark:to-indigo-900/20',
        darkPill: 'dark:bg-blue-900/50 dark:text-blue-200',
        accent: 'text-blue-600',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        checkColor: 'text-blue-500 dark:text-blue-400'
      },
      webDevelopment: {
        gradient: 'from-purple-50 via-purple-100/50 to-pink-50',
        pillBg: 'bg-purple-100 text-purple-800',
        buttonBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200',
        darkGradient: 'dark:from-purple-900/20 dark:via-purple-800/20 dark:to-pink-900/20',
        darkPill: 'dark:bg-purple-900/50 dark:text-purple-200',
        accent: 'text-purple-600',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        checkColor: 'text-purple-500 dark:text-purple-400'
      }
    };
    return themes[key as keyof typeof themes] || themes.businessFormation;
  };

  const theme = getServiceTheme(serviceKey);

  return (
    <div 
      className={'relative font-sans px-4 py-12 lg:py-20 md:px-8 xl:px-2 sm:max-w-xl md:max-w-full transition-all duration-700'}
    >
      {/* Soft background with gradient blend */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} ${theme.darkGradient} opacity-30`}></div>
      <div className={'absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30 dark:from-gray-900/50 dark:via-transparent dark:to-gray-900/30'}></div>
      
      {/* Content with soft edges */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section - Centered */}
        <div className="text-center mb-16">
          <span className={`inline-flex items-center px-6 py-3 text-sm font-bold ${theme.pillBg} ${theme.darkPill} rounded-full shadow-lg backdrop-blur-sm mb-6 border border-white/20 dark:border-gray-700/20`}>
            <span className="w-2 h-2 bg-current rounded-full mr-3 animate-pulse"></span>
            {pill}
          </span>
          
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          
          <h3 className={`text-2xl lg:text-3xl font-semibold ${theme.accent} dark:text-gray-300 mb-6`}>
            {subtitle}
          </h3>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>
        </div>

        {/* Main Content - Symmetrical Layout with Soft Edges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Section with Soft Blend */}
          <div className={`lg:col-span-5 flex justify-center order-1 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative group w-full max-w-md">
              {/* Soft gradient background that blends */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.gradient} rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-1000`}></div>
              <div className={`absolute -inset-2 bg-gradient-to-br ${theme.gradient} rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-1000`}></div>
              
              {/* Image container with soft border */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-white/30 dark:border-gray-700/30 backdrop-blur-sm">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-800"
                  alt={title}
                />
                {/* Soft overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10 mix-blend-overlay`}></div>
              </div>
            </div>
          </div>

          {/* Features Section with Soft Cards */}
          <div className={`lg:col-span-7 space-y-8 flex flex-col justify-center order-2 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Features Grid with Soft Edges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className={'flex items-start gap-3 transition-all duration-200'}
                >
                  {/* Checkmark icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <FiCheck className={`w-5 h-5 ${theme.checkColor}`} />
                  </div>
                  
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons with Soft Styling */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href={buttonLink}
                className={'group relative inline-flex items-center px-8 py-4 text-lg font-bold text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 transform-gpu overflow-hidden'}
              >
                {/* Soft gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.buttonBg.replace('hover:', '')} opacity-90`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                
                {/* Border gradient */}
                <div className="absolute inset-0 rounded-2xl border border-white/20"></div>
                
                <span className="relative z-10">{buttonText}</span>
                <HiArrowRight className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href={learnMoreLink}
                className={`group inline-flex items-center text-lg font-semibold ${theme.accent} dark:text-gray-300 hover:underline transition-all duration-200 px-4 py-2 rounded-xl backdrop-blur-sm border border-transparent hover:border-current/20`}
              >
                Learn More
                <FiArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;