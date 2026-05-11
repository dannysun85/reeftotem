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
      'ReefTotem 是深圳前海瑞孚图腾科技有限公司旗下 AI 软件品牌，建设 AI 公司操作系统、企业自动化智能助手、量化研究工具、内容安全能力和私有化部署服务，帮助团队把 AI 员工、工具、审批、日志和交付结果放进真实业务流程。',
    h1: 'ReefTotem AI 公司操作系统与企业自动化软件',
    intro:
      'ReefTotem 面向真实业务场景建设可部署、可验证、可持续迭代的 AI 软件产品，帮助企业把 AI 员工、工具、审批、日志、文档和交付结果放进可运营流程。官网用于说明公司定位、产品矩阵、试点入口、私有化部署边界和长期维护方式。',
    sections: [
      [
        'AI 公司操作系统',
        'ReefTotem 的核心方向是把数字员工、任务队列、工具调用、项目工作间、交付物审核和运行日志组织成企业可以管理的系统，而不是只提供一次性的聊天窗口。团队可以围绕真实客户项目创建 Run，追踪每一步输入、输出、责任人和验收结果。',
      ],
      [
        '企业自动化智能助手',
        'Reeftotem Assistant 面向办公辅助、知识问答、资料整理、流程提醒和轻量协作，适合从单个业务流程开始试点，再逐步扩展到运营、销售、研究、客服、内容安全和内部知识管理。',
      ],
      [
        '可验证交付',
        '系统强调可解释、可复盘和可验收：Issue、Run、事件、工具调用、WorkProduct、人工审核和监控报告都要能反向解释最终结果，方便团队判断 AI 是否真正提升效率，而不是只依赖主观感觉。',
      ],
      [
        '私有化部署与长期维护',
        'ReefTotem 支持围绕客户数据边界、账号权限、服务器部署、备份恢复、升级验证和回滚策略进行交付。真实公司记忆、客户上下文和业务资料需要隔离管理，外部可复用的只是脱敏模板和通用能力包。',
      ],
      [
        '服务边界',
        'ReefTotem 提供软件产品、私有化部署、版本升级、文档和长期维护支持，不承诺投资收益、搜索排名或任何不可验证的第三方平台结果。业务验证需要通过持续监控、前后对照和阶段复盘来判断。',
      ],
    ],
    jsonLdTypes: ['organization', 'website'],
  },
  {
    path: '/products',
    file: 'products/index.html',
    flatFile: 'products.html',
    title: 'ReefTotem 产品矩阵 | AI 公司操作系统、Reeftotem Assistant、量化研究与内容安全',
    description:
      'ReefTotem 产品矩阵覆盖 AI 公司操作系统、Reeftotem Assistant 桌面 AI 伴侣、量化研究工具、内容安全能力、数字员工和公司能力包，按成熟度说明线上控制台、发布状态、行业能力和交付边界。',
    h1: 'ReefTotem 产品矩阵',
    intro:
      'ReefTotem 的产品组合按成熟度展示，核心包括已部署控制台、规划中的助手产品线、量化研究工具、内容安全能力和可复用公司能力包。产品页用于帮助客户判断当前可以试点什么、哪些能力仍在规划、哪些场景需要私有化定制。',
    sections: [
      [
        'AI 公司操作系统',
        '为团队创建 AI 公司、配置数字员工、管理项目交付和审核结果的企业操作系统。它关注组织结构、任务拆分、执行记录、工具权限、交付物沉淀和管理者验收，适合需要把 AI 能力嵌入日常运营的团队。',
      ],
      [
        'Reeftotem Assistant',
        '本地优先的 Live2D 桌面 AI 伴侣，覆盖聊天、人格、情绪、长期记忆、日历提醒、知识库、Activity 行动记录和自然语言自动化。它是个人与企业进入 ReefTotem 能力矩阵的低门槛入口。',
      ],
      [
        '量化研究工具',
        '面向行情分析、策略研究、回测记录、风险监控和交易流程辅助，坚持工具和风控边界。该方向强调研究流程、数据记录和风险提示，不把工具包装成收益承诺，也不替代用户自己的投资决策。',
      ],
      [
        '内容安全能力',
        '围绕音视频识别、内容风险、事件追踪和企业安全流程接入形成解决方案。适合需要做素材审核、风险标注、留痕记录、人工复核和安全策略闭环的企业或平台场景。',
      ],
      [
        '数字员工与公司能力包',
        'ReefTotem 会把可复用流程沉淀成公司能力包，例如运营研究、销售线索整理、内容检查、文档生成、客户交付和内部知识维护。能力包需要结合客户数据边界和业务目标进行选择，不建议一次性全量铺开。',
      ],
      [
        '成熟度与边界',
        '产品矩阵会持续标记已上线、可试点、规划中和需要定制的能力，避免客户把概念页误解成全部可立即交付。每个阶段都需要通过真实业务 run、监控记录和验收标准来判断是否进入下一步。',
      ],
    ],
    jsonLdTypes: ['organization', 'software'],
  },
  {
    path: '/assistant',
    file: 'assistant/index.html',
    flatFile: 'assistant.html',
    title: 'Reeftotem Assistant | Live2D 桌面 AI 伴侣与自然语言自动化',
    description:
      'Reeftotem Assistant 是本地优先的 Live2D 桌面 AI 伴侣，覆盖聊天、人格、情绪、长期记忆、日历提醒、知识库、Activity 行动记录、Workflow、MCP 工具和 Provider 能力。',
    h1: 'Reeftotem Assistant 桌面 AI 伴侣',
    intro:
      'Reeftotem Assistant 把 AI 伴侣和桌面 Agent 合在一个本地优先的应用里。用户通过自然语言表达目标，人物判断要不要记忆、提醒、检索、创建 Workflow 或调用工具；高风险动作先请求授权，执行完成后回到 Chat 汇报并在 Activity 留下可追踪记录。',
    sections: [
      [
        '用户只需要聊天',
        '提醒、记忆、资料整理、Workflow 和工具调用都从自然语言发起，普通用户不需要学习 Cron、MCP 或 DAG。MCP、Cron、Workflow、A2A 和 Provider 是底层能力，不是普通用户的主入口。',
      ],
      [
        '人格、情绪和长期记忆',
        '人物主题影响说话方式、system prompt、能力边界和长期记忆。用户可以让角色记住偏好、删除错误记忆、纠正旧内容，并通过 Activity 查看记忆写入和纠错记录。',
      ],
      [
        'Live2D 桌面常驻',
        '角色可以常驻桌面，以短气泡、主窗口和 Activity 记录配合工作。桌宠体验需要避免遮挡用户主要工作区，并尽量减少透明窗口对其他应用的鼠标干扰。',
      ],
      [
        '可解释行动记录',
        '记忆写入、提醒创建、工具授权、失败恢复、撤销和 trace 都进入 Activity。工具失败时应该说明原因、替代路径、重试方式和是否能撤销。',
      ],
      [
        '发布状态',
        '当前官网基线版本是 0.9.22，仍不是公开稳定版。公开下载必须等待 Developer ID 签名、公证、updater 安装回滚 smoke 和新用户空白状态 smoke 全部通过。',
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
        'ReefTotem 帮助企业运营 AI 公司，而不是把所有工作塞进单个聊天窗口。产品设计关注组织、流程、权限、工具、审计和交付，目标客户包括希望搭建 AI 员工体系、自动化运营流程或内部智能工作台的团队。',
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
        'ReefTotem 的建设路径从公司官网、产品控制台、业务验证、持续监控和交付文档开始，逐步扩展到 Reeftotem Assistant、公司能力包、行业模板和第三方系统适配。每一步都需要保留可审计证据，避免产品路线只停留在概念层。',
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
    title: 'ReefTotem 文档与入口 | OPC 控制台、部署说明与安全边界',
    description:
      'ReefTotem 文档与入口页面提供 OPC 控制台、Reeftotem Assistant 发布状态、产品使用手册、部署升级 runbook、安全与数据边界说明、后续下载入口和合作咨询路径。',
    h1: 'ReefTotem 文档与入口',
    intro:
      '这里提供产品控制台、Reeftotem Assistant 发布状态、使用说明、部署 runbook 和安全边界说明。未完成签名、公证和 smoke 的客户端不会作为公开稳定版下载。下载页不是营销物料堆放区，而是让客户进入真实产品流程、试点流程和交付文档的入口。',
    sections: [
      [
        'OPC 控制台',
        '用于 SaaS 账号、公司创建、员工组织、项目立项、Run、WorkProduct 和审核。客户可以从控制台进入业务验证流程，查看项目状态、任务记录、交付物和验收结果。',
      ],
      [
        '产品使用手册',
        '从注册账号、创建客户工作区、选择公司包，到提交项目目标、查看工作间、审核交付物。手册需要覆盖正常路径、失败路径、权限边界和常见问题，便于新用户按页面流程学习。',
      ],
      [
        '部署与升级',
        '记录服务器初始化、源码同步、域名绑定、环境变量、备份、验证和回滚方式。私有化交付时，部署文档要和版本号、验证命令、监控结果、变更记录一起保留。',
      ],
      [
        '安全边界',
        '公司实例、员工记忆、客户资料、代码上下文和可售模板之间必须隔离。对外文档只描述能力和流程，不暴露客户隐私、内部账号、未脱敏日志或不可公开的业务资产。',
      ],
      [
        '后续入口',
        '后续下载入口会按真实发布状态开放，包括 Reeftotem Assistant 客户端、行业 SDK、部署模板、监控报告样例和业务验证模板。未发布能力会保持说明状态，避免客户误以为已经可以直接下载使用。',
      ],
    ],
    jsonLdTypes: ['organization', 'breadcrumb'],
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    flatFile: 'contact.html',
    title: '联系 ReefTotem | AI 公司操作系统与私有化部署咨询',
    description:
      '联系 ReefTotem 获取 AI 公司操作系统、Reeftotem Assistant、量化研究工具、内容安全能力、私有化部署、企业自动化流程设计、业务验证方案和长期维护支持咨询，适合需要真实试点落地的团队。',
    h1: '联系 ReefTotem',
    intro:
      '如果你想了解 AI 公司操作系统、Reeftotem Assistant、量化研究工具、私有化部署或音视频安全检测等应用场景，可以说明产品方向、目标流程、数据边界、当前系统环境和希望验证的业务指标。清晰的输入能帮助双方更快判断是否适合试点。',
    sections: [
      ['联系邮箱', 'contact@reeftotem.ai。建议在邮件中说明公司名称、业务场景、目标流程、是否需要私有化部署、是否已有内部系统以及希望优先验证的结果。'],
      ['公司地址', '深圳市前海深港合作区。具体沟通通常先通过线上会议完成需求边界确认，再根据客户场景判断是否进入试点、部署或长期合作。'],
      [
        '适合沟通的内容',
        '产品控制台试用、Reeftotem Assistant 合作、量化研究工具、AI 公司创建、公司能力包、私有化部署、行业安全检测流程、业务监控指标和验收报告设计。ReefTotem 更适合能提供明确业务流程和验证目标的客户。',
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
  const assistantSoftware = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Reeftotem Assistant',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'macOS, Windows, Linux',
    url: `${siteUrl}/assistant`,
    description:
      '本地优先的 Live2D 桌面 AI 伴侣，覆盖聊天、人格、情绪、长期记忆、日历提醒、知识库、Activity 行动记录和自然语言自动化。',
    softwareVersion: '0.9.22',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/PreOrder',
      priceCurrency: 'USD',
      price: '0',
      description: '公开下载等待签名、公证、updater smoke 和新用户空白状态 smoke。',
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
