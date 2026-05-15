import React, { useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Image,
  Package,
  ReceiptText,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useBillingStore } from '@/stores/billingStore';
import { useContentStore } from '@/stores/contentStore';
import { useDownloadsStore } from '@/stores/downloads';
import { useProductsStore } from '@/stores/productsStore';
import { useUsersStore } from '@/stores/usersStore';

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: 'blue' | 'cyan' | 'emerald' | 'amber' | 'slate' | 'violet';
};

const toneClass: Record<StatCardProps['tone'], string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
};

const StatCard = ({ title, value, helper, icon: Icon, tone }: StatCardProps) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneClass[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        API 数据
      </span>
    </div>
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
    <p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">{helper}</p>
  </div>
);

function money(cents: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const DashboardView = () => {
  const { dashboard, fetchDashboard, error: billingError } = useBillingStore();
  const { products, fetchProducts, error: productsError } = useProductsStore();
  const { items: downloads, fetchItems: fetchDownloads, error: downloadsError } = useDownloadsStore();
  const { users, fetchUsers, error: usersError } = useUsersStore();
  const { items: contentItems, fetchItems: fetchContentItems, error: contentError } = useContentStore();

  useEffect(() => {
    void fetchDashboard();
    void fetchProducts();
    void fetchDownloads();
    void fetchUsers();
    void fetchContentItems();
  }, [fetchContentItems, fetchDashboard, fetchDownloads, fetchProducts, fetchUsers]);

  const metric = (key: string) => dashboard?.metrics.find((item) => item.key === key);
  const revenue30d = metric('revenue_30d')?.value || 0;
  const activeSubscriptions = metric('active_subscriptions')?.value || 0;
  const totalDownloadCount = downloads.reduce((acc, item) => acc + (item.download_count || 0), 0);

  const errors = [
    billingError && `计费中心：${billingError}`,
    productsError && `产品管理：${productsError}`,
    downloadsError && `下载管理：${downloadsError}`,
    usersError && `用户管理：${usersError}`,
    contentError && `内容管理：${contentError}`,
  ].filter((item): item is string => Boolean(item));

  const integrationStates = [
    {
      name: '计费中心',
      status: '已接后台 API',
      detail: '/api/v1/billing/admin-dashboard、订单确认、钱包账本和用户画像来自 Billing Core。',
      ready: true,
    },
    {
      name: '用户管理',
      status: '已接后台 API',
      detail: '/api/v1/users 是当前账号和管理员管理入口。',
      ready: true,
    },
    {
      name: '内容管理',
      status: '后台可写，前台待接',
      detail: '内容配置已写入后端；官网首页/产品页仍主要使用静态发布内容，不能当成实时 CMS 闭环。',
      ready: false,
    },
    {
      name: '产品管理',
      status: '后台可写，前台待接',
      detail: '产品记录已接 /api/v1/products；官网产品展示目前没有完全读取这些记录。',
      ready: false,
    },
    {
      name: '下载管理',
      status: '后台可写，前台待接',
      detail: '下载记录已接 /api/v1/downloads；官网下载页当前以真实静态 release 为准，下一步再改成 API 驱动。',
      ready: false,
    },
  ];

  const topDownloads = [...downloads]
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Database className="h-3.5 w-3.5" />
          已移除本地假数据
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">运营仪表盘</h2>
        <p className="max-w-3xl text-muted-foreground">
          这里现在只展示后台 API 能拿到的真实记录和接入状态。前台还没消费的 CMS 模块会明确标注为“前台待接”，不再伪装成完整运营闭环。
        </p>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            部分 API 暂时不可用
          </div>
          <div className="space-y-1">
            {errors.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="近 30 天收入"
          value={money(revenue30d)}
          helper="来自 Billing Core 订单和入账记录。"
          icon={ReceiptText}
          tone="blue"
        />
        <StatCard
          title="活跃订阅"
          value={activeSubscriptions.toLocaleString()}
          helper="只统计后端订阅表，不再使用写死数字。"
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          title="后台用户"
          value={users.length.toLocaleString()}
          helper="来自用户管理 API。"
          icon={Users}
          tone="violet"
        />
        <StatCard
          title="产品记录"
          value={products.length.toLocaleString()}
          helper="来自产品管理 API，前台消费状态见下方接入表。"
          icon={Package}
          tone="slate"
        />
        <StatCard
          title="下载记录"
          value={downloads.length.toLocaleString()}
          helper={`下载计数合计 ${totalDownloadCount.toLocaleString()}。`}
          icon={Download}
          tone="cyan"
        />
        <StatCard
          title="内容模块"
          value={contentItems.length.toLocaleString()}
          helper="来自内容管理 API，官网前台仍待彻底数据化。"
          icon={Image}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">模块接入状态</h3>
          <div className="space-y-3">
            {integrationStates.map((item) => (
              <div key={item.name} className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="font-semibold text-foreground">{item.name}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${item.ready ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">Billing 数据质量</h3>
          <div className="space-y-3">
            {(dashboard?.data_quality?.length ? dashboard.data_quality : ['billing_dashboard_loaded']).map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4 text-sm leading-6 text-muted-foreground">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">下载记录排行</h3>
          <div className="space-y-3">
            {topDownloads.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-secondary/30 p-4">
                <div className="flex items-center gap-4">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.platform || item.os_type}</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-primary">{item.download_count?.toLocaleString() || 0}</span>
              </div>
            ))}
            {topDownloads.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                暂无下载记录。
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">最近订单</h3>
          <div className="space-y-3">
            {(dashboard?.recent_orders || []).slice(0, 5).map((order) => (
              <div key={order.id} className="rounded-2xl bg-secondary/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="break-all font-mono text-xs text-foreground">{order.order_no}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{order.product_code || order.order_type}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-muted-foreground">{order.status}</div>
                    <div className="mt-1 font-mono text-sm font-semibold text-foreground">{money(order.amount_cents)}</div>
                  </div>
                </div>
              </div>
            ))}
            {(!dashboard || dashboard.recent_orders.length === 0) && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                暂无订单，接入真实充值或后台确认入账后会显示。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
