import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks } from '@/data/site';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    const pathname = path.split('#')[0];
    return location.pathname === pathname;
  };

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07122F]/95 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300',
        isScrolled ? 'py-3' : 'py-4'
      )}
    >
      <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-4 px-6 md:px-10">
        <Link to="/" aria-label="ReefTotem 首页" className="min-w-0 shrink">
          <Logo className="h-[44px] max-w-[210px] sm:h-[58px] sm:max-w-none" variant="white" />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'relative text-[17px] font-medium text-white/80 transition-colors hover:text-[#22D5F5]',
                isActive(link.path) && 'text-[#22D5F5]'
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-[#22D5F5]" />
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden h-12 items-center justify-center rounded-full bg-white px-8 text-[15px] font-semibold text-[#07122F] transition hover:bg-[#DDF9FF] lg:inline-flex"
        >
          联系我们
        </Link>

        <button
          type="button"
          aria-label="打开导航"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#07122F]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-[1720px] flex-col gap-1 px-6 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'rounded-lg px-3 py-3 text-lg font-medium text-[#E8F7FF]',
                    isActive(link.path) && 'bg-white/8 text-[#22D5F5]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-3 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#07122F]"
              >
                联系我们
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
