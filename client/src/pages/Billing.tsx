import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CreditCard,
  Download,
  ExternalLink,
  KeyRound,
  PlugZap,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react';
import request from '@/api/request';

type BillingPlan = {
  id: string;
  product_code: string;
  code: string;
  name: string;
  cycle: string;
  currency: string;
  price_cents: number;
  included_credit_cents: number;
  seat_limit: number;
  features?: string[] | null;
};

type WalletSnapshot = {
  id: string;
  balance_cents: number;
  reserved_cents: number;
  currency: string;
};

type PaymentOrder = {
  id: string;
  order_no: string;
  product_code?: string | null;
  plan_code?: string | null;
  provider: string;
  order_type: string;
  status: string;
  amount_cents: number;
  credit_amount_cents: number;
  created_at: string;
  paid_at?: string | null;
};

type LedgerEntry = {
  id: string;
  direction: string;
  reason: string;
  amount_cents: number;
  balance_after_cents: number;
  source_provider?: string | null;
  source_id?: string | null;
  created_at: string;
};

type Subscription = {
  id: string;
  product_code: string;
  plan_code: string;
  status: string;
  current_period_end?: string | null;
};

type Entitlement = {
  product_code: string;
  can_access: boolean;
  reason: string;
  plan_code?: string | null;
  current_period_end?: string | null;
};

type BillingPortal = {
  wallet: WalletSnapshot;
  entitlements: Entitlement[];
  subscriptions: Subscription[];
  recent_orders: PaymentOrder[];
  recent_ledger: LedgerEntry[];
};

type CheckoutResponse = {
  order: PaymentOrder;
  payment_action: {
    kind: string;
    label: string;
    provider: string;
    checkout_url?: string | null;
    qr_code_url?: string | null;
    instructions?: string | null;
  };
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  session_id?: string;
  account_id?: string;
};

type SsoApplication = {
  client_id: string;
  name: string;
  product_code: string;
  surface: string;
  launch_url: string;
  login_method: string;
  entitlement_product_code: string;
  notes: string[];
};

type AccountContext = {
  account: {
    id: string;
    email: string;
    full_name?: string | null;
  };
  current_session?: {
    id: string;
    client_id: string;
    status: string;
    expires_at: string;
  } | null;
  applications: SsoApplication[];
  billing_owner: {
    owner_type: string;
    owner_id: string;
  };
};

const productLabels: Record<string, string> = {
  xingban: '星伴 Assistant',
  opc: 'OPC 企业平台',
  quantagent: 'QuantAgent',
  rft_credits: '通用额度',
};

const productDescriptions: Record<string, string> = {
  xingban: '桌面 AI 入口、聊天、长期记忆和轻量自动化。',
  opc: '企业 AI 公司、数字员工、项目交付和运营自动化。',
  quantagent: '策略 Alpha 深研、证据工厂、回测和自动量化流程。',
};

const topUpPacks = [
  { label: '100 元额度包', amount_cents: 10000, helper: '适合星伴轻量模型调用和试用。' },
  { label: '500 元额度包', amount_cents: 50000, helper: '适合多产品共享、OPC 演示和团队试点。' },
  { label: '2000 元企业预存', amount_cents: 200000, helper: '适合 OPC 企业客户、QuantAgent 研究消耗。' },
];

const softwareContracts = [
  {
    product: '星伴 Assistant',
    check: '启动/登录后调用 /billing/me/portal',
    usage: '每次云模型任务 reserve -> commit；失败 release',
    entitlement: 'xingban.can_access 或钱包可用余额',
    icon: Download,
  },
  {
    product: 'OPC 企业平台',
    check: '企业工作区绑定 owner_type=organization',
    usage: '按 AI 员工任务、报告生成、企业自动化执行扣费',
    entitlement: 'opc 订阅、企业预付款或后台合同开通',
    icon: PlugZap,
  },
  {
    product: 'QuantAgent',
    check: '研究账号/机构空间读取 quantagent 权益',
    usage: '按策略研究、回测、证据报告和告警 reserve/commit',
    entitlement: 'quantagent 订阅或机构额度池',
    icon: Zap,
  },
];

