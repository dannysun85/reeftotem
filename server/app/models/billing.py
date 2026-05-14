import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class BillingCycle(str, enum.Enum):
    FREE = "free"
    MONTH = "month"
    YEAR = "year"
    USAGE = "usage"
    CUSTOM = "custom"


class PaymentProvider(str, enum.Enum):
    STRIPE = "stripe"
    WECHAT_PAY = "wechat_pay"
    ALIPAY = "alipay"
    BANK_TRANSFER = "bank_transfer"
    MANUAL = "manual"


class OrderType(str, enum.Enum):
    SUBSCRIPTION = "subscription"
    TOP_UP = "top_up"
    MANUAL_ADJUSTMENT = "manual_adjustment"


class OrderStatus(str, enum.Enum):
    CREATED = "created"
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELED = "canceled"


class SubscriptionStatus(str, enum.Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    EXPIRED = "expired"


class LedgerDirection(str, enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"
    RESERVE = "reserve"
    RELEASE = "release"
    EXPIRE = "expire"
    ADJUST = "adjust"


class UsageReservationStatus(str, enum.Enum):
    RESERVED = "reserved"
    COMMITTED = "committed"
    RELEASED = "released"
    EXPIRED = "expired"


class BillingProduct(Base):
    __tablename__ = "billing_products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    plans = relationship("BillingPlan", back_populates="product", cascade="all, delete-orphan")


class BillingPlan(Base):
    __tablename__ = "billing_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_code: Mapped[str] = mapped_column(String(64), ForeignKey("billing_products.code"), nullable=False)
    code: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    cycle: Mapped[BillingCycle] = mapped_column(SAEnum(BillingCycle), default=BillingCycle.MONTH)
    currency: Mapped[str] = mapped_column(String(3), default="CNY")
    price_cents: Mapped[int] = mapped_column(Integer, default=0)
    included_credit_cents: Mapped[int] = mapped_column(Integer, default=0)
    seat_limit: Mapped[int] = mapped_column(Integer, default=1)
    features: Mapped[list] = mapped_column(JSON, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("BillingProduct", back_populates="plans")


class CreditWallet(Base):
    __tablename__ = "credit_wallets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="CNY")
    balance_cents: Mapped[int] = mapped_column(Integer, default=0)
    reserved_cents: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    entries = relationship("CreditLedgerEntry", back_populates="wallet", cascade="all, delete-orphan")


class CreditLedgerEntry(Base):
    __tablename__ = "credit_ledger_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    wallet_id: Mapped[str] = mapped_column(String(36), ForeignKey("credit_wallets.id"), nullable=False)
    direction: Mapped[LedgerDirection] = mapped_column(SAEnum(LedgerDirection), nullable=False)
    reason: Mapped[str] = mapped_column(String(128), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    balance_after_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    source_provider: Mapped[str] = mapped_column(String(64), nullable=True)
    source_id: Mapped[str] = mapped_column(String(128), nullable=True)
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, nullable=True)
    meta_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    wallet = relationship("CreditWallet", back_populates="entries")


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_no: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    owner_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    product_code: Mapped[str] = mapped_column(String(64), nullable=True)
    plan_code: Mapped[str] = mapped_column(String(128), nullable=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    provider_order_id: Mapped[str] = mapped_column(String(255), nullable=True)
    order_type: Mapped[OrderType] = mapped_column(SAEnum(OrderType), nullable=False)
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.CREATED)
    currency: Mapped[str] = mapped_column(String(3), default="CNY")
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    credit_amount_cents: Mapped[int] = mapped_column(Integer, default=0)
    meta_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    paid_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BillingSubscription(Base):
    __tablename__ = "billing_subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    product_code: Mapped[str] = mapped_column(String(64), nullable=False)
    plan_code: Mapped[str] = mapped_column(String(128), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(SAEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    provider_subscription_id: Mapped[str] = mapped_column(String(255), nullable=True)
    seats: Mapped[int] = mapped_column(Integer, default=1)
    current_period_start: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    current_period_end: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UsageReservation(Base):
    __tablename__ = "usage_reservations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    wallet_id: Mapped[str] = mapped_column(String(36), ForeignKey("credit_wallets.id"), nullable=False)
    product_code: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    usage_key: Mapped[str] = mapped_column(String(128), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[UsageReservationStatus] = mapped_column(
        SAEnum(UsageReservationStatus),
        default=UsageReservationStatus.RESERVED,
    )
    source_id: Mapped[str] = mapped_column(String(128), nullable=True)
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, nullable=True)
    meta_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
