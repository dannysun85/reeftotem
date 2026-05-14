import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Downloads from '@/pages/Downloads';
import Assistant from '@/pages/Assistant';
import Billing from '@/pages/Billing';

const routeSeo: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ReefTotem AI 软件系统矩阵 | 星伴 Assistant 下载、OPC 企业平台、QuantAgent',
    description:
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司的 AI 软件系统矩阵，提供星伴 Assistant macOS 下载、OPC 企业平台入口、QuantAgent 自动量化系统发布路线和技术文档。',
  },
  '/products': {
    title: 'ReefTotem 产品体系 | OPC 企业平台、星伴 Assistant、QuantAgent',
    description:
      'ReefTotem 产品体系覆盖 OPC 企业平台、星伴 Assistant 桌面 AI 入口、QuantAgent 自动量化系统和公司级 AI 软件交付标准，按真实成熟度展示截图、入口和发布状态。',
  },
  '/assistant': {
    title: '星伴 Assistant 1.0 | ReefTotem 桌面 AI 入口',
    description:
      '星伴 Assistant 是 ReefTotem 的桌面 AI 入口，提供聊天、长期记忆、提醒、活动记录和本地优先工作流，当前官网开放 macOS Apple Silicon DMG 下载。',
  },
  '/about': {
    title: '关于 ReefTotem | 深圳前海瑞孚图腾科技有限公司',
    description:
      '了解深圳前海瑞孚图腾科技有限公司和 ReefTotem 的公司定位、AI 软件产品方向、企业自动化交付原则、数据安全边界、建设节点、试点方法和对外合作方式，判断它如何帮助团队运营 AI 公司。',
  },
  '/downloads': {
    title: 'ReefTotem 下载中心 | 星伴 Assistant 1.0 macOS 下载',
    description:
      'ReefTotem 下载中心提供星伴 Assistant 1.0 macOS Apple Silicon DMG 下载、OPC 企业平台入口、QuantAgent 后续发布说明、安装更新说明和技术文档。',
  },
  '/billing': {
    title: 'ReefTotem 账户钱包 | 充值、订阅、消费账单与软件权益',
    description:
      'ReefTotem 账户钱包提供星伴 Assistant、OPC 企业平台、QuantAgent 的统一充值、订阅购买、消费账单、钱包余额和软件权益查询入口。',
  },
  '/contact': {
    title: '联系 ReefTotem | AI 软件系统与产品咨询',
    description:
      '联系 ReefTotem 获取星伴 Assistant 下载支持、OPC 企业平台演示、QuantAgent 内测、私有化部署、企业自动化流程设计和长期维护支持咨询。',
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
    setPropertyMeta('og:image', 'https://reeftotem.ai/images/product/xingban-desktop.png');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', 'https://reeftotem.ai/images/product/xingban-desktop.png');
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
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/billing" element={<Billing />} />
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