function money(cents: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(value?: string | null) {
  if (!value) return '未完成';
  return new Date(value).toLocaleString('zh-CN', { hour12: false });
}

function statusText(status: string) {
  const labels: Record<string, string> = {
    created: '待支付',
    pending: '处理中',
    paid: '已支付',
    failed: '失败',
    refunded: '已退款',
    canceled: '已取消',
    active: '生效中',
  };
  return labels[status] || status;
}

const Billing = () => {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [portal, setPortal] = useState<BillingPortal | null>(null);
  const [accountContext, setAccountContext] = useState<AccountContext | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<CheckoutResponse | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignedIn = Boolean(localStorage.getItem('customer_token'));
  const availableCents = Math.max((portal?.wallet.balance_cents || 0) - (portal?.wallet.reserved_cents || 0), 0);

  const loadPlans = useCallback(async () => {
    const response: BillingPlan[] = await request.get('/billing/plans');
    setPlans(response);
  }, []);

  const loadPortal = useCallback(async () => {
    if (!localStorage.getItem('customer_token')) return;
    const response: BillingPortal = await request.get('/billing/me/portal');
    setPortal(response);
  }, []);

  const loadAccountContext = useCallback(async () => {
    if (!localStorage.getItem('customer_token')) return;
    const response: AccountContext = await request.get('/auth/me');
    setAccountContext(response);
  }, []);

  useEffect(() => {
    loadPlans().catch(() => setError('套餐暂时无法加载，请确认后端 API 已运行。'));
    loadAccountContext().catch(() => setError('账号上下文暂时无法加载，请重新登录。'));
    loadPortal().catch(() => setError('账户钱包暂时无法加载，请重新登录或确认 API 状态。'));
  }, [loadAccountContext, loadPlans, loadPortal]);

  const plansByProduct = useMemo(() => {
    return plans.reduce<Record<string, BillingPlan[]>>((acc, plan) => {
      acc[plan.product_code] = [...(acc[plan.product_code] || []), plan];
      return acc;
    }, {});
  }, [plans]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    try {
      const body = new URLSearchParams();
      body.set('username', email);
      body.set('password', password);
      const response: LoginResponse = await request.post('/auth/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('customer_token', response.access_token);
      await loadAccountContext();
      await loadPortal();
    } catch {
      setError('登录失败。请确认账号、密码和后端服务状态。');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    setAccountContext(null);
    setPortal(null);
    setPendingCheckout(null);
  };

  const createCheckout = async (payload: Record<string, unknown>) => {
    setIsBusy(true);
    setError(null);
    try {
      const response: CheckoutResponse = await request.post('/billing/checkout', {
        provider: 'manual',
        ...payload,
      });
      setPendingCheckout(response);
      await loadPortal();
    } catch {
      setError('订单创建失败。请先登录，并确认计费 API 可用。');
    } finally {
      setIsBusy(false);
    }
  };

  const confirmManualPayment = async (orderNo: string) => {
    setIsBusy(true);
    setError(null);
    try {
      await request.post(`/billing/me/orders/${orderNo}/mock-pay`, {
        provider_order_id: `manual-${orderNo}`,
        meta_data: { source: 'website_billing_page' },
      });
      setPendingCheckout(null);
      await loadPortal();
    } catch {
      setError('确认入账失败。只有 manual 开发/手动通道订单可以在官网模拟支付。');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid bg-[linear-gradient(180deg,#07122F_0%,#102447_58%,#E9EEF5_100%)] pt-36">
        <div className="section-shell grid gap-10 pb-16 pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[64px] lg:text-[88px]">
              统一充值、钱包与软件权益中心
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#DDF9FF]/78 sm:text-xl sm:leading-9">
              官网负责用户充值、订阅购买、消费账单和权益查询；OPC、星伴、QuantAgent 通过同一套 Billing Core 校验权限、冻结额度、完成扣费。
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={isSignedIn ? '#recharge' : '#account-login'} className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#22D5F5] px-8 text-base font-semibold text-[#07122F]">
                {isSignedIn ? '充值与购买' : '登录账户'}
                <CreditCard className="h-5 w-5" />
              </a>
              <a href="#software-access" className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#07122F]/70 px-8 text-base font-semibold text-white ring-1 ring-white/20">
                查看软件接入
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/12 bg-white/10 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <div className="rounded-[24px] bg-[#041127] p-6">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[#22D5F5]">Wallet</div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight">
                    {portal ? money(availableCents) : '登录后查看'}
                  </div>
                  <div className="mt-2 text-sm text-[#DDF9FF]/62">
                    冻结 {portal ? money(portal.wallet.reserved_cents) : money(0)} · {portal?.wallet.currency || 'CNY'}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#22D5F5] text-[#07122F]">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {['星伴', 'OPC', 'QuantAgent'].map((label) => {
                  const code = label === '星伴' ? 'xingban' : label === 'OPC' ? 'opc' : 'quantagent';
                  const entitlement = portal?.entitlements.find((item) => item.product_code === code);
                  return (
                    <div key={label} className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                      <div className="text-xs text-[#DDF9FF]/60">{label}</div>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <span className={entitlement?.can_access ? 'text-[#BEEB4D]' : 'text-[#DDF9FF]/50'}>
                          {entitlement?.can_access ? '可用' : '未开通'}
                        </span>
                        {entitlement?.can_access && <BadgeCheck className="h-4 w-4 text-[#BEEB4D]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[20px] border border-[#22D5F5]/20 bg-[#22D5F5]/8 p-4 text-sm leading-6 text-[#DDF9FF]/76">
                三款软件只消费统一钱包和权益，不各自实现支付。支付通道可以是微信、支付宝、Stripe 或对公转账，但账本和扣费口径保持一个。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#E9EEF5] py-20 text-[#07122F]">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-5">
            <div id="account-login" className="rounded-[28px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-[#075DFF]" />
                <h2 className="text-2xl font-semibold">账户登录</h2>
              </div>
              {isSignedIn ? (
                <div>
                  <div className="rounded-[18px] bg-[#F4F7FB] p-4 text-sm leading-6 text-[#50617F]">
                    当前浏览器已建立账号中心会话，可读取钱包、订单、消费记录和应用入口。
                  </div>
                  {accountContext && (
                    <div className="mt-3 rounded-[18px] bg-[#F4F7FB] p-4 text-sm leading-6 text-[#50617F]">
                      <div className="font-semibold text-[#07122F]">{accountContext.account.email}</div>
                      <div>会话：{accountContext.current_session?.client_id || 'legacy'} · {accountContext.current_session?.status || 'active'}</div>
                      <div>Owner：{accountContext.billing_owner.owner_type}</div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full border border-[#07122F]/12 text-sm font-semibold"
                  >
                    退出当前账户
                  </button>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={handleLogin}>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="邮箱"
                    className="h-12 w-full rounded-[16px] border border-[#07122F]/12 bg-[#F8FAFD] px-4 text-sm outline-none focus:border-[#075DFF]"
                  />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="密码"
                    className="h-12 w-full rounded-[16px] border border-[#07122F]/12 bg-[#F8FAFD] px-4 text-sm outline-none focus:border-[#075DFF]"
                  />
                  <button
                    disabled={isBusy}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#07122F] text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isBusy ? '处理中...' : '登录账户'}
                  </button>
                </form>
              )}
            </div>

            {isSignedIn && (
              <>
                <div className="rounded-[28px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">钱包概览</h2>
                    <button
                      onClick={() => loadPortal().catch(() => setError('钱包刷新失败。'))}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F7FB]"
                      aria-label="刷新钱包"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {[
                      ['可用余额', money(availableCents)],
                      ['总余额', portal ? money(portal.wallet.balance_cents) : '未登录'],
                      ['冻结额度', portal ? money(portal.wallet.reserved_cents) : money(0)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-[18px] bg-[#F4F7FB] px-4 py-3">
                        <span className="text-sm text-[#50617F]">{label}</span>
                        <span className="font-mono text-sm font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
                  <div className="mb-4 flex items-center gap-3">
                    <PlugZap className="h-5 w-5 text-[#075DFF]" />
                    <h2 className="text-2xl font-semibold">应用入口</h2>
                  </div>
                  <div className="space-y-3">
                    {(accountContext?.applications || []).map((application) => (
                      <a
                        key={application.client_id}
                        href={application.launch_url}
                        className="block rounded-[18px] bg-[#F4F7FB] p-4 transition hover:bg-[#EEF3FA]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold">{application.name}</div>
                            <div className="mt-1 text-xs text-[#50617F]">{application.login_method}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-[#075DFF]" />
                        </div>
                      </a>
                    ))}
                    {!accountContext && (
                      <div className="rounded-[18px] bg-[#F4F7FB] p-4 text-sm text-[#50617F]">
                        登录后显示 OPC、星伴、QuantAgent 的统一账号入口。
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </aside>

          <div className="space-y-8">
            {error && (
              <div className="rounded-[20px] border border-amber-500/20 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            )}

            {!isSignedIn ? (
              <section className="rounded-[30px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)] md:p-8">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#07122F] text-white">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight">未登录只展示计费体系说明</h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#50617F]">
                  钱包余额、充值下单、订单记录、消费账本、产品权益和应用入口都属于账号数据，必须登录统一账号中心后才显示。公开页面只说明 Billing Core 的作用和三款软件的接入边界。
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[
                    ['公开可见', '计费体系说明、软件接入原则、支付通道边界。'],
                    ['登录后可见', '钱包余额、充值、订阅、订单、账本、权益和应用入口。'],
                    ['软件侧职责', 'OPC、星伴、QuantAgent 只校验权益并提交用量扣费，不自行处理支付。'],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-[22px] border border-[#07122F]/10 bg-[#F4F7FB] p-5">
                      <div className="font-semibold">{title}</div>
                      <p className="mt-3 text-sm leading-6 text-[#50617F]">{text}</p>
                    </div>
                  ))}
                </div>
                <a href="#account-login" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#07122F] px-7 text-sm font-semibold text-white">
                  登录后进入钱包
                </a>
              </section>
            ) : (
              <>
            <section id="recharge" className="rounded-[30px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)] md:p-8">
              <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">充值与订阅</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#50617F]">
                    官网只负责创建订单和展示支付动作；真实收款由微信/支付宝/Stripe/对公转账适配器完成，支付成功后统一回写 Billing Core。
                  </p>
                </div>
                {pendingCheckout && (
                  <button
                    onClick={() => confirmManualPayment(pendingCheckout.order.order_no)}
                    disabled={isBusy}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#22D5F5] px-5 text-sm font-semibold text-[#07122F] disabled:opacity-60"
                  >
                    <Banknote className="h-4 w-4" />
                    模拟支付完成
                  </button>
                )}
              </div>

              {pendingCheckout && (
                <div className="mb-6 rounded-[22px] border border-[#075DFF]/16 bg-[#F4F7FB] p-5">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <div className="text-sm font-semibold text-[#075DFF]">{pendingCheckout.payment_action.label}</div>
                      <div className="mt-1 font-mono text-sm">{pendingCheckout.order.order_no}</div>
                      <p className="mt-2 text-sm leading-6 text-[#50617F]">{pendingCheckout.payment_action.instructions}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#50617F]">订单金额</div>
                      <div className="font-mono text-2xl font-semibold">{money(pendingCheckout.order.amount_cents)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 xl:grid-cols-3">
                {topUpPacks.map((pack) => (
                  <article key={pack.label} className="rounded-[24px] border border-[#07122F]/10 bg-[#F8FAFD] p-5">
                    <Wallet className="mb-5 h-6 w-6 text-[#075DFF]" />
                    <h3 className="text-xl font-semibold">{pack.label}</h3>
                    <div className="mt-2 font-mono text-3xl font-semibold">{money(pack.amount_cents)}</div>
                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#50617F]">{pack.helper}</p>
                    <button
                      disabled={!isSignedIn || isBusy}
                      onClick={() =>
                        createCheckout({
                          order_type: 'top_up',
                          product_code: 'rft_credits',
                          amount_cents: pack.amount_cents,
                          credit_amount_cents: pack.amount_cents,
                          meta_data: { source: 'website_top_up', label: pack.label },
                        })
                      }
                      className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#07122F] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      充值
                    </button>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {Object.entries(plansByProduct).map(([productCode, productPlans]) => (
                  <article key={productCode} className="rounded-[24px] border border-[#07122F]/10 p-5">
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-[#075DFF]">{productLabels[productCode] || productCode}</div>
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#50617F]">
                        {productDescriptions[productCode] || '统一套餐权益。'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {productPlans.map((plan) => (
                        <div key={plan.code} className="rounded-[18px] bg-[#F4F7FB] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold">{plan.name}</div>
                              <div className="mt-1 text-xs text-[#50617F]">含 {money(plan.included_credit_cents)} 通用额度</div>
                            </div>
                            <div className="font-mono text-lg font-semibold">{money(plan.price_cents)}</div>
                          </div>
                          <button
                            disabled={!isSignedIn || isBusy}
                            onClick={() =>
                              createCheckout({
                                order_type: 'subscription',
                                plan_code: plan.code,
                                meta_data: { source: 'website_subscription' },
                              })
                            }
                            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-[#07122F] ring-1 ring-[#07122F]/10 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            购买套餐
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[30px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
                <div className="mb-5 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#075DFF]" />
                  <h2 className="text-2xl font-semibold">产品权益</h2>
                </div>
                <div className="space-y-3">
                  {(portal?.entitlements || ['xingban', 'opc', 'quantagent'].map((code) => ({ product_code: code, can_access: false, reason: 'not_signed_in' }))).map((item) => (
                    <div key={item.product_code} className="rounded-[18px] bg-[#F4F7FB] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{productLabels[item.product_code] || item.product_code}</div>
                          <div className="mt-1 text-xs text-[#50617F]">{item.plan_code || item.reason}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.can_access ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {item.can_access ? '可访问' : '未开通'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
                <div className="mb-5 flex items-center gap-3">
                  <ReceiptText className="h-5 w-5 text-[#075DFF]" />
                  <h2 className="text-2xl font-semibold">最近消费账本</h2>
                </div>
                <div className="rounded-[18px] border border-[#07122F]/10 p-3">
                  <div className="space-y-2">
                    {(portal?.recent_ledger || []).slice(0, 8).map((entry) => (
                      <div key={entry.id} className="rounded-[14px] bg-[#F4F7FB] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold">{entry.direction}</div>
                            <div className="mt-1 break-words text-sm text-[#50617F]">{entry.reason}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="font-mono font-semibold">{money(entry.amount_cents)}</div>
                            <div className="mt-1 text-xs text-[#50617F]">{formatDate(entry.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!portal || portal.recent_ledger.length === 0) && (
                      <div className="px-4 py-10 text-center text-sm text-[#50617F]">
                        登录并完成充值后会显示每一次入账、冻结、扣费和释放。
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#07122F]/10 bg-white p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
              <div className="mb-5 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#075DFF]" />
                <h2 className="text-2xl font-semibold">订单与订阅</h2>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[18px] border border-[#07122F]/10 p-3">
                  <div className="space-y-2">
                    {(portal?.recent_orders || []).slice(0, 8).map((order) => (
                      <div key={order.id} className="rounded-[14px] bg-[#F4F7FB] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="break-all font-mono text-xs">{order.order_no}</div>
                            <div className="mt-1 text-xs text-[#50617F]">{productLabels[order.product_code || ''] || order.order_type}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-sm">{statusText(order.status)}</div>
                            <div className="mt-1 font-mono font-semibold">{money(order.amount_cents)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!portal || portal.recent_orders.length === 0) && (
                      <div className="px-4 py-10 text-center text-sm text-[#50617F]">暂无订单。</div>
                    )}
                  </div>
                </div>

                <div className="rounded-[18px] border border-[#07122F]/10 p-4">
                  <h3 className="mb-3 font-semibold">有效订阅</h3>
                  <div className="space-y-3">
                    {(portal?.subscriptions || []).map((subscription) => (
                      <div key={subscription.id} className="rounded-[16px] bg-[#F4F7FB] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold">{productLabels[subscription.product_code] || subscription.product_code}</div>
                            <div className="mt-1 text-xs text-[#50617F]">{subscription.plan_code}</div>
                          </div>
                          <div className="text-right text-xs text-[#50617F]">
                            <div>{statusText(subscription.status)}</div>
                            <div className="mt-1">{formatDate(subscription.current_period_end)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!portal || portal.subscriptions.length === 0) && (
                      <div className="rounded-[16px] bg-[#F4F7FB] p-6 text-center text-sm text-[#50617F]">暂无订阅。</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="software-access" className="bg-white py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-5xl font-semibold tracking-tight">三款软件如何接入</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#50617F]">
                软件不直接处理支付二维码、收款状态和账务报表；它们只问 Billing Core：是否有权益、是否能冻结额度、任务完成后扣多少。
              </p>
            </div>
            <Link to="/downloads" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#07122F] px-6 text-sm font-semibold text-white">
              下载中心
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {softwareContracts.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.product} className="rounded-[26px] border border-[#07122F]/10 bg-[#F4F7FB] p-6">
                  <Icon className="mb-6 h-7 w-7 text-[#075DFF]" />
                  <h3 className="text-2xl font-semibold">{item.product}</h3>
                  <div className="mt-6 space-y-4 text-sm leading-6 text-[#50617F]">
                    <p><span className="font-semibold text-[#07122F]">登录校验：</span>{item.check}</p>
                    <p><span className="font-semibold text-[#07122F]">用量扣费：</span>{item.usage}</p>
                    <p><span className="font-semibold text-[#07122F]">开通条件：</span>{item.entitlement}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[30px] bg-[#07122F] p-8 text-white md:p-10">
            <h3 className="text-2xl font-semibold">闭环顺序</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {['官网下单', '支付适配器回调', '钱包入账/订阅生效', '软件冻结额度', '任务完成扣费并生成账本'].map((step, index) => (
                <div key={step} className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#22D5F5] text-sm font-bold text-[#07122F]">
                    {index + 1}
                  </div>
                  <div className="text-sm font-semibold leading-6 text-[#DDF9FF]">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Billing;
