from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
from enum import Enum

class OSType(str, Enum):
    WINDOWS = "windows"
    MAC = "mac"
    LINUX = "linux"
    IOS = "ios"
    ANDROID = "android"
    OTHER = "other"

class DownloadItemBase(BaseModel):
    product_id: Optional[str] = None
    name: str
    version: str
    platform: Optional[str] = None
    os_type: OSType = OSType.WINDOWS
    category: Optional[str] = "other"
    package_url: str
    file_size: Optional[str] = None
    changelog: Optional[str] = None
    description: Optional[str] = None
    is_latest: Optional[bool] = False
    is_visible: Optional[bool] = True
    release_date: Optional[datetime] = None

class DownloadItemCreate(DownloadItemBase):
    pass

class DownloadItemUpdate(BaseModel):
    product_id: Optional[str] = None
    name: Optional[str] = None
    version: Optional[str] = None
    platform: Optional[str] = None
    os_type: Optional[OSType] = None
    category: Optional[str] = None
    package_url: Optional[str] = None
    file_size: Optional[str] = None
    changelog: Optional[str] = None
    description: Optional[str] = None
    is_latest: Optional[bool] = None
    is_visible: Optional[bool] = None
    release_date: Optional[datetime] = None

class DownloadItemResponse(DownloadItemBase):
    id: str
    download_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
