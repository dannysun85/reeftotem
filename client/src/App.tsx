import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Downloads from '@/pages/Downloads';

const routeSeo: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ReefTotem AI 公司操作系统与企业自动化软件 | 深圳前海瑞孚图腾科技有限公司',
    description:
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司旗下 AI 软件品牌，建设 AI 公司操作系统、企业自动化智能助手、量化研究工具和内容安全能力。',
  },
  '/products': {
    title: 'ReefTotem 产品矩阵 | AI 公司操作系统、小助手、量化研究与内容安全',
    description:
      'ReefTotem 产品矩阵覆盖 AI 公司操作系统、企业自动化智能助手、量化研究工具、内容安全能力、数字员工和公司能力包。',
  },
  '/about': {
    title: '关于 ReefTotem | 深圳前海瑞孚图腾科技有限公司',
    description:
      '了解深圳前海瑞孚图腾科技有限公司和 ReefTotem 的公司定位、产品方向、AI 软件交付原则、数据安全边界和建设节点。',
  },
  '/downloads': {
    title: 'ReefTotem 文档与入口 | OPC 控制台、部署说明与安全边界',
    description:
      'ReefTotem 文档与入口页面提供 OPC 控制台、产品使用手册、部署升级 runbook、安全与数据边界说明和后续下载入口。',
  },
  '/contact': {
    title: '联系 ReefTotem | AI 公司操作系统与私有化部署咨询',
    description:
      '联系 ReefTotem 获取 AI 公司操作系统、小助手、量化研究工具、内容安全能力、私有化部署和企业自动化流程咨询。',
  },
};

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = routeSeo[pathname] ?? routeSeo['/'];
    const canonicalUrl = `https://reeftotem.ai${pathname === '/' ? '/' : pathname}`;

    document.title = seo.title;
    setMeta('description', seo.description);
    setLink('canonical', canonicalUrl);
    setPropertyMeta('og:title', seo.title);
    setPropertyMeta('og:description', seo.description);
    setPropertyMeta('og:url', canonicalUrl);
    setPropertyMeta('og:type', 'website');
    setPropertyMeta('og:image', 'https://reeftotem.ai/images/brand/reeftotem-corporate-gpt.png');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', 'https://reeftotem.ai/images/brand/reeftotem-corporate-gpt.png');
  }, [pathname]);

  return null;
};

function setMeta(name: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function setPropertyMeta(property: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/downloads" element={<Downloads />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
