import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const baseHtmlPath = join(distDir, 'index.html');
const baseHtml = readFileSync(baseHtmlPath, 'utf8');
const siteUrl = 'https://reeftotem.ai';
const defaultImage = `${siteUrl}/images/product/xingban-desktop.png`;

const pages = [
  {
    path: '/',
    file: 'index.html',
    title: 'ReefTotem AI 软件系统矩阵 | 星伴 Assistant 下载、OPC 企业平台、QuantAgent',
    description:
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司的 AI 软件系统矩阵，提供星伴 Assistant macOS 下载、OPC 企业平台入口、QuantAgent 自动量化系统发布路线和技术文档。',
    h1: '星伴 Assistant 1.0 现在可以从官网下载',
    intro:
      'ReefTotem 官网新版以下载中心为第一优先级动作。星伴 Assistant 1.0 已提供 macOS Apple Silicon DMG 下载，OPC 企业平台提供线上控制台入口，QuantAgent 完成后沿同一下载中心发布。',
    sections: [
      [
        '下载中心优先',
        '下载中心不是单产品页，而是公司产品交付入口。当前可下载星伴 Assistant 1.0 macOS Apple Silicon 安装包，后续 QuantAgent 完成后从同一入口发布。',
      ],
      [
        'OPC 企业平台',
        'OPC 是 ReefTotem 的企业自动化与 AI 公司控制台，用于客户工作区、AI 公司、数字员工、项目交付、日志和审核结果管理。',
      ],
      [
        '星伴 Assistant',
        '星伴是 ReefTotem 的桌面 AI 入口，覆盖聊天、长期记忆、提醒、活动记录和本地优先工作流，当前官网开放 1.0 下载。',
      ],
      [
        'QuantAgent',
        'QuantAgent 是面向策略研究、证据门禁、风险控制和自动化执行的量化系统。完成后会在官网提供下载或内测入口。',
      ],
      [
        '真实品牌资产',
        '官网使用公司确认的 ReefTotem 官方 logo 和星伴产品 logo，展示真实产品截图、真实下载包和明确的交付状态。',
      ],
    ],
    jsonLdTypes: ['organization', 'website', 'assistantSoftware'],
  },
  {
    path: '/products',
    file: 'products/index.html',
    flatFile: 'products.html',
    title: 'ReefTotem 产品体系 | OPC 企业平台、星伴 Assistant、QuantAgent',
    description:
      'ReefTotem 产品体系覆盖 OPC 企业平台、星伴 Assistant 桌面 AI 入口、QuantAgent 自动量化系统和公司级 AI 软件交付标准，按真实成熟度展示截图、入口和发布状态。',
    h1: 'ReefTotem 产品体系',
    intro:
      '官网顶部保持公司级导航，产品体系在正文中呈现。OPC、星伴 Assistant 和 QuantAgent 分别对应企业平台、个人桌面入口和自动量化系统，页面按当前真实交付状态展示。',
    sections: [
      [
        'OPC 企业平台',
        '面向企业创建 AI 公司、配置数字员工、管理客户工作区、项目交付、运行日志和 WorkProduct 审核。当前提供线上控制台入口。',
      ],
      [
        '星伴 Assistant',
        '个人桌面 AI 入口，当前开放 1.0 macOS Apple Silicon 下载。官网展示真实产品截图、版本号和安装包入口。',
      ],
      [
        'QuantAgent',
        '围绕策略 Alpha 深研、证据工厂、风险控制和自动化流程建设，完成后将在官网下载中心提供入口。',
      ],
      [
        '公司级交付',
        '所有产品都按真实截图、真实入口、明确成熟度和可验证边界展示，避免把规划能力包装成已经发布的产品。',
      ],
      [
        '技术文档',
        '技术文档用于说明安装、更新、部署、安全边界、产品状态和后续发布路径，和官网页面保持同一套事实口径。',
      ],
    ],
    jsonLdTypes: ['organization', 'software'],
  },
  {
    path: '/assistant',
    file: 'assistant/index.html',
    flatFile: 'assistant.html',
    title: '星伴 Assistant 1.0 | ReefTotem 桌面 AI 入口',
    description:
      '星伴 Assistant 是 ReefTotem 的桌面 AI 入口，提供聊天、长期记忆、提醒、活动记录和本地优先工作流，当前官网开放 macOS Apple Silicon DMG 下载。',
    h1: '星伴 Assistant 1.0',
    intro:
      '星伴是 ReefTotem 的个人桌面助手产品。当前官网开放 1.0 macOS Apple Silicon DMG 下载，页面展示真实桌面应用截图和版本信息。',
    sections: [
      [
        '自然语言入口',
        '用户通过聊天表达目标，星伴把提醒、记忆、资料整理和工具调用收进桌面体验，不需要把普通用户暴露在底层工程概念里。',
      ],
      [
        '长期记忆与活动记录',
        '偏好、提醒、执行结果和关键活动会形成可追踪记录，便于用户回看、纠正和继续推进。',
      ],
      [
        '桌面体验',
        '星伴围绕桌面常驻、主窗口、聊天和任务反馈组织体验，让个人用户从轻量入口接入 ReefTotem 的 AI 软件能力。',
      ],
      [
        '当前版本',
        '当前官网下载版本为 1.0.0，文件名为 Xingban-Assistant-1.0.0-aarch64.dmg，适用于 macOS Apple Silicon。',
      ],
      [
        '企业扩展',
        '团队版、私有 Provider 接入、企业内部试用和定制流程可以通过联系入口沟通，官网不会伪造尚未开放的企业下载。',
      ],
    ],
    jsonLdTypes: ['organization', 'assistantSoftware', 'breadcrumb'],
  },
  {
    path: '/about',
    file: 'about/index.html',
    flatFile: 'about.html',
    title: '关于 ReefTotem AI 软件公司 | 深圳前海瑞孚图腾科技有限公司',
    description:
      '了解深圳前海瑞孚图腾科技有限公司和 ReefTotem 的公司定位、AI 软件产品方向、企业自动化交付原则、数据安全边界、建设节点、试点方法和对外合作方式，判断它如何帮助团队运营 AI 公司。',
    h1: '关于深圳前海瑞孚图腾科技有限公司',
    intro:
      'ReefTotem 专注于 AI 软件产品和企业自动化能力建设，官网承担公司介绍、产品矩阵、试用入口、部署咨询和用户文档入口。公司目标是把 AI 从演示型能力推进到真实经营系统，让团队能持续管理、验证和复盘 AI 带来的结果。',
    sections: [
      [
        '公司定位',
        'ReefTotem 帮助团队把 AI 软件产品接入真实流程，而不是只停留在演示。产品设计关注组织、流程、权限、工具、审计和交付，当前重点产品包括 OPC、星伴 Assistant 和 QuantAgent。',
      ],
      [
        '交付原则',
        'Issue、Run、事件、工具调用和 WorkProduct 要能反向解释交付结果。任何业务试点都需要记录基线、执行过程、监控指标、人工判断和后续动作，这样才能知道结果来自系统优化、内容更新、搜索引擎变化还是外部偶然因素。',
      ],
      [
        '安全边界',
        '真实公司记忆和客户上下文不进入外售包，只允许脱敏模板复用。客户资料、代码上下文、账号权限、业务日志和生成结果需要按项目隔离，私有化部署时还需要明确备份、访问控制和回滚流程。',
      ],
      [
        '建设节点',
        'ReefTotem 的建设路径从公司官网、产品控制台、下载中心、业务验证、持续监控和交付文档开始，逐步扩展到星伴 Assistant、QuantAgent、公司能力包、行业模板和第三方系统适配。',
      ],
      [
        '合作方式',
        '外部合作通常从目标流程梳理、数据边界确认、试点版本部署和验收指标设计开始。对于复杂客户，ReefTotem 会优先选择可闭环的小场景，而不是一开始就承诺覆盖整个企业运营系统。',
      ],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/downloads',
    file: 'downloads/index.html',
    flatFile: 'downloads.html',
    title: 'ReefTotem 下载中心 | 星伴 Assistant 1.0 macOS 下载',
    description:
      'ReefTotem 下载中心提供星伴 Assistant 1.0 macOS Apple Silicon DMG 下载、OPC 企业平台入口、QuantAgent 后续发布说明、安装更新说明和技术文档。',
    h1: 'ReefTotem 下载中心',
    intro:
      '下载中心是公司产品交付入口。当前开放星伴 Assistant 1.0 macOS Apple Silicon 安装包，OPC 提供线上控制台，QuantAgent 完成后从同一入口发布。',
    sections: [
      [
        '星伴 Assistant 下载',
        '当前可下载文件为 /downloads/Xingban-Assistant-1.0.0-aarch64.dmg，版本 1.0.0，适用于 macOS Apple Silicon。',
      ],
      [
        '安装与更新',
        '下载 DMG 后拖入 Applications。后续版本会沿同一下载中心发布，并保留版本说明。',
      ],
      [
        'OPC 企业平台',
        'OPC 是线上控制台入口，不通过下载包交付。官网提供入口和产品说明，客户可进入控制台查看平台能力。',
      ],
      [
        'QuantAgent 发布路线',
        'QuantAgent 当前展示产品方向和真实截图，完成后会沿同一下载中心发布，不在官网提前伪造下载。',
      ],
      [
        '发布原则',
        '下载入口只指向真实产物，产品状态按当前可用、演示联系和即将开放排列。',
      ],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/billing',
    file: 'billing/index.html',
    flatFile: 'billing.html',
    title: 'ReefTotem 账户钱包 | 充值、订阅、消费账单与软件权益',
    description:
      'ReefTotem 账户钱包提供星伴 Assistant、OPC 企业平台、QuantAgent 的统一充值、订阅购买、消费账单、钱包余额和软件权益查询入口。',
    h1: 'ReefTotem 账户钱包',
    intro:
      '账户钱包是 ReefTotem 官网的统一充值和权益管理入口。用户可以查看 RFT Credits 余额、冻结额度、订阅、订单、消费账本，以及星伴 Assistant、OPC 企业平台、QuantAgent 的可访问状态。',
    sections: [
      [
        '统一充值',
        '用户从官网创建充值包或订阅订单，支付通道可以是微信支付、支付宝、Stripe、对公转账或手动确认，但账本统一进入 Billing Core。',
      ],
      [
        '消费账本',
        '每一次入账、冻结、扣费和释放都会形成钱包流水，用户可以在官网查看最近账本，后台可以用于对账和运营分析。',
      ],
      [
        '产品权益',
        '星伴 Assistant、OPC 企业平台、QuantAgent 不各自实现支付系统，而是读取统一权益和钱包状态。',
      ],
      [
        '软件扣费',
        '高成本任务按照 reserve、commit、release 流程扣费，避免失败任务直接扣余额，也避免并发任务超额消费。',
      ],
      [
        '后台确认',
        '对公转账、手动收款和支付回调未上线前的异常订单，可以在管理后台计费中心确认入账。',
      ],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    flatFile: 'contact.html',
    title: '联系 ReefTotem | AI 软件系统与产品咨询',
    description:
      '联系 ReefTotem 获取星伴 Assistant 下载支持、OPC 企业平台演示、QuantAgent 内测、私有化部署、企业自动化流程设计和长期维护支持咨询。',
    h1: '联系 ReefTotem',
    intro:
      '如果你想了解星伴下载、OPC 企业平台、QuantAgent 内测或私有化部署，可以说明产品方向、目标流程、数据边界、当前系统环境和希望验证的业务指标。',
    sections: [
      ['联系邮箱', 'contact@reeftotem.ai。建议在邮件中说明公司名称、业务场景、目标流程、是否需要私有化部署、是否已有内部系统以及希望优先验证的结果。'],
      ['公司地址', '深圳市前海深港合作区。具体沟通通常先通过线上会议完成需求边界确认，再根据客户场景判断是否进入试点、部署或长期合作。'],
      [
        '适合沟通的内容',
        '星伴 Assistant 下载支持、OPC 企业平台演示、QuantAgent 内测、AI 公司创建、公司能力包、私有化部署、业务监控指标和验收报告设计。',
      ],
      [
        '前期准备',
        '在正式沟通前，客户可以先准备当前流程截图、已有系统入口、数据安全要求、人工处理耗时、失败案例和希望改善的指标。这样试点不会只停留在演示，而能更快形成可判断的业务结果。',
      ],
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
    logo: `${siteUrl}/images/brand/reeftotem-symbol-color.png`,
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
    name: 'ReefTotem OPC 企业平台',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${siteUrl}/products`,
    description: '面向客户工作区、AI 公司创建、数字员工组织、项目交付、日志和审核验收的企业平台。',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/OnlineOnly',
      priceCurrency: 'USD',
      price: '0',
      description: '线上控制台、项目咨询、试点和私有化部署沟通。',
    },
  };
  const assistantSoftware = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '星伴 Assistant',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'macOS',
    url: `${siteUrl}/assistant`,
    downloadUrl: `${siteUrl}/downloads/Xingban-Assistant-1.0.0-aarch64.dmg`,
    description: 'ReefTotem 的桌面 AI 入口，提供聊天、长期记忆、提醒、活动记录和本地优先工作流。',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      price: '0',
      description: '官网提供 macOS Apple Silicon DMG 下载。',
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

  return page.jsonLdTypes.map((type) => ({ organization, website, software, assistantSoftware, breadcrumb })[type]);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
