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
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't handle external links or if navigation is in progress
    if (external || isNavigating) {
      return
    }

    // Handle internal navigation with loading
    e.preventDefault()
    navigateWithLoading(href, loadingMessage)
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
