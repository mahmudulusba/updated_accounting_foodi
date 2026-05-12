import React from 'react';
import logoImage from '@/assets/foodi-logo.png';

interface USBanglaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function USBanglaLogo({ className = '', size = 'md' }: USBanglaLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <img 
      src={logoImage} 
      alt="Foodi" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
