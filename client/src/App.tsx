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

const routeSeo: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ReefTotem AI 公司操作系统与企业自动化软件 | 深圳前海瑞孚图腾科技有限公司',
    description:
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司旗下 AI 软件品牌，建设 AI 公司操作系统、企业自动化智能助手、量化研究工具、内容安全能力和私有化部署服务，帮助团队把 AI 员工、工具、审批、日志和交付结果放进真实业务流程。',
  },
  '/products': {
    title: 'ReefTotem 产品矩阵 | AI 公司操作系统、Reeftotem Assistant、量化研究与内容安全',
    description:
      'ReefTotem 产品矩阵覆盖 AI 公司操作系统、Reeftotem Assistant 桌面 AI 伴侣、量化研究工具、内容安全能力、数字员工和公司能力包，按成熟度说明线上控制台、发布状态、行业能力和交付边界。',
  },
  '/assistant': {
    title: 'Reeftotem Assistant | Live2D 桌面 AI 伴侣与自然语言自动化',
    description:
      'Reeftotem Assistant 是本地优先的 Live2D 桌面 AI 伴侣，覆盖聊天、人格、情绪、长期记忆、日历提醒、知识库、Activity 行动记录、Workflow、MCP 工具和 Provider 能力。',
  },
  '/about': {
    title: '关于 ReefTotem AI 软件公司 | 深圳前海瑞孚图腾科技有限公司',
    description:
      '了解深圳前海瑞孚图腾科技有限公司和 ReefTotem 的公司定位、AI 软件产品方向、企业自动化交付原则、数据安全边界、建设节点、试点方法和对外合作方式，判断它如何帮助团队运营 AI 公司。',
  },
  '/downloads': {
    title: 'ReefTotem 文档与入口 | OPC 控制台、部署说明与安全边界',
    description:
      'ReefTotem 文档与入口页面提供 OPC 控制台、产品使用手册、部署升级 runbook、安全与数据边界说明、后续下载入口和合作咨询路径，帮助客户从官网进入真实产品流程。',
  },
  '/contact': {
    title: '联系 ReefTotem | AI 公司操作系统与私有化部署咨询',
    description:
      '联系 ReefTotem 获取 AI 公司操作系统、Reeftotem Assistant、量化研究工具、内容安全能力、私有化部署、企业自动化流程设计、业务验证方案和长期维护支持咨询，适合需要真实试点落地的团队。',
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
            <Route path="/assistant" element={<Assistant />} />
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
