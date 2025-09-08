'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useNavigationLoading = () => {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const navigateWithLoading = (href: string) => {
    setIsNavigating(true)
    router.push(href)
  }

  useEffect(() => {
    // Listen for page visibility changes (when page actually loads)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          setIsNavigating(false)
        }, 300)
      }
    }

    // Listen for route change completion - placeholder for future use
    // const handleRouteComplete = () => {
    //   setTimeout(() => {
    //     setIsNavigating(false)
    //   }, 500)
    // }

    // Monitor page load events
    const handleLoad = () => {
      setIsNavigating(false)
    }

    // Monitor navigation start
    const handleBeforeUnload = () => {
      setIsNavigating(true)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('load', handleLoad)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Auto-clear loading state after max time to prevent stuck states
    const maxLoadingTime = setTimeout(() => {
      setIsNavigating(false)
    }, 5000)

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearTimeout(maxLoadingTime)
    }
  }, [])

  // Effect to reset loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsNavigating(false)
    }
  }, [])

  return {
    isNavigating,
    navigateWithLoading,
    setIsNavigating
  }
}
