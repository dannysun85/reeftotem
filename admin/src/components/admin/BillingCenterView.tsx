import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  CreditCard,
  FileBarChart,
  LineChart,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserRoundCheck,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  BillingBreakdownItem,
  BillingAdminMetric,
  BillingSeriesPoint,
  BillingUserProfile,
  useBillingStore,
} from '@/stores/billingStore';
import { cn } from '@/lib/utils';

const moneyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('zh-CN');

const toneClass: Record<string, string> = {
  primary: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  info: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  neutral: 'bg-secondary text-muted-foreground border-border',
};

const stageLabel: Record<string, string> = {
  registered: '已注册',
  checkout_started: '已发起支付',
  trial_with_balance: '有余额试用',
  payer: '已付费',
  subscriber: '订阅中',
  suspended: '已停用',
};

const riskLabel: Record<string, string> = {
  healthy: '健康',
  attention: '需跟进',
  watch: '观察',
  new: '新用户',
  blocked: '停用',
};

function formatMetric(value: number, unit?: string) {
  if (unit === 'cents') {
    return moneyFormatter.format(value / 100);
  }
  return numberFormatter.format(value);
}

function maxSeriesValue(points: BillingSeriesPoint[]) {
  return Math.max(...points.map((point) => point.amount_cents ?? point.value), 1);
}

