import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin } from 'lucide-react';
import Logo from './Logo';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6 group">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              深圳前海瑞孚图腾科技有限公司，正在建设面向真实公司运营的 AI 员工协作与交付平台。
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-6">快速链接</h3>
            <ul className="space-y-4">
              {[
                { name: '首页', path: '/' },
                { name: 'Hermes Company OS', path: '/products' },
                { name: '公司包与员工', path: '/products' },
                { name: '公司说明', path: '/about' },
                { name: '文档与入口', path: '/downloads' },
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
            <h3 className="text-foreground font-semibold mb-6">产品入口</h3>
            <ul className="space-y-4">
              <li>
                <a href={PRODUCT_CONSOLE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  opc.reeftotem.ai
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li className="text-sm text-muted-foreground">软件公司工作流</li>
              <li className="text-sm text-muted-foreground">部署与升级说明</li>
              <li className="text-sm text-muted-foreground">客户公司试运行</li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-6">联系方式</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>深圳市前海深港合作区</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@reeftotem.ai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2026 深圳前海瑞孚图腾科技有限公司 All rights reserved.
          </p>
          <p className="mt-4 text-xs text-muted-foreground md:mt-0">
            ReefTotem AI Company OS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
