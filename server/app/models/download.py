import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum

class OSType(str, enum.Enum):
    WINDOWS = "windows"
    MAC = "mac"
    LINUX = "linux"
    IOS = "ios"
    ANDROID = "android"
    OTHER = "other"

class DownloadItem(Base):
    __tablename__ = "download_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=True)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=True) # Display name like "Windows x64"
    os_type: Mapped[OSType] = mapped_column(SAEnum(OSType), default=OSType.WINDOWS)
    category: Mapped[str] = mapped_column(String(50), default="other") # reeftotem, openclaw, quant, other
    
    package_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[str] = mapped_column(String(50), nullable=True) # Changed to string for display (e.g. "120 MB")
    changelog: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    
    download_count: Mapped[int] = mapped_column(Integer, default=0)
    is_latest: Mapped[bool] = mapped_column(Boolean, default=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    
    release_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="downloads")

    def __repr__(self):
        return f"<DownloadItem {self.name} v{self.version}>"