function MiniRevenueChart({ points }: { points: BillingSeriesPoint[] }) {
  const max = maxSeriesValue(points);
  const width = 520;
  const height = 160;
  const padding = { top: 18, right: 18, bottom: 28, left: 38 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const safePoints = points.length ? points : [{ label: '暂无', value: 0, amount_cents: 0 }];
  const coords = safePoints.map((point, index) => {
    const value = point.amount_cents ?? point.value;
    const x = padding.left + (safePoints.length === 1 ? chartWidth : (index / (safePoints.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - (value / max) * chartHeight;
    return { x, y, value, label: point.label };
  });
  const linePath = coords.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${padding.top + chartHeight} L${coords[0].x.toFixed(1)},${padding.top + chartHeight} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-visible">
      <defs>
        <linearGradient id="billingRevenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0071e3" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((tick) => {
        const y = padding.top + chartHeight - tick * chartHeight;
        return (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
              {moneyFormatter.format((max * tick) / 100)}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#billingRevenueFill)" />
      <path d={linePath} fill="none" stroke="#0071e3" strokeWidth="3" strokeLinecap="round" />
      {coords.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4" fill="#0071e3" />
          <text x={point.x} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            {point.label.slice(5)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BreakdownBars({ items, emptyLabel }: { items: BillingBreakdownItem[]; emptyLabel: string }) {
  if (!items.length) {
    return (
      <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.key}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="font-mono text-muted-foreground">
              {item.amount_cents !== undefined ? moneyFormatter.format(item.amount_cents / 100) : numberFormatter.format(item.value)}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(item.percentage, item.value > 0 ? 4 : 0)}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{item.percentage}%</div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ metric, icon: Icon }: { metric: BillingAdminMetric; icon: React.ElementType }) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl border', toneClass[metric.tone] || toneClass.neutral)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', toneClass[metric.tone] || toneClass.neutral)}>
          {metric.unit === 'cents' ? '金额' : '数量'}
        </span>
      </div>
      <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{formatMetric(metric.value, metric.unit)}</div>
      {metric.helper && <div className="mt-2 text-xs text-muted-foreground">{metric.helper}</div>}
    </div>
  );
}

function UserProfileCard({ profile }: { profile: BillingUserProfile }) {
  const riskTone = profile.risk_level === 'healthy'
    ? toneClass.success
    : profile.risk_level === 'blocked'
      ? 'bg-red-500/10 text-red-600 border-red-500/20'
      : profile.risk_level === 'attention'
        ? toneClass.warning
        : toneClass.neutral;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-bold text-foreground">
            {(profile.name || profile.email).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-foreground">{profile.name || '未命名用户'}</div>
            <div className="truncate text-xs text-muted-foreground">{profile.email}</div>
          </div>
        </div>
        <span className={cn('shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium', riskTone)}>
          {riskLabel[profile.risk_level] || profile.risk_level}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-secondary/70 p-3">
          <div className="text-muted-foreground">生命周期</div>
          <div className="mt-1 font-semibold text-foreground">{stageLabel[profile.lifecycle_stage] || profile.lifecycle_stage}</div>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <div className="text-muted-foreground">钱包余额</div>
          <div className="mt-1 font-mono font-semibold text-foreground">{moneyFormatter.format(profile.wallet_balance_cents / 100)}</div>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <div className="text-muted-foreground">累计付费</div>
          <div className="mt-1 font-mono font-semibold text-foreground">{moneyFormatter.format(profile.total_paid_cents / 100)}</div>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <div className="text-muted-foreground">订阅 / 订单</div>
          <div className="mt-1 font-semibold text-foreground">{profile.active_subscriptions} / {profile.order_count}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {profile.notes.map((note) => (
          <span key={note} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}

const metricIcons = [CircleDollarSign, Wallet, CreditCard, UserRoundCheck];

const profileFilters = [
  { value: 'all', label: '全部' },
  { value: 'healthy', label: '健康' },
  { value: 'attention', label: '需跟进' },
  { value: 'watch', label: '观察' },
  { value: 'new', label: '新用户' },
  { value: 'blocked', label: '停用' },
];

const BillingCenterView = () => {
  const { dashboard, fetchDashboard, markOrderPaid, isLoading, error } = useBillingStore();
  const [profileFilter, setProfileFilter] = useState('all');

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const data = dashboard;
  const filteredProfiles = useMemo(() => {
    if (!data) return [];
    if (profileFilter === 'all') return data.user_profiles;
    return data.user_profiles.filter((profile) => profile.risk_level === profileFilter);
  }, [data, profileFilter]);

  if (!data && isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        正在加载计费运营数据...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-[24px] border border-border bg-card p-8 text-muted-foreground">
        计费数据暂不可用。
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">计费中心</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            自研 Billing Core 的运营后台：统一查看收入、订单、订阅、钱包余额、支付通道、报表和用户状态画像。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {data.data_quality.length > 0 && (
            <div className="flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {data.data_quality.join(' / ')}
            </div>
          )}
          <Button size="sm" variant="outline" onClick={fetchDashboard} disabled={isLoading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
            刷新
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700">
          当前显示降级数据：{error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard key={metric.key} metric={metric} icon={metricIcons[index] || TrendingUp} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="flex items-center text-lg font-bold text-foreground">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                收入趋势
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">按支付完成时间聚合的近 6 个月收入。</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {new Date(data.generated_at).toLocaleString('zh-CN')}
            </span>
          </div>
          <MiniRevenueChart points={data.revenue_series} />
        </div>

        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-1 flex items-center text-lg font-bold text-foreground">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            产品收入结构
          </h3>
          <p className="mb-5 text-sm text-muted-foreground">星伴、OPC、QuantAgent 和充值包的收入占比。</p>
          <BreakdownBars items={data.product_revenue} emptyLabel="还没有已支付订单，收入结构等待真实交易。" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">支付通道</h3>
          <BreakdownBars items={data.provider_mix} emptyLabel="等待微信、支付宝、Stripe 或对公转账订单。" />
        </div>
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">订单状态</h3>
          <BreakdownBars items={data.order_status_breakdown} emptyLabel="暂无 payment_orders 数据。" />
        </div>
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">订阅状态</h3>
          <BreakdownBars items={data.subscription_status} emptyLabel="订阅状态会在套餐购买后出现。" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="flex items-center text-lg font-bold text-foreground">
                <FileBarChart className="mr-2 h-5 w-5 text-primary" />
                报表中心
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">第一期先保留可审计口径，后续接 CSV / PDF 导出。</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.reports.map((report) => (
              <div key={report.key} className="rounded-2xl border border-border bg-background p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-foreground">{report.title}</div>
                    <div className="text-xs text-muted-foreground">{report.period}</div>
                  </div>
                  <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', report.status === 'ready' ? toneClass.success : toneClass.warning)}>
                    {report.status}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-4 text-sm">
                  <span className="font-mono font-semibold text-foreground">{moneyFormatter.format(report.amount_cents / 100)}</span>
                  <span className="text-muted-foreground">{numberFormatter.format(report.count)} 条</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{report.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h3 className="flex items-center text-lg font-bold text-foreground">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                用户状态画像
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">按余额、订阅、支付订单和账号状态给运营做分层。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setProfileFilter(filter.value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    profileFilter === filter.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <BreakdownBars items={data.user_segments} emptyLabel="暂无用户画像分层数据。" />
          </div>

          <div className="grid max-h-[560px] gap-3 overflow-y-auto pr-1">
            {filteredProfiles.map((profile) => (
              <UserProfileCard key={profile.user_id} profile={profile} />
            ))}
            {filteredProfiles.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center text-sm text-muted-foreground">
                当前筛选条件下没有用户。
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">最近订单</h3>
            <p className="mt-1 text-sm text-muted-foreground">用于运营排查支付状态、产品归属和用户归属。</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">订单号</th>
                <th className="px-4 py-3 font-medium">产品 / 套餐</th>
                <th className="px-4 py-3 font-medium">通道</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 text-right font-medium">金额</th>
                <th className="px-4 py-3 text-right font-medium">创建时间</th>
                <th className="px-4 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {data.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/60">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{order.order_no}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="font-medium text-foreground">{order.product_code || 'top_up'}</div>
                    <div className="text-xs">{order.plan_code || order.order_type}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.provider}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', order.status === 'paid' ? toneClass.success : toneClass.warning)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{moneyFormatter.format(order.amount_cents / 100)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('zh-CN')}</td>
                  <td className="px-4 py-3 text-right">
                    {order.status === 'paid' ? (
                      <span className="text-xs text-muted-foreground">已入账</span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => markOrderPaid(order.order_no)} disabled={isLoading}>
                        确认入账
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {data.recent_orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    暂无订单。接入 checkout API 和支付回调后会自动出现。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingCenterView;
