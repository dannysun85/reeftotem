from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.billing import (
    BillingCycle,
    BillingPlan,
    BillingProduct,
    BillingSubscription,
    CreditLedgerEntry,
    CreditWallet,
    LedgerDirection,
    OrderStatus,
    OrderType,
    PaymentOrder,
    PaymentProvider,
    SubscriptionStatus,
    UsageReservation,
    UsageReservationStatus,
)
from app.models.user import User
from app.schemas.billing import BillingCheckoutCreate, BillingPlanCreate, BillingPlanUpdate, BillingProductCreate


DEFAULT_PUBLIC_PLANS = [
    {
        "id": "default_xingban_pro_month",
        "product_code": "xingban",
        "code": "xingban_pro_month",
        "name": "星伴 Pro 月付",
        "cycle": "month",
        "currency": "CNY",
        "price_cents": 4900,
        "included_credit_cents": 3000,
        "seat_limit": 1,
        "features": ["桌面 AI 入口", "基础云模型额度", "长期记忆", "轻量自动化"],
        "is_public": True,
        "is_active": True,
        "sort_order": 10,
        "created_at": "2026-05-14T00:00:00",
        "updated_at": "2026-05-14T00:00:00",
    },
    {
        "id": "default_xingban_max_month",
        "product_code": "xingban",
        "code": "xingban_max_month",
        "name": "星伴 Max 月付",
        "cycle": "month",
        "currency": "CNY",
        "price_cents": 9900,
        "included_credit_cents": 8000,
        "seat_limit": 1,
        "features": ["更多模型额度", "长上下文", "语音与任务自动化", "优先更新"],
        "is_public": True,
        "is_active": True,
        "sort_order": 20,
        "created_at": "2026-05-14T00:00:00",
        "updated_at": "2026-05-14T00:00:00",
    },
    {
        "id": "default_opc_pro_month",
        "product_code": "opc",
        "code": "opc_pro_month",
        "name": "OPC Pro 月付",
        "cycle": "month",
        "currency": "CNY",
        "price_cents": 129900,
        "included_credit_cents": 50000,
        "seat_limit": 10,
        "features": ["企业工作区", "AI 公司运营链路", "基础审计", "团队共享额度"],
        "is_public": True,
        "is_active": True,
        "sort_order": 30,
        "created_at": "2026-05-14T00:00:00",
        "updated_at": "2026-05-14T00:00:00",
    },
    {
        "id": "default_quantagent_research_month",
        "product_code": "quantagent",
        "code": "quantagent_research_month",
        "name": "QuantAgent Research 月付",
        "cycle": "month",
        "currency": "CNY",
        "price_cents": 29900,
        "included_credit_cents": 12000,
        "seat_limit": 1,
        "features": ["策略 Alpha 深研", "证据报告", "有限回测额度", "告警内测"],
        "is_public": True,
        "is_active": True,
        "sort_order": 40,
        "created_at": "2026-05-14T00:00:00",
        "updated_at": "2026-05-14T00:00:00",
    },
]


def get_billing_product(db: Session, code: str) -> Optional[BillingProduct]:
    return db.query(BillingProduct).filter(BillingProduct.code == code).first()


def get_billing_products(db: Session, active_only: bool = True) -> List[BillingProduct]:
    query = db.query(BillingProduct)
    if active_only:
        query = query.filter(BillingProduct.is_active.is_(True))
    return query.order_by(BillingProduct.code.asc()).all()


