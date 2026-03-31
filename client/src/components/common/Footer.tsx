import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react';
import Logo from './Logo';
import { useSiteStore } from '@/stores/siteStore';

const Footer = () => {
  const { siteConfig } = useSiteStore();
  const { footer } = siteConfig;

  return (
    <footer className="bg-background border-t border-border pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6 group">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {siteConfig.banner.subtitle}
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-border"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">快速链接</h3>
            <ul className="space-y-4">
              {[
                { name: '首页', path: '/' },
                { name: 'AI助手', path: '/products' },
                { name: 'Agent服务', path: '/products' },
                { name: '关于我们', path: '/about' },
                { name: '下载中心', path: '/downloads' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">服务支持</h3>
            <ul className="space-y-4">
              {[
                { name: '技术文档', path: '#' },
                { name: 'API参考', path: '#' },
                { name: '隐私政策', path: '#' },
                { name: '服务条款', path: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">联系方式</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>{footer.address || '深圳前海'}</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{footer.contactEmail}</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{footer.contactPhone || '+86 0755-12345678'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            {footer.copyright}
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-muted-foreground text-xs">
            <span>Designed with</span>
            <span className="text-red-500">♥</span>
            <span>by ReefTotem Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
