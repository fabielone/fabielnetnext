import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Navbar from 'src/app/components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from 'src/app/components/footer';
import ChatwootScript from 'src/app/components/utils/chatwoot';
import '../global.css';

export const metadata = {
  metadataBase: new URL('https://fabiel.net'),
  title: {
    default: 'Fabiel.Net : Establece tu Negocio en EE.UU. - Formación de Empresas y Marketing Digital',
    template: '%s | Fabiel.Net Establece tu Negocio en EE.UU. - Formación de Empresas y Marketing Digital',
  },
  // ... rest of your metadata
};

// Define your supported locales
const locales = ['en', 'es']; // Add all your supported locales here

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate the locale
  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={cx(
        'text-black bg-white',
        'antialiased'
      )}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="flex-auto min-w-0 pt-16 flex flex-col md:px-0">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
          <ChatwootScript />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// This is needed for next-intl to work properly
export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};