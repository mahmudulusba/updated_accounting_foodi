import React from 'react';
import foodiIcon from '@/assets/foodi-icon.png';

interface FoodiLoaderProps {
  fullScreen?: boolean;
  size?: number;
  label?: string;
}

export function FoodiLoader({ fullScreen = false, size = 72, label = 'Loading...' }: FoodiLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Pulsing ring */}
        <span
          className="absolute inset-0 rounded-2xl bg-[hsl(var(--brand-red))]/30 animate-ping"
          aria-hidden
        />
        {/* Bouncing + spinning Foodi icon */}
        <img
          src={foodiIcon}
          alt="Foodi"
          className="relative w-full h-full object-contain animate-foodi-bounce drop-shadow-lg"
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center w-full py-12">{content}</div>;
}

export default FoodiLoader;