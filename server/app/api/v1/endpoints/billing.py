from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_current_admin_user
from app.core.database import get_db
from app.crud import billing as crud_billing
from app.models.billing import PaymentProvider, UsageReservation
from app.models.user import User
from app.schemas.billing import (
    BillingCheckoutCreate,
    BillingCheckoutResponse,
    BillingPortalResponse,
    BillingPlanCreate,
    BillingPlanResponse,
    BillingPlanUpdate,
    BillingAdminDashboardResponse,
    BillingProductCreate,
    BillingProductResponse,
    BillingSubscriptionResponse,
    CreditLedgerEntryResponse,
    CreditWalletResponse,
    PaymentAction,
    PaymentConfirmRequest,
    PaymentOrderResponse,
    PaymentRouteMatrix,
    PaymentRouteOption,
    ServiceUsageReserveRequest,
    UsageCommitRequest,
    UsageReleaseRequest,
    UsageReservationResponse,
    UsageReserveRequest,
)

router = APIRouter()


def _owner_id(user: User) -> str:
    return str(user.id)


def _payment_action(order) -> PaymentAction:
    if order.provider == PaymentProvider.MANUAL:
        return PaymentAction(
            kind="mock_payment",
            label="开发 / 手动确认",
            provider=order.provider,
            instructions="当前订单已创建。开发环境可直接模拟支付完成；生产环境由后台或支付回调确认入账。",
        )
    if order.provider == PaymentProvider.BANK_TRANSFER:
        return PaymentAction(
            kind="bank_transfer",
            label="对公转账",
            provider=order.provider,
            instructions="客户完成对公付款后，运营后台在计费中心确认入账并开通权益。",
        )
    if order.provider in [PaymentProvider.WECHAT_PAY, PaymentProvider.ALIPAY]:
        return PaymentAction(
            kind="domestic_gateway_pending",
            label="微信 / 支付宝支付",
            provider=order.provider,
            instructions="订单已进入统一计费中心。生产环境在这里对接微信支付或支付宝预下单接口并返回二维码/跳转链接。",
        )
    return PaymentAction(
        kind="stripe_pending",
        label="Stripe Checkout",
        provider=order.provider,
        instructions="订单已进入统一计费中心。生产环境在这里创建 Stripe Checkout Session。",
    )


def _build_portal_response(db: Session, owner_type: str, owner_id: str) -> dict:
    wallet = crud_billing.ensure_wallet(db, owner_type, owner_id)
    return {
        "wallet": wallet,
        "entitlements": crud_billing.get_entitlements(db, owner_type, owner_id),
        "subscriptions": crud_billing.get_subscriptions(db, owner_type, owner_id),
        "recent_orders": crud_billing.get_orders(db, owner_type, owner_id, limit=20),
        "recent_ledger": crud_billing.get_ledger_entries(db, wallet.id, limit=50),
    }


@router.get("/payment-routes", response_model=PaymentRouteMatrix)
def read_payment_routes() -> Any:
    return PaymentRouteMatrix(
        default_domestic_provider=PaymentProvider.WECHAT_PAY,
        default_global_provider=PaymentProvider.STRIPE,
        domestic_note="中国大陆主体优先直连微信支付和支付宝；Stripe 可作为境外主体/海外客户通道。",
        global_note="Stripe 可覆盖银行卡和部分本地钱包，但 WeChat Pay 不适合订阅自动续费，Alipay 订阅需要额外审批。",
        options=[
            PaymentRouteOption(
                provider=PaymentProvider.WECHAT_PAY,
                label="微信支付直连",
                regions=["CN"],
                supports_one_time=True,
                supports_subscription=False,
                supports_refund=True,
                settlement="按微信支付商户平台规则结算",
                recommended_for="国内个人充值包、星伴购买、OPC 小额预付费",
                limitation="自动续费能力需要另行开通委托代扣类产品，第一期不作为默认订阅通道。",
            ),
            PaymentRouteOption(
                provider=PaymentProvider.ALIPAY,
                label="支付宝直连",
                regions=["CN"],
                supports_one_time=True,
                supports_subscription=False,
                supports_refund=True,
                settlement="按支付宝商户平台规则结算",
                recommended_for="国内 Web 订单、充值包、企业预付款",
                limitation="周期扣款要走独立签约能力，第一期以一次性支付和人工续费为主。",
            ),
            PaymentRouteOption(
                provider=PaymentProvider.STRIPE,
                label="Stripe",
                regions=["HK", "SG", "US", "EU", "GLOBAL"],
                supports_one_time=True,
                supports_subscription=True,
                supports_refund=True,
                settlement="按 Stripe 账号国家/地区结算",
                recommended_for="海外银行卡、海外客户订阅、未来香港/新加坡主体",
                limitation="中国大陆主体不能直接作为 Stripe 账号地区；WeChat Pay 不能用于订阅模式，Alipay 订阅需要审批。",
            ),
            PaymentRouteOption(
                provider=PaymentProvider.BANK_TRANSFER,
                label="对公转账",
                regions=["CN", "GLOBAL"],
                supports_one_time=True,
                supports_subscription=False,
                supports_refund=False,
                settlement="财务确认后后台开通权益",
                recommended_for="OPC 企业合同、QuantAgent 机构版、私有化部署",
                limitation="需要人工审核、开票和到账确认，不适合即时个人购买。",
            ),
        ],
    )


