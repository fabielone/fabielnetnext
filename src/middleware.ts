import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Protected routes that require authentication
const protectedPaths = ['/dashboard'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a protected path (accounting for locale prefixes)
  const isProtectedPath = protectedPaths.some(path => {
    // Match /dashboard or /en/dashboard etc.
    const localePattern = /^\/[a-z]{2}/;
    const strippedPath = pathname.replace(localePattern, '') || '/';
    return strippedPath.startsWith(path);
  });

  if (isProtectedPath) {
    // Check for session token
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      // Get the locale from the path or default to 'en'
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';
      
      // Redirect to login
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Note: We don't validate the session here to avoid database calls in middleware
    // The dashboard pages will validate the session and redirect if invalid
  }

  // Run the i18n middleware for all requests
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};