from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.account import AccountSessionStatus
from app.schemas.user import UserResponse


class AccountSessionResponse(BaseModel):
    id: str
    user_id: str
    client_id: str
    device_label: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    status: AccountSessionStatus
    created_at: datetime
    last_seen_at: datetime
    expires_at: datetime
    revoked_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SsoApplication(BaseModel):
    client_id: str
    name: str
    product_code: str
    surface: str
    launch_url: str
    login_method: str
    token_storage: str
    entitlement_product_code: str
    billing_owner_type: str = "user"
    phase: str = "phase_1"
    notes: List[str]


class AccountContextResponse(BaseModel):
    account: UserResponse
    current_session: Optional[AccountSessionResponse] = None
    applications: List[SsoApplication]
    billing_owner: Dict[str, str]
    consistency_contract: Dict[str, str]


class LogoutResponse(BaseModel):
    revoked: bool
    session_id: Optional[str] = None
    reason: Optional[str] = None
