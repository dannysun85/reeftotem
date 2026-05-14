import { create } from 'zustand';
import request from '@/api/request';

export type BillingAdminMetric = {
  key: string;
  label: string;
  value: number;
  unit: string;
  helper?: string;
  tone: 'neutral' | 'primary' | 'success' | 'warning' | 'info';
};

export type BillingSeriesPoint = {
  label: string;
  value: number;
  amount_cents?: number;
};

export type BillingBreakdownItem = {
  key: string;
  label: string;
  value: number;
  amount_cents?: number;
  percentage: number;
  tone: 'neutral' | 'primary' | 'success' | 'warning' | 'info';
};

export type BillingUserProfile = {
  user_id: string;
  email: string;
  name?: string;
  role: string;
  account_status: string;
  lifecycle_stage: string;
  risk_level: string;
  wallet_balance_cents: number;
  wallet_reserved_cents: number;
  active_subscriptions: number;
  total_paid_cents: number;
  order_count: number;
  last_order_status?: string | null;
  last_seen_at?: string | null;
  created_at: string;
  notes: string[];
};

export type BillingReport = {
  key: string;
  title: string;
  period: string;
  amount_cents: number;
  count: number;
  status: string;
  description: string;
};

export type BillingOrder = {
  id: string;
  order_no: string;
  owner_type: string;
  owner_id: string;
  product_code?: string | null;
  plan_code?: string | null;
  provider: string;
  order_type: string;
  status: string;
  currency: string;
  amount_cents: number;
  credit_amount_cents: number;
  created_at: string;
  paid_at?: string | null;
  updated_at: string;
};

export type BillingAdminDashboard = {
  generated_at: string;
  metrics: BillingAdminMetric[];
  revenue_series: BillingSeriesPoint[];
  order_status_breakdown: BillingBreakdownItem[];
  product_revenue: BillingBreakdownItem[];
  provider_mix: BillingBreakdownItem[];
  subscription_status: BillingBreakdownItem[];
  user_segments: BillingBreakdownItem[];
  user_profiles: BillingUserProfile[];
  reports: BillingReport[];
  recent_orders: BillingOrder[];
  data_quality: string[];
};

type BillingState = {
  dashboard: BillingAdminDashboard | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  markOrderPaid: (orderNo: string) => Promise<void>;
};

const fallbackDashboard: BillingAdminDashboard = {
  generated_at: new Date().toISOString(),
  metrics: [
    { key: 'revenue_30d', label: '近 30 天收入', value: 0, unit: 'cents', helper: '等待真实支付订单', tone: 'neutral' },
    { key: 'wallet_balance', label: '钱包可用余额', value: 0, unit: 'cents', helper: '冻结 0.00 CNY', tone: 'primary' },
    { key: 'active_subscriptions', label: '活跃订阅', value: 0, unit: 'count', helper: '套餐配置待接入', tone: 'info' },
    { key: 'active_users', label: '活跃用户', value: 0, unit: 'count', helper: '等待用户数据', tone: 'neutral' },
  ],
  revenue_series: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'].map((label) => ({
    label,
    value: 0,
    amount_cents: 0,
  })),
  order_status_breakdown: [],
  product_revenue: [],
  provider_mix: [],
  subscription_status: [],
  user_segments: [],
  user_profiles: [],
  reports: [
    {
      key: 'revenue',
      title: '收入日报 / 月报',
      period: '近 30 天',
      amount_cents: 0,
      count: 0,
      status: 'waiting_for_orders',
      description: '接入 checkout 和支付回调后自动生成。',
    },
    {
      key: 'user_lifecycle',
      title: '用户生命周期画像',
      period: '当前用户池',
      amount_cents: 0,
      count: 0,
      status: 'waiting_for_users',
      description: '根据注册、付费、订阅、余额和风险状态分层。',
    },
  ],
  recent_orders: [],
  data_quality: ['api_unavailable'],
};

export const useBillingStore = create<BillingState>((set) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: BillingAdminDashboard = await request.get('/billing/admin-dashboard');
      set({ dashboard: response, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch billing dashboard';
      set({
        dashboard: fallbackDashboard,
        isLoading: false,
        error: message,
      });
    }
  },

  markOrderPaid: async (orderNo: string) => {
    set({ isLoading: true, error: null });
    try {
      await request.post(`/billing/orders/${orderNo}/mark-paid`, {
        provider_order_id: `admin-${orderNo}`,
        meta_data: { source: 'admin_billing_center' },
      });
      const response: BillingAdminDashboard = await request.get('/billing/admin-dashboard');
      set({ dashboard: response, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark order paid';
      set((state) => ({
        dashboard: state.dashboard || fallbackDashboard,
        isLoading: false,
        error: message,
      }));
    }
  },
}));
