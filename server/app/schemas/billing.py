from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.billing import (
    BillingCycle,
    LedgerDirection,
    OrderStatus,
    OrderType,
    PaymentProvider,
    SubscriptionStatus,
    UsageReservationStatus,
)


class BillingProductBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    is_active: bool = True


class BillingProductCreate(BillingProductBase):
    pass


class BillingProductResponse(BillingProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BillingPlanBase(BaseModel):
    product_code: str
    code: str
    name: str
    cycle: BillingCycle = BillingCycle.MONTH
    currency: str = "CNY"
    price_cents: int = 0
    included_credit_cents: int = 0
    seat_limit: int = 1
    features: Optional[List[str]] = None
    is_public: bool = True
    is_active: bool = True
    sort_order: int = 0


class BillingPlanCreate(BillingPlanBase):
    pass


class BillingPlanUpdate(BaseModel):
    name: Optional[str] = None
    cycle: Optional[BillingCycle] = None
    currency: Optional[str] = None
    price_cents: Optional[int] = None
    included_credit_cents: Optional[int] = None
    seat_limit: Optional[int] = None
    features: Optional[List[str]] = None
    is_public: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class BillingPlanResponse(BillingPlanBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreditWalletResponse(BaseModel):
    id: str
    owner_type: str
    owner_id: str
    currency: str
    balance_cents: int
    reserved_cents: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreditLedgerEntryResponse(BaseModel):
    id: str
    wallet_id: str
    direction: LedgerDirection
    reason: str
    amount_cents: int
    balance_after_cents: int
    source_provider: Optional[str] = None
    source_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaymentOrderResponse(BaseModel):
    id: str
    order_no: str
    owner_type: str
    owner_id: str
    product_code: Optional[str] = None
    plan_code: Optional[str] = None
    provider: PaymentProvider
    provider_order_id: Optional[str] = None
    order_type: OrderType
    status: OrderStatus
    currency: str
    amount_cents: int
    credit_amount_cents: int
    meta_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    paid_at: Optional[datetime] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BillingSubscriptionResponse(BaseModel):
    id: str
    owner_type: str
    owner_id: str
    product_code: str
    plan_code: str
    status: SubscriptionStatus
    provider: PaymentProvider
    provider_subscription_id: Optional[str] = None
    seats: int
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UsageReservationResponse(BaseModel):
    id: str
    owner_type: str
    owner_id: str
    wallet_id: str
    product_code: str
    usage_key: str
    amount_cents: int
    status: UsageReservationStatus
    source_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaymentAction(BaseModel):
    kind: str
    label: str
    provider: PaymentProvider
    checkout_url: Optional[str] = None
    qr_code_url: Optional[str] = None
    instructions: Optional[str] = None


class BillingCheckoutCreate(BaseModel):
    order_type: OrderType
    provider: PaymentProvider = PaymentProvider.MANUAL
    product_code: Optional[str] = None
    plan_code: Optional[str] = None
    amount_cents: Optional[int] = None
    credit_amount_cents: Optional[int] = None
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None


class BillingCheckoutResponse(BaseModel):
    order: PaymentOrderResponse
    payment_action: PaymentAction


class PaymentConfirmRequest(BaseModel):
    provider_order_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None


class EntitlementProduct(BaseModel):
    product_code: str
    can_access: bool
    reason: str
    plan_code: Optional[str] = None
    subscription_status: Optional[str] = None
    current_period_end: Optional[datetime] = None
    seat_limit: int = 0


class BillingPortalResponse(BaseModel):
    wallet: CreditWalletResponse
    entitlements: List[EntitlementProduct]
    subscriptions: List[BillingSubscriptionResponse]
    recent_orders: List[PaymentOrderResponse]
    recent_ledger: List[CreditLedgerEntryResponse]


class UsageReserveRequest(BaseModel):
    product_code: str
    usage_key: str
    amount_cents: int
    source_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None


class UsageCommitRequest(BaseModel):
    reservation_id: str
    amount_cents: Optional[int] = None
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None


class UsageReleaseRequest(BaseModel):
    reservation_id: str
    idempotency_key: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None


class ServiceUsageReserveRequest(UsageReserveRequest):
    owner_type: str = "user"
    owner_id: str


class PaymentRouteOption(BaseModel):
    provider: PaymentProvider
    label: str
    regions: List[str]
    supports_one_time: bool
    supports_subscription: bool
    supports_refund: bool
    settlement: str
    recommended_for: str
    limitation: str


class PaymentRouteMatrix(BaseModel):
    default_domestic_provider: PaymentProvider
    default_global_provider: PaymentProvider
    domestic_note: str
    global_note: str
    options: List[PaymentRouteOption]


class BillingAdminMetric(BaseModel):
    key: str
    label: str
    value: int
    unit: str = ""
    helper: Optional[str] = None
    tone: str = "neutral"


class BillingAdminSeriesPoint(BaseModel):
    label: str
    value: int
    amount_cents: Optional[int] = None


class BillingAdminBreakdownItem(BaseModel):
    key: str
    label: str
    value: int
    amount_cents: Optional[int] = None
    percentage: float = 0
    tone: str = "neutral"


class BillingAdminUserProfile(BaseModel):
    user_id: str
    email: str
    name: Optional[str] = None
    role: str
    account_status: str
    lifecycle_stage: str
    risk_level: str
    wallet_balance_cents: int
    wallet_reserved_cents: int
    active_subscriptions: int
    total_paid_cents: int
    order_count: int
    last_order_status: Optional[str] = None
    last_seen_at: Optional[datetime] = None
    created_at: datetime
    notes: List[str] = Field(default_factory=list)


class BillingAdminReport(BaseModel):
    key: str
    title: str
    period: str
    amount_cents: int = 0
    count: int = 0
    status: str
    description: str


class BillingAdminDashboardResponse(BaseModel):
    generated_at: datetime
    metrics: List[BillingAdminMetric]
    revenue_series: List[BillingAdminSeriesPoint]
    order_status_breakdown: List[BillingAdminBreakdownItem]
    product_revenue: List[BillingAdminBreakdownItem]
    provider_mix: List[BillingAdminBreakdownItem]
    subscription_status: List[BillingAdminBreakdownItem]
    user_segments: List[BillingAdminBreakdownItem]
    user_profiles: List[BillingAdminUserProfile]
    reports: List[BillingAdminReport]
    recent_orders: List[PaymentOrderResponse]
    data_quality: List[str]