@router.get("/plans", response_model=List[BillingPlanResponse])
def read_billing_plans(
    product_code: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    plans = crud_billing.get_billing_plans(db, product_code=product_code)
    if plans:
        return plans
    if product_code:
        return [plan for plan in crud_billing.DEFAULT_PUBLIC_PLANS if plan["product_code"] == product_code]
    return crud_billing.DEFAULT_PUBLIC_PLANS


@router.post("/checkout", response_model=BillingCheckoutResponse)
def create_checkout(
    checkout_in: BillingCheckoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    try:
        order = crud_billing.create_checkout_order(db, "user", _owner_id(current_user), checkout_in)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"order": order, "payment_action": _payment_action(order)}


@router.get("/me/portal", response_model=BillingPortalResponse)
def read_my_billing_portal(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return _build_portal_response(db, "user", _owner_id(current_user))


@router.get("/me/orders", response_model=List[PaymentOrderResponse])
def read_my_orders(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return crud_billing.get_orders(db, "user", _owner_id(current_user), limit=limit)


@router.get("/me/ledger", response_model=List[CreditLedgerEntryResponse])
def read_my_ledger(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    wallet = crud_billing.ensure_wallet(db, "user", _owner_id(current_user))
    return crud_billing.get_ledger_entries(db, wallet.id, limit=limit)


@router.get("/me/subscriptions", response_model=List[BillingSubscriptionResponse])
def read_my_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return crud_billing.get_subscriptions(db, "user", _owner_id(current_user))


@router.get("/me/entitlements")
def read_my_entitlements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return crud_billing.get_entitlements(db, "user", _owner_id(current_user))


@router.post("/me/orders/{order_no}/mock-pay", response_model=PaymentOrderResponse)
def mock_pay_my_order(
    order_no: str,
    payment_in: PaymentConfirmRequest = PaymentConfirmRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    order = crud_billing.get_order_by_no(db, order_no)
    if not order or order.owner_type != "user" or order.owner_id != _owner_id(current_user):
        raise HTTPException(status_code=404, detail="Payment order not found")
    if order.provider != PaymentProvider.MANUAL:
        raise HTTPException(status_code=400, detail="Only manual development orders can be mocked")
    try:
        return crud_billing.mark_order_paid(
            db,
            order_no,
            provider_order_id=payment_in.provider_order_id,
            idempotency_key=payment_in.idempotency_key,
            meta_data={**(payment_in.meta_data or {}), "mock_confirmed_by": _owner_id(current_user)},
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/me/usage/reserve", response_model=UsageReservationResponse)
def reserve_my_usage(
    usage_in: UsageReserveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    try:
        return crud_billing.reserve_usage(
            db,
            "user",
            _owner_id(current_user),
            usage_in.product_code,
            usage_in.usage_key,
            usage_in.amount_cents,
            source_id=usage_in.source_id,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/me/usage/commit", response_model=UsageReservationResponse)
def commit_my_usage(
    usage_in: UsageCommitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    reservation = db.query(UsageReservation).filter(UsageReservation.id == usage_in.reservation_id).first()
    if not reservation or reservation.owner_type != "user" or reservation.owner_id != _owner_id(current_user):
        raise HTTPException(status_code=404, detail="Usage reservation not found")
    try:
        return crud_billing.commit_usage(
            db,
            usage_in.reservation_id,
            amount_cents=usage_in.amount_cents,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/me/usage/release", response_model=UsageReservationResponse)
def release_my_usage(
    usage_in: UsageReleaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    reservation = db.query(UsageReservation).filter(UsageReservation.id == usage_in.reservation_id).first()
    if not reservation or reservation.owner_type != "user" or reservation.owner_id != _owner_id(current_user):
        raise HTTPException(status_code=404, detail="Usage reservation not found")
    try:
        return crud_billing.release_usage(
            db,
            usage_in.reservation_id,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get(
    "/admin-dashboard",
    response_model=BillingAdminDashboardResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def read_billing_admin_dashboard(db: Session = Depends(get_db)) -> Any:
    return crud_billing.get_billing_admin_dashboard(db)


@router.post(
    "/orders/{order_no}/mark-paid",
    response_model=PaymentOrderResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def mark_payment_order_paid(
    order_no: str,
    payment_in: PaymentConfirmRequest = PaymentConfirmRequest(),
    db: Session = Depends(get_db),
) -> Any:
    try:
        return crud_billing.mark_order_paid(
            db,
            order_no,
            provider_order_id=payment_in.provider_order_id,
            idempotency_key=payment_in.idempotency_key,
            meta_data={**(payment_in.meta_data or {}), "confirmed_by": "admin"},
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/usage/reserve",
    response_model=UsageReservationResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def reserve_service_usage(
    usage_in: ServiceUsageReserveRequest,
    db: Session = Depends(get_db),
) -> Any:
    try:
        return crud_billing.reserve_usage(
            db,
            usage_in.owner_type,
            usage_in.owner_id,
            usage_in.product_code,
            usage_in.usage_key,
            usage_in.amount_cents,
            source_id=usage_in.source_id,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/usage/commit",
    response_model=UsageReservationResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def commit_service_usage(
    usage_in: UsageCommitRequest,
    db: Session = Depends(get_db),
) -> Any:
    try:
        return crud_billing.commit_usage(
            db,
            usage_in.reservation_id,
            amount_cents=usage_in.amount_cents,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/usage/release",
    response_model=UsageReservationResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def release_service_usage(
    usage_in: UsageReleaseRequest,
    db: Session = Depends(get_db),
) -> Any:
    try:
        return crud_billing.release_usage(
            db,
            usage_in.reservation_id,
            idempotency_key=usage_in.idempotency_key,
            meta_data=usage_in.meta_data,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/products", response_model=BillingProductResponse, dependencies=[Depends(get_current_admin_user)])
def create_billing_product(product_in: BillingProductCreate, db: Session = Depends(get_db)) -> Any:
    existing = crud_billing.get_billing_product(db, product_in.code)
    if existing:
        raise HTTPException(status_code=400, detail="Billing product with this code already exists")
    return crud_billing.create_billing_product(db, product_in)


@router.post("/plans", response_model=BillingPlanResponse, dependencies=[Depends(get_current_admin_user)])
def create_billing_plan(plan_in: BillingPlanCreate, db: Session = Depends(get_db)) -> Any:
    existing = crud_billing.get_billing_plan(db, plan_in.code)
    if existing:
        raise HTTPException(status_code=400, detail="Billing plan with this code already exists")
    product = crud_billing.get_billing_product(db, plan_in.product_code)
    if not product:
        raise HTTPException(status_code=400, detail="Billing product does not exist")
    return crud_billing.create_billing_plan(db, plan_in)


@router.put("/plans/{plan_code}", response_model=BillingPlanResponse, dependencies=[Depends(get_current_admin_user)])
def update_billing_plan(plan_code: str, plan_in: BillingPlanUpdate, db: Session = Depends(get_db)) -> Any:
    plan = crud_billing.update_billing_plan(db, plan_code, plan_in)
    if not plan:
        raise HTTPException(status_code=404, detail="Billing plan not found")
    return plan


@router.get("/wallets/{owner_type}/{owner_id}", response_model=CreditWalletResponse, dependencies=[Depends(get_current_admin_user)])
def read_wallet(owner_type: str, owner_id: str, db: Session = Depends(get_db)) -> Any:
    wallet = crud_billing.get_wallet(db, owner_type, owner_id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Credit wallet not found")
    return wallet


@router.get("/wallets/{wallet_id}/ledger", response_model=List[CreditLedgerEntryResponse], dependencies=[Depends(get_current_admin_user)])
def read_wallet_ledger(wallet_id: str, limit: int = 100, db: Session = Depends(get_db)) -> Any:
    return crud_billing.get_ledger_entries(db, wallet_id, limit=limit)
