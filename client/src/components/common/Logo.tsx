import React from 'react';
import { cn } from '@/lib/utils';
import { useSiteStore } from '@/stores/siteStore';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  const { siteConfig } = useSiteStore();
  const { logo } = siteConfig;

  if (logo.url) {
    return (
      <div className={cn("flex items-center space-x-3 select-none", className)}>
        <img src={logo.url} alt={logo.alt} className="h-10 w-auto" />
        {showText && (
          <div className="flex flex-col items-start justify-center">
            <span className="font-sans font-bold text-xl tracking-tight text-foreground leading-none">
              {logo.alt || 'ReefTotem'}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-3 select-none", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Simplified Apple-style Logo Mark */}
        <svg 
          viewBox="0 0 100 100" 
          className="relative w-full h-full text-primary"
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Shape - Abstract Reef/Totem, minimal */}
          <path 
            d="M50 15 C 70 15, 85 30, 85 50 C 85 70, 70 85, 50 85 C 30 85, 15 70, 15 50 C 15 30, 30 15, 50 15 Z M 50 25 C 35 25, 25 35, 25 50 C 25 65, 35 75, 50 75 C 65 75, 75 65, 75 50 C 75 35, 65 25, 50 25 Z" 
            fillRule="evenodd"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col items-start justify-center">
          <span className="font-sans font-bold text-xl tracking-tight text-foreground leading-none">
            ReefTotem
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
