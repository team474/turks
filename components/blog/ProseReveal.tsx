'use client'

import { useEffect, useRef, useState } from 'react'

interface ProseRevealProps {
  html: string
  className?: string
}

export function ProseReveal({ html, className = '' }: ProseRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const children = Array.from(containerRef.current.children) as HTMLElement[]
    
    // Double RAF for more reliable rendering on mobile devices
    // First RAF ensures layout is complete, second ensures paint is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        children.forEach((child, index) => {
          // Use will-change sparingly for mobile performance
          child.style.willChange = 'opacity, transform'
          child.style.opacity = '0'
          child.style.transform = 'translateY(12px)'
          child.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          child.style.transitionDelay = `${index * 0.08}s`
        })
        
        // Small delay before enabling observer for smoother mobile experience
        setTimeout(() => setIsReady(true), 16) // ~1 frame delay
      })
    })
  }, [html])

  useEffect(() => {
    if (!containerRef.current || !isReady) return

    const children = Array.from(containerRef.current.children) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
            
            // Clean up will-change after animation completes
            const cleanup = () => {
              element.style.willChange = 'auto'
              element.removeEventListener('transitionend', cleanup)
            }
            element.addEventListener('transitionend', cleanup, { once: true })
            
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [isReady, html])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

