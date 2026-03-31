from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProductBase(BaseModel):
    slug: str
    name: str
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    icon_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    features: Optional[List[str]] = None
    is_published: Optional[bool] = True
    sort_order: Optional[int] = 0
    docs_url: Optional[str] = None
    docs_content: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    icon_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    features: Optional[List[str]] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None
    docs_url: Optional[str] = None
    docs_content: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    
    class Config:
        from_attributes = True
