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
    '/marketing': {
      es:'/marketing'
    },
    '/marketing/digital': {
      es:'/marketing/digital'
    },
    '/marketing/social-media': {
      es:'/marketing/redes-sociales'
    },
    '/marketing/influencer': {
      es:'/marketing/influencers'
    },
    '/business': {
      es:'/negocios'
    },
    '/business/llc-formation': {
      es:'/negocios/formar-llc'
    },
    '/business/registered-agent': {
      es:'/negocios/agente-registrado'
    },
    '/business/compliance': {
      es:'/negocios/cumplimiento'
    },
    '/bpo': {
      es:'/bpo'
    },
    '/bpo/outbound': {
      es:'/bpo/outbound'
    },
    '/bpo/backoffice': {
      es:'/bpo/backoffice'
    },
    '/blog/10-consejos':{
      es:'/blog/10-consejos',
      en:'/blog/10-tips'
    },
 

  }
});