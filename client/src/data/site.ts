import {
  BarChart3,
  Building2,
  Download,
  ExternalLink,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';

export const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';
export const ASSISTANT_DOWNLOAD_URL = '/downloads/Xingban-Assistant-1.0.0-aarch64.dmg';
export const ASSISTANT_VERSION = '1.0.0';

export const navLinks = [
  { name: '首页', path: '/' },
  { name: '产品体系', path: '/products' },
  { name: '下载中心', path: '/downloads' },
  { name: '账户钱包', path: '/billing' },
  { name: '技术文档', path: '/downloads#docs' },
  { name: '联系我们', path: '/contact' },
];

export const deliveryProducts = [
  {
    slug: 'xingban-assistant',
    status: '当前可用',
    name: '星伴 Assistant',
    desc: 'macOS DMG 1.0.0',
    longDesc: '桌面 AI 入口，支持聊天、长期记忆、轻量自动化和本地优先工作流。',
    accent: '#22D5F5',
    image: '/images/brand/xingban-icon.png',
    imageKind: 'icon',
    href: ASSISTANT_DOWNLOAD_URL,
    action: '下载 macOS 版',
    icon: Download,
  },
  {
    slug: 'opc',
    status: '演示联系',
    name: 'OPC 企业平台',
    desc: '企业运营自动化',
    longDesc: '面向企业创建 AI 公司、配置数字员工、跟踪项目和审核交付结果。',
    accent: '#075DFF',
    image: '/images/product/dashboard-company-home.png',
    imageKind: 'screen',
    href: PRODUCT_CONSOLE_URL,
    action: '进入控制台',
    icon: ExternalLink,
  },
  {
    slug: 'quantagent',
    status: '即将开放',
    name: 'QuantAgent',
    desc: '自动量化系统下载',
    longDesc: '策略 Alpha 深研、证据工厂和自动量化流程，完成后从官网下载中心发布。',
    accent: '#B6D83D',
    image: '/images/product/quantagent-command.png',
    imageKind: 'screen',
    href: '/contact',
    action: '预约内测',
    icon: BarChart3,
  },
];

export const productSystem = [
  {
    slug: 'opc',
    icon: Building2,
    status: '已上线展示',
    name: 'OPC 企业平台',
    category: '企业 AI 运营系统',
    desc: '把客户工作区、AI 公司、数字员工、项目交付、日志和审核结果放进同一条业务链路。',
    image: '/images/product/dashboard-company-home.png',
    href: PRODUCT_CONSOLE_URL,
    action: '进入 OPC',
  },
  {
    slug: 'xingban-assistant',
    icon: MessageSquareText,
    status: '1.0.0 可下载',
    name: '星伴 Assistant',
    category: '桌面 AI 入口',
    desc: '面向个人和团队的桌面 AI 伴侣，当前 macOS Apple Silicon 安装包可从官网直接下载。',
    image: '/images/product/xingban-desktop.png',
    href: ASSISTANT_DOWNLOAD_URL,
    action: '下载星伴',
  },
  {
    slug: 'quantagent',
    icon: BarChart3,
    status: '内测推进',
    name: 'QuantAgent',
    category: '自动量化系统',
    desc: '围绕策略研究、证据门禁、风险控制和自动化执行的量化系统，后续在官网下载中心发布。',
    image: '/images/product/quantagent-commercial.png',
    href: '/contact',
    action: '预约沟通',
  },
  {
    slug: 'reeftotem-engineering',
    icon: ShieldCheck,
    status: '能力沉淀',
    name: '安全与交付体系',
    category: '工程标准',
    desc: '把产品发布、权限边界、审计、部署和回滚沉淀为公司级工程标准。',
    image: '/images/brand/reeftotem-symbol-color.png',
    href: '/downloads#docs',
    action: '查看文档',
  },
];

export type DeliveryProduct = (typeof deliveryProducts)[number];
export type ProductSystemItem = (typeof productSystem)[number];
