// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Navbar from 'src/app/components/nav';
import Footer from 'src/app/components/footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ChatwootScript from 'src/app/components/utils/chatwoot';

const locales = ['en', 'es'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <Navbar />
      <main className="flex-auto min-w-0 pt-16 flex flex-col md:px-0">
        {children}
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
      <ChatwootScript />
    </NextIntlClientProvider>
  );
}

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};