// app/layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './global.css';
import { ThemeProvider } from './components/theme-provider';
export const metadata = {
  metadataBase: new URL('https://fabiel.net'),
  title: {
    default: 'Fabiel.Net : Establece tu Negocio en EE.UU.',
    template: '%s | Fabiel.Net'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}