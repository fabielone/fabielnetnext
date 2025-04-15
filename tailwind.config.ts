// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of your config

  theme: {
       extend: {
        animation: {
          'scroll-left': 'scroll 60s linear infinite',
        },
         colors: {
          // Base Colors
            primary: {
            DEFAULT: '#3B82F6', // Primary brand color
            light: '#93C5FD',
            dark: '#1D4ED8',
            },
            secondary: {
            DEFAULT: '#10B981', // Secondary brand color
            light: '#6EE7B7',
            dark: '#047857',
            },
            accent: {
            DEFAULT: '#F59E0B', // For CTAs, highlights
            light: '#FCD34D',
            dark: '#D97706',
            },
  
            // Backgrounds
            bg: {
              light: '#F9FAFB', // Light mode subtle bg
              dark: '#111827',  // Dark mode main bg
              darker: '#0D131F', // Dark mode alternative
              card: {
                  light: '#FFFFFF',
                  dark: '#1F2937',
              }
            },
  
            // Text
            text: {
            DEFAULT: '#111827',    // Primary text
            light: '#6B7280',     // Secondary/subdued text
            lighter: '#9CA3AF',   // Disabled/placeholder
            dark: '#F9FAFB',      // Dark mode primary
            darkLight: '#D1D5DB', // Dark mode secondary
            inverted: '#FFFFFF',  // Text on colored bg
            },
  
          // UI Elements
          border: {
            DEFAULT: '#E5E7EB',
            light: '#F3F4F6',
            dark: '#374151',
            input: '#D1D5DB', // Special for inputs
          },
  
          // States
          success: {
            DEFAULT: '#10B981',
            light: '#D1FAE5',
            dark: '#065F46',
          },
          warning: {
            DEFAULT: '#F59E0B',
            light: '#FEF3C7',
            dark: '#92400E',
          },
          error: {
            DEFAULT: '#EF4444',
            light: '#FEE2E2',
            dark: '#991B1B',
          },
          info: {
            DEFAULT: '#3B82F6',
            light: '#DBEAFE',
            dark: '#1E40AF',
          },
  
          // Special Cases
          highlight: {
            DEFAULT: '#FEF08A', // Text highlight
            subtle: '#FEF9C3',   // Subtle highlight
          },
          overlay: 'rgba(0, 0, 0, 0.5)', // For modals
         },
        boxShadow: {
          DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1)',
          dark: '0 1px 3px rgba(0, 0, 0, 0.5)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          'lg-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        },
       },
 },
    
  plugins: [
      
  ],

}