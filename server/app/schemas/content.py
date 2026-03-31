from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

# SiteConfig schemas
class SiteConfigBase(BaseModel):
    key: str
    value: Dict[str, Any]
    description: Optional[str] = None

class SiteConfigCreate(SiteConfigBase):
    pass

class SiteConfigUpdate(BaseModel):
    value: Optional[Dict[str, Any]] = None
    description: Optional[str] = None

class SiteConfig(SiteConfigBase):
    model_config = ConfigDict(from_attributes=True)


# ContentItem schemas
class ContentItemBase(BaseModel):
    type: str
    title: str
    subtitle: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True

class ContentItemCreate(ContentItemBase):
    pass

class ContentItemUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class ContentItem(ContentItemBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
