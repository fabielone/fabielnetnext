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
    '/checkout/web': {
      es:'/checkout/desarrollo-web'
    },
    '/webdevelopment': {
      es:'/desarrollo-web'
    },
    '/business': {
      es:'/negocios'
    },
    '/blog/10-consejos':{
      es:'/blog/10-consejos',
      en:'/blog/10-tips'
    },
 

  }
});