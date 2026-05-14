import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { navLinks } from '@/data/site';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#07122F] py-14 text-white">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="inline-flex">
              <Logo className="h-16" variant="white" />
            </Link>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#DDF9FF]/68">
              深圳前海瑞孚图腾科技有限公司，建设 OPC 企业平台、星伴 Assistant、QuantAgent 自动量化系统和 AI 软件交付能力。
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold text-white">导航</h3>
            <ul className="grid gap-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-[#BFD7EA] transition hover:text-[#22D5F5]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold text-white">联系</h3>
            <ul className="grid gap-4">
              <li className="flex items-center gap-3 text-sm text-[#DDF9FF]/68">
                <MapPin className="h-4 w-4 text-[#22D5F5]" />
                深圳市前海深港合作区
              </li>
              <li className="flex items-center gap-3 text-sm text-[#DDF9FF]/68">
                <Mail className="h-4 w-4 text-[#22D5F5]" />
                contact@reeftotem.ai
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#DDF9FF]/52 md:flex-row">
          <p>© 2026 深圳前海瑞孚图腾科技有限公司 All rights reserved.</p>
          <p>ReefTotem · AI Software Systems</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
