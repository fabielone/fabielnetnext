'use client'
import { ReactNode, MouseEvent } from 'react'
import NextLink from 'next/link'
import { useNavigationContext } from '../providers/NavigationProvider'

interface OptimizedLinkProps {
  href: string
  children: ReactNode
  className?: string
  loadingMessage?: string
  external?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  prefetch?: boolean
  replace?: boolean
}

export const OptimizedLink = ({ 
  href, 
  children, 
  className = '', 
  loadingMessage,
  external = false,
  onClick,
  prefetch = true,
  replace = false
}: OptimizedLinkProps) => {
  const { navigateWithLoading, isNavigating } = useNavigationContext()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't handle external links
    if (external) {
      if (onClick) onClick(e)
      return
    }

    // Prevent navigation if already navigating
    if (isNavigating) {
      e.preventDefault()
      return
    }

    // Prevent default behavior for internal links
    e.preventDefault()
    
    // Stop propagation to prevent conflicts with other handlers
    e.stopPropagation()

    // Call custom onClick if provided (after preventDefault to ensure it doesn't interfere)
    if (onClick) {
      onClick(e)
    }

    // Small delay to ensure state updates complete (helps with Samsung Chrome)
    requestAnimationFrame(() => {
      navigateWithLoading(href, loadingMessage)
    })
  }

  // For external links, use regular link behavior
  if (external) {
    return (
      <a 
        href={href} 
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink 
      href={href} 
      className={`${className} ${isNavigating ? 'pointer-events-none opacity-75' : ''} hover:cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
      onClick={handleClick}
      prefetch={prefetch}
      replace={replace}
    >
      {children}
    </NextLink>
  )
}
