'use client'
import { useEffect } from 'react'
import { useNavigationContext } from '../providers/NavigationProvider'

export const useLinkOptimizer = () => {
  const { navigateWithLoading } = useNavigationContext()

  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (!link) return
      
      const href = link.getAttribute('href')
      if (!href) return
      
      // Only handle internal links (not external or hash links)
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
        return
      }

      // Don't handle if already has custom click handler
      if (link.hasAttribute('data-optimized-link')) {
        return
      }

      // Prevent default and use our optimized navigation
      e.preventDefault()
      navigateWithLoading(href)
    }

    // Add click listeners to all links on the page
    document.addEventListener('click', handleLinkClick)

    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [navigateWithLoading])
}

// Component to auto-optimize all links on a page
export const LinkOptimizer = () => {
  useLinkOptimizer()
  return null
}
