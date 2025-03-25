// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
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
        },
     },
     plugins: [
      
      ],


}