from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.account import AccountSession, AccountSessionStatus
from app.schemas.account import SsoApplication


SSO_APPLICATIONS = [
    SsoApplication(
        client_id="website",
        name="ReefTotem 官网账户钱包",
        product_code="website",
        surface="web",
        launch_url="https://reeftotem.ai/billing",
        login_method="authorization_code_pkce_web",
        token_storage="http_only_cookie_or_short_lived_bearer",
        entitlement_product_code="rft_credits",
        notes=[
            "官网是账户门户和充值入口，不是其他应用的 token 分发器。",
            "官网读取 Billing Core 的个人钱包、订单、账本和权益。",
        ],
    ),
    SsoApplication(
        client_id="opc",
        name="OPC 企业平台",
        product_code="opc",
        surface="web",
        launch_url="https://opc.reeftotem.ai/login",
        login_method="authorization_code_pkce_web",
        token_storage="http_only_session_cookie",
        entitlement_product_code="opc",
        notes=[
            "第一阶段按 user owner 接入；第二阶段升级 organization owner。",
            "进入工作区前必须读取 Billing entitlement，不由 OPC 自己判断付费状态。",
        ],
    ),
    SsoApplication(
        client_id="xingban",
        name="星伴 Assistant",
        product_code="xingban",
        surface="desktop",
        launch_url="reeftotem-xingban://auth",
        login_method="system_browser_pkce_or_device_code",
        token_storage="macos_keychain",
        entitlement_product_code="xingban",
        notes=[
            "桌面端不得长期把 access token 放在普通文件或 localStorage。",
            "云模型任务前 reserve，成功 commit，失败 release。",
        ],
    ),
    SsoApplication(
        client_id="quantagent",
        name="QuantAgent",
        product_code="quantagent",
        surface="web_desktop_cli",
        launch_url="https://quantagent.reeftotem.ai/login",
        login_method="authorization_code_pkce_or_device_code",
        token_storage="http_only_cookie_or_os_keychain",
        entitlement_product_code="quantagent",
        notes=[
            "研究、回测、证据报告、告警任务必须按任务级 reservation 扣费。",
            "第一阶段按个人账号；机构版进入第二阶段 organization owner。",
        ],
    ),
]


def get_sso_applications() -> List[SsoApplication]:
    return SSO_APPLICATIONS


def get_account_session(db: Session, session_id: str) -> Optional[AccountSession]:
    return db.query(AccountSession).filter(AccountSession.id == session_id).first()


def create_account_session(
    db: Session,
    user_id: str,
    client_id: str,
    expires_at: datetime,
    device_label: Optional[str] = None,
    user_agent: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> AccountSession:
    session = AccountSession(
        user_id=user_id,
        client_id=client_id or "website",
        device_label=device_label,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=expires_at,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def is_account_session_active(session: Optional[AccountSession]) -> bool:
    if not session:
        return False
    if session.status != AccountSessionStatus.ACTIVE:
        return False
    return session.expires_at >= datetime.utcnow()


def touch_account_session(db: Session, session: AccountSession) -> AccountSession:
    if session.expires_at < datetime.utcnow() and session.status == AccountSessionStatus.ACTIVE:
        session.status = AccountSessionStatus.EXPIRED
    session.last_seen_at = datetime.utcnow()
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def revoke_account_session(db: Session, session_id: str, user_id: Optional[str] = None) -> Optional[AccountSession]:
    session = get_account_session(db, session_id)
    if not session:
        return None
    if user_id and session.user_id != user_id:
        return None
    session.status = AccountSessionStatus.REVOKED
    session.revoked_at = datetime.utcnow()
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def list_account_sessions(db: Session, user_id: str, active_only: bool = True) -> List[AccountSession]:
    query = db.query(AccountSession).filter(AccountSession.user_id == user_id)
    if active_only:
        query = query.filter(AccountSession.status == AccountSessionStatus.ACTIVE)
    return query.order_by(AccountSession.last_seen_at.desc()).all()
