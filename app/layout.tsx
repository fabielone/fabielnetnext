import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import  Navbar  from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import ChatwootScript from './components/utils/chatwoot'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Fabiel.Net : Establece tu Negocio en EE.UU. - Formación de Empresas y Marketing Digital',
    template: '%s | Fabiel.Net Establece tu Negocio en EE.UU. - Formación de Empresas y Marketing Digital',
    
  },
  icons: {
    icon: '/favicon.ico', // Path to your favicon in the public folder
  },
  description: 'Fabiel.Net es tu aliado para establecer y crear un negocio exitoso en los Estados Unidos. Ofrecemos formación de empresas, desarrollo web y marketing digital para emprendedores latinos.',
  openGraph: {
    title: 'Establece tu Negocio en EE.UU. con Fabiel.Net - Formación de Empresas y Marketing Digital',
    description: 'Fabiel.Net es tu aliado para establecer y crear un negocio exitoso en los Estados Unidos. Ofrecemos formación de empresas, desarrollo web y marketing digital para emprendedores latinos.',
    url: baseUrl,
    siteName: 'Fabiel.Net',
    locale: 'es_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html
      lang="en"
      className={cx(
        'text-black bg-white ',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
     
      <body className="antialiased ">
      <Navbar />
      <main className="flex-auto min-w-0 pt-16 flex flex-col md:px-0">         
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
          <ChatwootScript />
        </main>
      </body>
      
    </html>

  )
}
