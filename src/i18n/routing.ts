import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],
 
  // Used when no locale matches
  defaultLocale: 'es',

  pathnames:{
    '/':{
      es:'/'
    },
    '/about':{
      es:'/sobre-nosotros'
    },
    '/checkout/businessformation': {
      es:'/checkout/formacion-de-negocio'
    },
    '/software': {
      es:'/software'
    },
    '/software/web-blog': {
      es:'/software/desarrollo-web'
    },
    '/software/ecommerce': {
      es:'/software/tienda-online'
    },
    '/software/custom': {
      es:'/software/personalizado'
    },
    '/blog/10-consejos':{
      es:'/blog/10-consejos',
      en:'/blog/10-tips'
    },
 

  }
});