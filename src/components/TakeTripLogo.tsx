import React from 'react';

interface TakeTripLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TakeTripLogo({ className = '', size = 'md' }: TakeTripLogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="text-brand-red">US-</span>
      <span className="text-primary">Bangla</span>
    </div>
  );
}
