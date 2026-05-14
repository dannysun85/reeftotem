import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'white' }) => {
  const src =
    variant === 'white'
      ? '/images/brand/reeftotem-logo-white.png'
      : '/images/brand/reeftotem-logo-color.png';

  return (
    <img
      src={src}
      alt="ReefTotem 深圳前海瑞孚图腾科技有限公司"
      className={cn('h-12 w-auto select-none object-contain', className)}
    />
  );
};

export default Logo;