def create_billing_product(db: Session, product: BillingProductCreate) -> BillingProduct:
    db_product = BillingProduct(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_billing_plan(db: Session, code: str) -> Optional[BillingPlan]:
    return db.query(BillingPlan).filter(BillingPlan.code == code).first()


def get_default_plan(code: str) -> Optional[dict]:
    return next((plan for plan in DEFAULT_PUBLIC_PLANS if plan["code"] == code), None)


def get_plan_snapshot(db: Session, code: str) -> Optional[dict]:
    plan = get_billing_plan(db, code)
    if plan:
        return {
            "product_code": plan.product_code,
            "code": plan.code,
            "name": plan.name,
            "cycle": _enum_value(plan.cycle),
            "currency": plan.currency,
            "price_cents": plan.price_cents,
            "included_credit_cents": plan.included_credit_cents,
            "seat_limit": plan.seat_limit,
            "features": plan.features or [],
        }
    return get_default_plan(code)


def get_billing_plans(
    db: Session,
    product_code: Optional[str] = None,
    public_only: bool = True,
    active_only: bool = True,
) -> List[BillingPlan]:
    query = db.query(BillingPlan)
    if product_code:
        query = query.filter(BillingPlan.product_code == product_code)
    if public_only:
        query = query.filter(BillingPlan.is_public.is_(True))
    if active_only:
        query = query.filter(BillingPlan.is_active.is_(True))
    return query.order_by(BillingPlan.product_code.asc(), BillingPlan.sort_order.asc()).all()


def create_billing_plan(db: Session, plan: BillingPlanCreate) -> BillingPlan:
    db_plan = BillingPlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_billing_plan(db: Session, code: str, plan: BillingPlanUpdate) -> Optional[BillingPlan]:
    db_plan = get_billing_plan(db, code)
    if not db_plan:
        return None
    for key, value in plan.model_dump(exclude_unset=True).items():
        setattr(db_plan, key, value)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_wallet(db: Session, owner_type: str, owner_id: str) -> Optional[CreditWallet]:
    return (
        db.query(CreditWallet)
        .filter(CreditWallet.owner_type == owner_type, CreditWallet.owner_id == owner_id)
        .first()
    )


def ensure_wallet(db: Session, owner_type: str, owner_id: str, currency: str = "CNY") -> CreditWallet:
    wallet = get_wallet(db, owner_type, owner_id)
    if wallet:
        return wallet
    wallet = CreditWallet(owner_type=owner_type, owner_id=owner_id, currency=currency, balance_cents=0, reserved_cents=0)
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return wallet


def get_ledger_entries(db: Session, wallet_id: str, limit: int = 100) -> List[CreditLedgerEntry]:
    return (
        db.query(CreditLedgerEntry)
        .filter(CreditLedgerEntry.wallet_id == wallet_id)
        .order_by(CreditLedgerEntry.created_at.desc())
        .limit(limit)
        .all()
    )


def get_orders(db: Session, owner_type: Optional[str] = None, owner_id: Optional[str] = None, limit: int = 100) -> List[PaymentOrder]:
    query = db.query(PaymentOrder)
    if owner_type:
        query = query.filter(PaymentOrder.owner_type == owner_type)
    if owner_id:
        query = query.filter(PaymentOrder.owner_id == owner_id)
    return query.order_by(PaymentOrder.created_at.desc()).limit(limit).all()


def get_order_by_no(db: Session, order_no: str) -> Optional[PaymentOrder]:
    return db.query(PaymentOrder).filter(PaymentOrder.order_no == order_no).first()


def get_subscriptions(db: Session, owner_type: str, owner_id: str) -> List[BillingSubscription]:
    return (
        db.query(BillingSubscription)
        .filter(BillingSubscription.owner_type == owner_type, BillingSubscription.owner_id == owner_id)
        .order_by(BillingSubscription.updated_at.desc())
        .all()
    )


def _enum_value(value: object) -> str:
    return getattr(value, "value", str(value))


def _month_key(dt: datetime) -> str:
    return f"{dt.year}-{dt.month:02d}"


def _recent_month_keys(now: datetime, months: int = 6) -> List[str]:
    keys: List[str] = []
    year = now.year
    month = now.month
    for _ in range(months):
        keys.append(f"{year}-{month:02d}")
        month -= 1
        if month == 0:
            month = 12
            year -= 1
    return list(reversed(keys))


def _percentage(value: int, total: int) -> float:
    if total <= 0:
        return 0
    return round((value / total) * 100, 1)


def _new_order_no() -> str:
    return f"RFT{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"


def _period_end(now: datetime, cycle: str) -> Optional[datetime]:
    if cycle == BillingCycle.MONTH.value:
        return now + timedelta(days=30)
    if cycle == BillingCycle.YEAR.value:
        return now + timedelta(days=365)
    return None


def _add_ledger_entry(
    db: Session,
    wallet: CreditWallet,
    direction: LedgerDirection,
    reason: str,
    amount_cents: int,
    balance_after_cents: int,
    source_provider: Optional[str] = None,
    source_id: Optional[str] = None,
    idempotency_key: Optional[str] = None,
    meta_data: Optional[dict] = None,
) -> CreditLedgerEntry:
    if idempotency_key:
        existing = (
            db.query(CreditLedgerEntry)
            .filter(CreditLedgerEntry.idempotency_key == idempotency_key)
            .first()
        )
        if existing:
            return existing
    entry = CreditLedgerEntry(
        wallet_id=wallet.id,
        direction=direction,
        reason=reason,
        amount_cents=amount_cents,
        balance_after_cents=balance_after_cents,
        source_provider=source_provider,
        source_id=source_id,
        idempotency_key=idempotency_key,
        meta_data=meta_data,
    )
    db.add(entry)
    return entry


def create_checkout_order(
    db: Session,
    owner_type: str,
    owner_id: str,
    checkout: BillingCheckoutCreate,
) -> PaymentOrder:
    order_type = checkout.order_type
    product_code = checkout.product_code
    plan_code = checkout.plan_code
    amount_cents = checkout.amount_cents or 0
    credit_amount_cents = checkout.credit_amount_cents or 0
    meta_data = checkout.meta_data or {}

    if order_type == OrderType.SUBSCRIPTION:
        if not plan_code:
            raise ValueError("plan_code is required for subscription checkout")
        plan = get_plan_snapshot(db, plan_code)
        if not plan:
            raise ValueError("billing plan does not exist")
        product_code = plan["product_code"]
        amount_cents = int(plan["price_cents"])
        credit_amount_cents = int(plan["included_credit_cents"])
        meta_data = {**meta_data, "plan_snapshot": plan}
    elif order_type == OrderType.TOP_UP:
        if amount_cents <= 0:
            raise ValueError("amount_cents must be greater than zero for top-up")
        if credit_amount_cents <= 0:
            credit_amount_cents = amount_cents
        product_code = product_code or "rft_credits"
    else:
        if amount_cents <= 0:
            raise ValueError("amount_cents must be greater than zero")

    order = PaymentOrder(
        order_no=_new_order_no(),
        owner_type=owner_type,
        owner_id=owner_id,
        product_code=product_code,
        plan_code=plan_code,
        provider=checkout.provider,
        order_type=order_type,
        status=OrderStatus.CREATED,
        currency="CNY",
        amount_cents=amount_cents,
        credit_amount_cents=credit_amount_cents,
        meta_data=meta_data,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def _upsert_subscription_from_order(db: Session, order: PaymentOrder, paid_at: datetime) -> Optional[BillingSubscription]:
    if order.order_type != OrderType.SUBSCRIPTION or not order.product_code or not order.plan_code:
        return None
    plan = get_plan_snapshot(db, order.plan_code)
    cycle = str(plan["cycle"]) if plan else BillingCycle.MONTH.value
    subscription = (
        db.query(BillingSubscription)
        .filter(
            BillingSubscription.owner_type == order.owner_type,
            BillingSubscription.owner_id == order.owner_id,
            BillingSubscription.product_code == order.product_code,
        )
        .first()
    )
    if not subscription:
        subscription = BillingSubscription(
            owner_type=order.owner_type,
            owner_id=order.owner_id,
            product_code=order.product_code,
            plan_code=order.plan_code,
            provider=order.provider,
        )
    subscription.plan_code = order.plan_code
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.provider = order.provider
    subscription.provider_subscription_id = order.provider_order_id
    subscription.seats = int(plan["seat_limit"]) if plan else 1
    subscription.current_period_start = paid_at
    subscription.current_period_end = _period_end(paid_at, cycle)
    db.add(subscription)
    return subscription


def mark_order_paid(
    db: Session,
    order_no: str,
    provider_order_id: Optional[str] = None,
    idempotency_key: Optional[str] = None,
    meta_data: Optional[dict] = None,
) -> PaymentOrder:
    order = get_order_by_no(db, order_no)
    if not order:
        raise ValueError("payment order not found")
    if order.status == OrderStatus.PAID:
        return order
    if order.status in [OrderStatus.CANCELED, OrderStatus.REFUNDED]:
        raise ValueError("payment order cannot be paid from its current status")

    now = datetime.utcnow()
    order.status = OrderStatus.PAID
    order.provider_order_id = provider_order_id or order.provider_order_id or order.order_no
    order.paid_at = now
    order.meta_data = {**(order.meta_data or {}), **(meta_data or {})}

    wallet = ensure_wallet(db, order.owner_type, order.owner_id, order.currency)
    if order.credit_amount_cents > 0:
        wallet.balance_cents += order.credit_amount_cents
        _add_ledger_entry(
            db,
            wallet,
            LedgerDirection.CREDIT,
            "payment_order_paid",
            order.credit_amount_cents,
            wallet.balance_cents,
            source_provider=_enum_value(order.provider),
            source_id=order.order_no,
            idempotency_key=idempotency_key or f"payment:{order.order_no}",
            meta_data={"order_type": _enum_value(order.order_type), "product_code": order.product_code},
        )

    _upsert_subscription_from_order(db, order, now)
    db.add(wallet)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_entitlements(db: Session, owner_type: str, owner_id: str) -> List[dict]:
    now = datetime.utcnow()
    subscriptions = get_subscriptions(db, owner_type, owner_id)
    active_by_product = {}
    for subscription in subscriptions:
        is_active = subscription.status == SubscriptionStatus.ACTIVE and (
            subscription.current_period_end is None or subscription.current_period_end >= now
        )
        if is_active:
            active_by_product[subscription.product_code] = subscription

    wallet = get_wallet(db, owner_type, owner_id)
    wallet_has_balance = bool(wallet and (wallet.balance_cents - wallet.reserved_cents) > 0)
    products = ["xingban", "opc", "quantagent"]
    entitlements = []
    for product_code in products:
        subscription = active_by_product.get(product_code)
        can_access = subscription is not None or wallet_has_balance
        reason = "active_subscription" if subscription else "wallet_balance" if wallet_has_balance else "no_subscription_or_balance"
        entitlements.append(
            {
                "product_code": product_code,
                "can_access": can_access,
                "reason": reason,
                "plan_code": subscription.plan_code if subscription else None,
                "subscription_status": _enum_value(subscription.status) if subscription else None,
                "current_period_end": subscription.current_period_end if subscription else None,
                "seat_limit": subscription.seats if subscription else 0,
            }
        )
    return entitlements


def reserve_usage(
    db: Session,
    owner_type: str,
    owner_id: str,
    product_code: str,
    usage_key: str,
    amount_cents: int,
    source_id: Optional[str] = None,
    idempotency_key: Optional[str] = None,
    meta_data: Optional[dict] = None,
) -> UsageReservation:
    if amount_cents <= 0:
        raise ValueError("amount_cents must be greater than zero")
    if idempotency_key:
        existing = db.query(UsageReservation).filter(UsageReservation.idempotency_key == idempotency_key).first()
        if existing:
            return existing
    wallet = ensure_wallet(db, owner_type, owner_id)
    available = wallet.balance_cents - wallet.reserved_cents
    if available < amount_cents:
        raise ValueError("insufficient wallet balance")

    wallet.reserved_cents += amount_cents
    reservation_id = str(uuid.uuid4())
    reservation = UsageReservation(
        id=reservation_id,
        owner_type=owner_type,
        owner_id=owner_id,
        wallet_id=wallet.id,
        product_code=product_code,
        usage_key=usage_key,
        amount_cents=amount_cents,
        status=UsageReservationStatus.RESERVED,
        source_id=source_id,
        idempotency_key=idempotency_key,
        meta_data=meta_data,
    )
    _add_ledger_entry(
        db,
        wallet,
        LedgerDirection.RESERVE,
        usage_key,
        amount_cents,
        wallet.balance_cents,
        source_provider="usage",
        source_id=source_id,
        idempotency_key=f"reserve:{reservation_id}",
        meta_data={"product_code": product_code, **(meta_data or {})},
    )
    db.add(wallet)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def commit_usage(
    db: Session,
    reservation_id: str,
    amount_cents: Optional[int] = None,
    idempotency_key: Optional[str] = None,
    meta_data: Optional[dict] = None,
) -> UsageReservation:
    reservation = db.query(UsageReservation).filter(UsageReservation.id == reservation_id).first()
    if not reservation:
        raise ValueError("usage reservation not found")
    if reservation.status == UsageReservationStatus.COMMITTED:
        return reservation
    if reservation.status != UsageReservationStatus.RESERVED:
        raise ValueError("usage reservation is not reserved")
    debit_amount = amount_cents or reservation.amount_cents
    if debit_amount <= 0 or debit_amount > reservation.amount_cents:
        raise ValueError("invalid commit amount")
    wallet = db.query(CreditWallet).filter(CreditWallet.id == reservation.wallet_id).first()
    if not wallet:
        raise ValueError("credit wallet not found")

    release_amount = reservation.amount_cents - debit_amount
    wallet.reserved_cents = max(wallet.reserved_cents - reservation.amount_cents, 0)
    wallet.balance_cents -= debit_amount
    reservation.status = UsageReservationStatus.COMMITTED
    reservation.amount_cents = debit_amount
    reservation.meta_data = {**(reservation.meta_data or {}), **(meta_data or {})}

    _add_ledger_entry(
        db,
        wallet,
        LedgerDirection.DEBIT,
        reservation.usage_key,
        debit_amount,
        wallet.balance_cents,
        source_provider="usage",
        source_id=reservation.source_id or reservation.id,
        idempotency_key=idempotency_key or f"commit:{reservation.id}",
        meta_data={"product_code": reservation.product_code, "released_cents": release_amount, **(meta_data or {})},
    )
    db.add(wallet)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def release_usage(
    db: Session,
    reservation_id: str,
    idempotency_key: Optional[str] = None,
    meta_data: Optional[dict] = None,
) -> UsageReservation:
    reservation = db.query(UsageReservation).filter(UsageReservation.id == reservation_id).first()
    if not reservation:
        raise ValueError("usage reservation not found")
    if reservation.status == UsageReservationStatus.RELEASED:
        return reservation
    if reservation.status != UsageReservationStatus.RESERVED:
        raise ValueError("usage reservation is not reserved")
    wallet = db.query(CreditWallet).filter(CreditWallet.id == reservation.wallet_id).first()
    if not wallet:
        raise ValueError("credit wallet not found")
    wallet.reserved_cents = max(wallet.reserved_cents - reservation.amount_cents, 0)
    reservation.status = UsageReservationStatus.RELEASED
    reservation.meta_data = {**(reservation.meta_data or {}), **(meta_data or {})}
    _add_ledger_entry(
        db,
        wallet,
        LedgerDirection.RELEASE,
        reservation.usage_key,
        reservation.amount_cents,
        wallet.balance_cents,
        source_provider="usage",
        source_id=reservation.source_id or reservation.id,
        idempotency_key=idempotency_key or f"release:{reservation.id}",
        meta_data={"product_code": reservation.product_code, **(meta_data or {})},
    )
    db.add(wallet)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def _user_lifecycle_stage(
    user: User,
    active_subscriptions: int,
    total_paid_cents: int,
    wallet: Optional[CreditWallet],
    last_order: Optional[PaymentOrder],
) -> str:
    if not user.is_active:
        return "suspended"
    if active_subscriptions > 0:
        return "subscriber"
    if total_paid_cents > 0:
        return "payer"
    if wallet and wallet.balance_cents > 0:
        return "trial_with_balance"
    if last_order:
        return "checkout_started"
    return "registered"


def _user_risk_level(
    user: User,
    active_subscriptions: int,
    total_paid_cents: int,
    wallet: Optional[CreditWallet],
) -> str:
    if not user.is_active:
        return "blocked"
    if active_subscriptions > 0:
        return "healthy"
    if total_paid_cents > 0 and (not wallet or wallet.balance_cents < 1000):
        return "attention"
    if not wallet or wallet.balance_cents <= 0:
        return "new"
    return "watch"


def get_billing_admin_dashboard(db: Session) -> Dict[str, object]:
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)

    orders = db.query(PaymentOrder).order_by(PaymentOrder.created_at.desc()).limit(5000).all()
    paid_orders = [order for order in orders if order.status == OrderStatus.PAID]
    paid_orders_30d = [order for order in paid_orders if order.paid_at and order.paid_at >= thirty_days_ago]

    total_revenue_cents = sum(order.amount_cents for order in paid_orders)
    revenue_30d_cents = sum(order.amount_cents for order in paid_orders_30d)
    paid_order_count_30d = len(paid_orders_30d)

    wallet_balance_cents = int(db.query(func.coalesce(func.sum(CreditWallet.balance_cents), 0)).scalar() or 0)
    wallet_reserved_cents = int(db.query(func.coalesce(func.sum(CreditWallet.reserved_cents), 0)).scalar() or 0)
    active_subscription_count = (
        db.query(BillingSubscription).filter(BillingSubscription.status == SubscriptionStatus.ACTIVE).count()
    )
    user_count = db.query(User).count()
    active_user_count = db.query(User).filter(User.is_active.is_(True)).count()
    plan_count = db.query(BillingPlan).count()

    metrics = [
        {
            "key": "revenue_30d",
            "label": "近 30 天收入",
            "value": revenue_30d_cents,
            "unit": "cents",
            "helper": f"{paid_order_count_30d} 笔已支付订单",
            "tone": "success" if revenue_30d_cents > 0 else "neutral",
        },
        {
            "key": "wallet_balance",
            "label": "钱包可用余额",
            "value": wallet_balance_cents,
            "unit": "cents",
            "helper": f"冻结 {wallet_reserved_cents / 100:.2f} CNY",
            "tone": "primary",
        },
        {
            "key": "active_subscriptions",
            "label": "活跃订阅",
            "value": active_subscription_count,
            "unit": "count",
            "helper": f"{plan_count} 个套餐配置",
            "tone": "info",
        },
        {
            "key": "active_users",
            "label": "活跃用户",
            "value": active_user_count,
            "unit": "count",
            "helper": f"总用户 {user_count}",
            "tone": "neutral",
        },
    ]

    month_keys = _recent_month_keys(now, months=6)
    revenue_by_month = {key: 0 for key in month_keys}
    for order in paid_orders:
        if not order.paid_at:
            continue
        key = _month_key(order.paid_at)
        if key in revenue_by_month:
            revenue_by_month[key] += order.amount_cents
    revenue_series = [
        {"label": key, "value": amount, "amount_cents": amount} for key, amount in revenue_by_month.items()
    ]

    status_counts: Dict[str, int] = defaultdict(int)
    for order in orders:
        status_counts[_enum_value(order.status)] += 1
    total_order_count = len(orders)
    order_status_breakdown = [
        {
            "key": key,
            "label": key,
            "value": value,
            "percentage": _percentage(value, total_order_count),
            "tone": "success" if key == "paid" else "warning" if key in ["pending", "created"] else "neutral",
        }
        for key, value in sorted(status_counts.items())
    ]

    product_revenue_map: Dict[str, int] = defaultdict(int)
    provider_counts: Dict[str, int] = defaultdict(int)
    for order in paid_orders:
        product_revenue_map[order.product_code or "top_up"] += order.amount_cents
        provider_counts[_enum_value(order.provider)] += 1
    total_provider_count = sum(provider_counts.values())
    product_revenue = [
        {
            "key": key,
            "label": key,
            "value": amount,
            "amount_cents": amount,
            "percentage": _percentage(amount, total_revenue_cents),
            "tone": "primary",
        }
        for key, amount in sorted(product_revenue_map.items(), key=lambda item: item[1], reverse=True)
    ]
    provider_mix = [
        {
            "key": key,
            "label": key,
            "value": value,
            "percentage": _percentage(value, total_provider_count),
            "tone": "neutral",
        }
        for key, value in sorted(provider_counts.items(), key=lambda item: item[1], reverse=True)
    ]

    subscription_counts: Dict[str, int] = defaultdict(int)
    for subscription in db.query(BillingSubscription).all():
        subscription_counts[_enum_value(subscription.status)] += 1
    total_subscription_count = sum(subscription_counts.values())
    subscription_status = [
        {
            "key": key,
            "label": key,
            "value": value,
            "percentage": _percentage(value, total_subscription_count),
            "tone": "success" if key == "active" else "warning",
        }
        for key, value in sorted(subscription_counts.items())
    ]

    users = db.query(User).order_by(User.created_at.desc()).limit(24).all()
    wallets = {
        wallet.owner_id: wallet
        for wallet in db.query(CreditWallet).filter(CreditWallet.owner_type == "user").all()
    }
    subscriptions_by_owner: Dict[str, List[BillingSubscription]] = defaultdict(list)
    for subscription in db.query(BillingSubscription).filter(BillingSubscription.owner_type == "user").all():
        subscriptions_by_owner[subscription.owner_id].append(subscription)

    orders_by_owner: Dict[str, List[PaymentOrder]] = defaultdict(list)
    for order in orders:
        if order.owner_type == "user":
            orders_by_owner[order.owner_id].append(order)

    user_profiles = []
    segment_counts: Dict[str, int] = defaultdict(int)
    for user in users:
        owner_orders = orders_by_owner.get(user.id, [])
        owner_paid_orders = [order for order in owner_orders if order.status == OrderStatus.PAID]
        total_paid_cents = sum(order.amount_cents for order in owner_paid_orders)
        active_subscriptions = sum(
            1
            for subscription in subscriptions_by_owner.get(user.id, [])
            if subscription.status == SubscriptionStatus.ACTIVE
        )
        wallet = wallets.get(user.id)
        last_order = owner_orders[0] if owner_orders else None
        lifecycle_stage = _user_lifecycle_stage(user, active_subscriptions, total_paid_cents, wallet, last_order)
        risk_level = _user_risk_level(user, active_subscriptions, total_paid_cents, wallet)
        notes = []
        if risk_level in ["attention", "watch"]:
            notes.append("余额或订阅状态需要运营跟进")
        if last_order and last_order.status in [OrderStatus.CREATED, OrderStatus.PENDING]:
            notes.append("存在未完成支付订单")
        if not notes:
            notes.append("暂无异常")
        segment_counts[lifecycle_stage] += 1
        user_profiles.append(
            {
                "user_id": user.id,
                "email": user.email,
                "name": user.full_name,
                "role": _enum_value(user.role),
                "account_status": "active" if user.is_active else "inactive",
                "lifecycle_stage": lifecycle_stage,
                "risk_level": risk_level,
                "wallet_balance_cents": wallet.balance_cents if wallet else 0,
                "wallet_reserved_cents": wallet.reserved_cents if wallet else 0,
                "active_subscriptions": active_subscriptions,
                "total_paid_cents": total_paid_cents,
                "order_count": len(owner_orders),
                "last_order_status": _enum_value(last_order.status) if last_order else None,
                "last_seen_at": user.last_login,
                "created_at": user.created_at,
                "notes": notes,
            }
        )

    total_segment_count = sum(segment_counts.values())
    user_segments = [
        {
            "key": key,
            "label": key,
            "value": value,
            "percentage": _percentage(value, total_segment_count),
            "tone": "success" if key == "subscriber" else "warning" if key == "checkout_started" else "neutral",
        }
        for key, value in sorted(segment_counts.items(), key=lambda item: item[1], reverse=True)
    ]

    data_quality = []
    if not orders:
        data_quality.append("payment_orders_empty")
    if not paid_orders:
        data_quality.append("paid_orders_empty")
    if not user_profiles:
        data_quality.append("users_empty")

    reports = [
        {
            "key": "revenue",
            "title": "收入日报 / 月报",
            "period": "近 30 天",
            "amount_cents": revenue_30d_cents,
            "count": paid_order_count_30d,
            "status": "ready" if paid_orders else "waiting_for_orders",
            "description": "按支付完成时间汇总收入，后续可导出 CSV / PDF。",
        },
        {
            "key": "liability",
            "title": "预收与余额负债",
            "period": "当前余额",
            "amount_cents": wallet_balance_cents + wallet_reserved_cents,
            "count": db.query(CreditWallet).count(),
            "status": "ready",
            "description": "钱包余额是未来服务交付负债，需要和积分消耗账本一起审计。",
        },
        {
            "key": "user_lifecycle",
            "title": "用户生命周期画像",
            "period": "当前用户池",
            "amount_cents": 0,
            "count": len(user_profiles),
            "status": "ready" if user_profiles else "waiting_for_users",
            "description": "按注册、发起支付、付费、订阅、停用等阶段管理用户状态。",
        },
        {
            "key": "subscription_health",
            "title": "订阅健康报表",
            "period": "当前订阅",
            "amount_cents": 0,
            "count": total_subscription_count,
            "status": "ready" if total_subscription_count else "waiting_for_subscriptions",
            "description": "跟踪 active、past_due、expired、canceled，后续接自动续费和催付。",
        },
    ]

    return {
        "generated_at": now,
        "metrics": metrics,
        "revenue_series": revenue_series,
        "order_status_breakdown": order_status_breakdown,
        "product_revenue": product_revenue,
        "provider_mix": provider_mix,
        "subscription_status": subscription_status,
        "user_segments": user_segments,
        "user_profiles": user_profiles,
        "reports": reports,
        "recent_orders": orders[:12],
        "data_quality": data_quality,
    }
