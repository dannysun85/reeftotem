import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AccountSessionStatus(str, enum.Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"


class AccountSession(Base):
    __tablename__ = "account_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    client_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False, default="website")
    device_label: Mapped[str] = mapped_column(String(255), nullable=True)
    user_agent: Mapped[str] = mapped_column(String(512), nullable=True)
    ip_address: Mapped[str] = mapped_column(String(64), nullable=True)
    status: Mapped[AccountSessionStatus] = mapped_column(
        SAEnum(AccountSessionStatus),
        default=AccountSessionStatus.ACTIVE,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
