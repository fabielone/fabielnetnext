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
        es:"/checkout/formacion-de-negocio"
    },

    '/blog':{
        es:'/blog',
        en:'/blog'
    },

    '/blog/businesstips':{
        es:'/blog/10-consejos-para-potenciar-tu-negocio',
        en:'/blog/10-tips-to-boost-your-business'
    },  

  }
});