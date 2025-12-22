// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Navbar from 'src/app/components/molecules/nav';
import Footer from 'src/app/components/molecules/footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ChatwootScript from 'src/app/components/utils/chatwoot';
import { NavigationProvider } from 'src/app/components/providers/NavigationProvider';
import { NavigationPrefetcher } from 'src/app/components/utils/NavigationPrefetcher';
import { ReactNode } from 'react';

const locales = ['en', 'es'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NavigationProvider>
        <NavigationPrefetcher />
        <Navbar />
        <main className="flex-auto min-w-0 pt-16 flex flex-col md:px-0">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        <ChatwootScript />  
      </NavigationProvider>
    </NextIntlClientProvider>
  );
}

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};