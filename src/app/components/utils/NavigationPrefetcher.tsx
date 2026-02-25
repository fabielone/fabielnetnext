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
    // Prefetch important routes only when the browser is idle, well after initial load
    const prefetchRoutes = () => {
      PREFETCH_ROUTES.forEach(route => {
        router.prefetch(route)
      })
    }

    let id: ReturnType<typeof setTimeout>
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(prefetchRoutes, { timeout: 8000 })
      return () => (window as any).cancelIdleCallback(idleId)
    } else {
      id = setTimeout(prefetchRoutes, 6000)
      return () => clearTimeout(id)
    }
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
