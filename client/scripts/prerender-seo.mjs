import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const baseHtmlPath = join(distDir, 'index.html');
const baseHtml = readFileSync(baseHtmlPath, 'utf8');
const siteUrl = 'https://reeftotem.ai';
const defaultImage = `${siteUrl}/images/brand/reeftotem-corporate-gpt.png`;

const pages = [
  {
    path: '/',
    file: 'index.html',
    title: 'ReefTotem AI 公司操作系统与企业自动化软件 | 深圳前海瑞孚图腾科技有限公司',
    description:
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司旗下 AI 软件品牌，建设 AI 公司操作系统、企业自动化智能助手、量化研究工具和内容安全能力。',
    h1: 'ReefTotem AI 公司操作系统与企业自动化软件',
    intro:
      'ReefTotem 面向真实业务场景建设可部署、可验证、可持续迭代的 AI 软件产品，帮助企业把 AI 员工、工具、审批、日志和交付结果放进可运营流程。',
    sections: [
      ['产品方向', 'AI 公司操作系统、企业自动化智能助手、量化研究工具、内容安全能力。'],
      ['适用场景', '企业创建 AI 公司、配置数字员工、管理项目交付、沉淀 WorkProduct、记录审计日志并完成报告验收。'],
      ['服务边界', 'ReefTotem 提供软件产品、私有化部署、版本升级、文档和长期维护支持，不承诺投资收益或搜索排名。'],
    ],
    jsonLdTypes: ['organization', 'website'],
  },
  {
    path: '/products',
    file: 'products/index.html',
    flatFile: 'products.html',
    title: 'ReefTotem 产品矩阵 | AI 公司操作系统、小助手、量化研究与内容安全',
    description:
      'ReefTotem 产品矩阵覆盖 AI 公司操作系统、企业自动化智能助手、量化研究工具、内容安全能力、数字员工和公司能力包。',
    h1: 'ReefTotem 产品矩阵',
    intro:
      'ReefTotem 的产品组合按成熟度展示，核心包括已部署控制台、规划中的助手产品线、量化研究工具、内容安全能力和可复用公司能力包。',
    sections: [
      ['AI 公司操作系统', '为团队创建 AI 公司、配置数字员工、管理项目交付和审核结果的企业操作系统。'],
      ['ReefTotem 小助手', '面向办公辅助、知识问答、任务提醒、资料整理和轻量流程协作的助手产品线。'],
      ['量化研究工具', '面向行情分析、策略研究、回测记录、风险监控和交易流程辅助，坚持工具和风控边界。'],
      ['内容安全能力', '围绕音视频识别、内容风险、事件追踪和企业安全流程接入形成解决方案。'],
    ],
    jsonLdTypes: ['organization', 'software'],
  },
  {
    path: '/about',
    file: 'about/index.html',
    flatFile: 'about.html',
    title: '关于 ReefTotem | 深圳前海瑞孚图腾科技有限公司',
    description:
      '了解深圳前海瑞孚图腾科技有限公司和 ReefTotem 的公司定位、产品方向、AI 软件交付原则、数据安全边界和建设节点。',
    h1: '关于深圳前海瑞孚图腾科技有限公司',
    intro:
      'ReefTotem 专注于 AI 软件产品和企业自动化能力建设，官网承担公司介绍、产品矩阵、试用入口、部署咨询和用户文档入口。',
    sections: [
      ['公司定位', 'ReefTotem 帮助企业运营 AI 公司，而不是把所有工作塞进单个聊天窗口。'],
      ['交付原则', 'Issue、Run、事件、工具调用和 WorkProduct 要能反向解释交付结果。'],
      ['安全边界', '真实公司记忆和客户上下文不进入外售包，只允许脱敏模板复用。'],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/downloads',
    file: 'downloads/index.html',
    flatFile: 'downloads.html',
    title: 'ReefTotem 文档与入口 | OPC 控制台、部署说明与安全边界',
    description:
      'ReefTotem 文档与入口页面提供 OPC 控制台、产品使用手册、部署升级 runbook、安全与数据边界说明和后续下载入口。',
    h1: 'ReefTotem 文档与入口',
    intro:
      '这里提供产品控制台、使用说明、部署 runbook 和安全边界说明。小助手、量化研究工具或行业 SDK 的下载入口会在真实发布后进入该页面。',
    sections: [
      ['OPC 控制台', '用于 SaaS 账号、公司创建、员工组织、项目立项、Run、WorkProduct 和审核。'],
      ['产品使用手册', '从注册账号、创建客户工作区、选择公司包，到提交项目目标、查看工作间、审核交付物。'],
      ['部署与升级', '记录服务器初始化、源码同步、域名绑定、环境变量、备份、验证和回滚方式。'],
      ['安全边界', '公司实例、员工记忆、客户资料、代码上下文和可售模板之间必须隔离。'],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    flatFile: 'contact.html',
    title: '联系 ReefTotem | AI 公司操作系统与私有化部署咨询',
    description:
      '联系 ReefTotem 获取 AI 公司操作系统、小助手、量化研究工具、内容安全能力、私有化部署和企业自动化流程咨询。',
    h1: '联系 ReefTotem',
    intro:
      '如果你想了解 AI 公司操作系统、小助手、量化研究工具、私有化部署或音视频安全检测等应用场景，可以说明产品方向、目标流程和数据边界。',
    sections: [
      ['联系邮箱', 'contact@reeftotem.ai'],
      ['公司地址', '深圳市前海深港合作区。'],
      ['适合沟通的内容', '产品控制台试用、小助手合作、量化研究工具、AI 公司创建、公司包、私有化部署、行业安全检测流程。'],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
];

for (const page of pages) {
  const html = renderPage(page);
  const targetPath = join(distDir, page.file);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, html);
  if (page.flatFile) {
    writeFileSync(join(distDir, page.flatFile), html);
  }
}

console.log(`SEO pre-rendered ${pages.length} routes`);

function renderPage(page) {
  const canonical = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '');

  html = html.replace(
    '</head>',
    `${renderHead(page, canonical)}
  </head>`,
  );
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${renderFallback(page, canonical)}</div>`);
  return html;
}

function renderHead(page, canonical) {
  const jsonLd = buildJsonLd(page, canonical);
  return `
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${defaultImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${defaultImage}" />
    ${jsonLd.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n    ')}`;
}

function renderFallback(page, canonical) {
  const nav = pages
    .map((item) => {
      const href = item.path === '/' ? '/' : item.path;
      return `<a href="${href}">${escapeHtml(item.h1)}</a>`;
    })
    .join('');
  const sections = page.sections
    .map(([title, text]) => `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`)
    .join('');

  return `
      <main class="seo-fallback mx-auto max-w-5xl px-6 py-10">
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        ${sections}
        <nav aria-label="ReefTotem core pages">${nav}</nav>
        <p>Canonical: <a href="${canonical}">${canonical}</a></p>
      </main>
    `;
}

function buildJsonLd(page, canonical) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ReefTotem',
    legalName: '深圳前海瑞孚图腾科技有限公司',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@reeftotem.ai',
      contactType: 'customer support',
      availableLanguage: ['zh-CN', 'en'],
    },
    sameAs: [`${siteUrl}/products`, `${siteUrl}/about`],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ReefTotem',
    url: siteUrl,
    inLanguage: 'zh-CN',
    description: page.description,
  };
  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ReefTotem AI 公司操作系统',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${siteUrl}/products`,
    description: '面向 AI 公司创建、数字员工组织、项目交付、审核验收和企业自动化的软件系统。',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/OnlineOnly',
      priceCurrency: 'USD',
      price: '0',
      description: '按项目咨询、试点和私有化部署沟通。',
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ReefTotem',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.h1,
        item: canonical,
      },
    ],
  };

  return page.jsonLdTypes.map((type) => ({ organization, website, software, breadcrumb })[type]);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
