'use client'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { NavigationProgressBar } from '../atoms/NavigationProgressBar'

// Loading style options
type LoadingStyle = 'subtle-overlay' | 'progress-bar' | 'none'

interface NavigationContextType {
  isNavigating: boolean
  navigateWithLoading: (href: string, message?: string) => void
  setIsNavigating: (value: boolean) => void
  currentLoadingMessage: string
  loadingStyle: LoadingStyle
  setLoadingStyle: (style: LoadingStyle) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export const useNavigationContext = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState('Loading...')
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>('subtle-overlay')
  const router = useRouter()
  const pathname = usePathname()

  const navigateWithLoading = (href: string, customMessage?: string) => {
    // Normalize paths for comparison (remove trailing slashes)
    const normalizePathname = (path: string) => {
      return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    };
    
    const normalizedPathname = normalizePathname(pathname);
    const normalizedHref = normalizePathname(href);
    
    // Check if already on the same page (exact match)
    if (normalizedPathname === normalizedHref) return;
    
    // Check if the destination is the same page but without locale prefix
    // e.g., current: /en/contact, href: /contact -> same page
    const localeMatch = normalizedPathname.match(/^\/([a-z]{2})(\/.*)?$/);
    if (localeMatch) {
      const locale = localeMatch[1];
      const pathWithoutLocale = localeMatch[2] || '/';
      
      // If href doesn't have locale, add current locale for comparison
      const hrefWithLocale = normalizedHref.startsWith(`/${locale}`) 
        ? normalizedHref 
        : `/${locale}${normalizedHref}`;
      
      if (normalizedPathname === hrefWithLocale) return;
      
      // Also check if we're comparing path without locale to path with locale
      if (pathWithoutLocale === normalizedHref) return;
    }
    
    // Set appropriate loading message based on destination
    const message = customMessage || getLoadingMessage(href)
    setCurrentLoadingMessage(message)
    setIsNavigating(true)
    
    // Use router.push for navigation
    router.push(href)
  }

  const getLoadingMessage = (href: string): string => {
    if (href.includes('/contact')) return 'Loading contact form...'
    if (href.includes('/ourprocess')) return 'Loading our process...'
    if (href.includes('/allies')) return 'Loading our clients...'
    if (href.includes('/join')) return 'Loading registration...'
    if (href.includes('/login')) return 'Loading login...'
    if (href.includes('/checkout')) return 'Loading secure checkout...'
    if (href.includes('/services')) return 'Loading services...'
    if (href.includes('/dashboard')) return 'Loading dashboard...'
    return 'Loading page...'
  }

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  // Auto-clear loading state after max time to prevent stuck states
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false)
      }, 8000) // 8 second max loading time

      return () => clearTimeout(timeout)
    }
  }, [isNavigating])

  // Listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isNavigating) {
        setTimeout(() => {
          setIsNavigating(false)
        }, 300)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isNavigating])

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      navigateWithLoading,
      setIsNavigating,
      currentLoadingMessage,
      loadingStyle,
      setLoadingStyle
    }}>
      {children}
      
      {/* Navigation Loading Indicators */}
      {isNavigating && (
        <>
          {/* Progress Bar Style */}
          {loadingStyle === 'progress-bar' && (
            <NavigationProgressBar isVisible={true} />
          )}
          
          {/* Subtle Overlay Style - Content section spinner (keeps navbar/footer visible) */}
          {loadingStyle === 'subtle-overlay' && (
            <div className="fixed top-16 left-0 right-0 bottom-0 z-[100] bg-gray-50 dark:bg-slate-900 flex items-center justify-center animate-in fade-in duration-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{currentLoadingMessage}</p>
              </div>
            </div>
          )}
        </>
      )}
    </NavigationContext.Provider>
  )
}
