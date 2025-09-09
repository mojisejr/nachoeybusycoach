import React from 'react'
import { cn } from '../utils/cn'

interface LogoProps {
  variant?: 'default' | 'transparent'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const logoSrc = variant === 'transparent' 
    ? '/images/black-tp-logo.png' 
    : '/images/block-a-logo.png'
  
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto', 
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto'
  }
  
  return (
    <img 
      src={logoSrc}
      alt="NachoeyBusyCoach"
      className={cn(sizeClasses[size], className)}
    />
  )
}

export default Logo