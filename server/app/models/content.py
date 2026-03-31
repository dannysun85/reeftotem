import uuid
from sqlalchemy import String, Text, Boolean, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class SiteConfig(Base):
    __tablename__ = "site_config"

    key: Mapped[str] = mapped_column(String(100), primary_key=True, index=True)
    value: Mapped[dict] = mapped_column(JSON, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)

    def __repr__(self):
        return f"<SiteConfig {self.key}>"

class ContentItem(Base):
    __tablename__ = "content_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    type: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # e.g., 'feature', 'team', 'milestone', 'stat', 'social', 'faq'
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subtitle: Mapped[str] = mapped_column(String(255), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    meta_data: Mapped[dict] = mapped_column(JSON, nullable=True) # For specific fields like icon name, color class, external link
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self):
        return f"<ContentItem {self.type}:{self.title}>"
