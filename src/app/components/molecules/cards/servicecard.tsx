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

  // Service-specific styling with better dark mode contrast
  const getServiceTheme = (key: string) => {
    const themes = {
      businessFormation: {
        gradient: 'from-blue-50 via-blue-100/50 to-slate-50',
        pillBg: 'bg-blue-600 text-white',
        buttonBg: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
        darkGradient: 'dark:from-slate-800 dark:via-blue-900/20 dark:to-slate-800',
        darkPill: 'dark:bg-blue-600 dark:text-white',
        accent: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/40',
        checkColor: 'text-blue-600 dark:text-blue-400'
      },
      webDevelopment: {
        gradient: 'from-purple-50 via-purple-100/50 to-slate-50',
        pillBg: 'bg-purple-600 text-white',
        buttonBg: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
        darkGradient: 'dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800',
        darkPill: 'dark:bg-purple-600 dark:text-white',
        accent: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-900/40',
        checkColor: 'text-purple-600 dark:text-purple-400'
      }
    };
    return themes[key as keyof typeof themes] || themes.businessFormation;
  };

  const theme = getServiceTheme(serviceKey);

  return (
    <div 
      className={'relative font-sans px-4 py-12 lg:py-16 md:px-8 xl:px-2 sm:max-w-xl md:max-w-full transition-all duration-700'}
    >
      {/* Soft background with gradient blend */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} ${theme.darkGradient} opacity-50`}></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section - Centered */}
        <div className="text-center mb-12">
          <span className={`inline-flex items-center px-5 py-2 text-sm font-bold ${theme.pillBg} ${theme.darkPill} rounded-full shadow-lg mb-6`}>
            <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></span>
            {pill}
          </span>
          
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
            {title}
          </h2>
          
          <h3 className={`text-xl lg:text-2xl font-semibold ${theme.accent} mb-4`}>
            {subtitle}
          </h3>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Main Content - Symmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className={`lg:col-span-5 flex justify-center order-1 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative group w-full max-w-md">
              {/* Glow effect */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500`}></div>
              
              {/* Image container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  alt={title}
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className={`lg:col-span-7 space-y-8 flex flex-col justify-center order-2 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${theme.iconBg} flex items-center justify-center`}>
                    <FiCheck className={`w-4 h-4 ${theme.checkColor}`} />
                  </div>
                  <span className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={buttonLink}
                className={`group inline-flex items-center px-8 py-4 text-lg font-bold text-white rounded-xl ${theme.buttonBg} shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <span>{buttonText}</span>
                <HiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href={learnMoreLink}
                className={`group inline-flex items-center text-lg font-semibold ${theme.accent} hover:underline transition-all duration-200 px-4 py-2`}
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