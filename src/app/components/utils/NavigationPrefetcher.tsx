'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// List of important pages to prefetch
const PREFETCH_ROUTES = [
  '/contact',
  '/ourprocess', 
  '/allies',
  '/join',
  '/login',
  '/checkout/businessformation'
]

export const NavigationPrefetcher = () => {
  const router = useRouter()

  useEffect(() => {
    // Prefetch important routes after initial page load
    const prefetchRoutes = () => {
      PREFETCH_ROUTES.forEach(route => {
        router.prefetch(route)
      })
    }

    // Start prefetching after a short delay to not interfere with initial page load
    const timeout = setTimeout(prefetchRoutes, 2000)

    return () => clearTimeout(timeout)
  }, [router])

  useEffect(() => {
    // Prefetch on hover for better UX
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      
      // Check if target is an element and has the closest method
      if (!target || typeof target.closest !== 'function') return
      
      const link = target.closest('a')
      
      if (!link) return
      
      const href = link.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#')) return

      // Prefetch the route
      router.prefetch(href)
    }

    // Add hover listeners to all links
    document.addEventListener('mouseenter', handleMouseEnter, true)

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true)
    }
  }, [router])

  return null
}
