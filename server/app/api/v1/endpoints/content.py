from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.content import (
    get_config, get_all_configs, create_config, update_config,
    get_content_item, get_content_items, create_content_item, 
    update_content_item, delete_content_item
)
from app.schemas.content import (
    SiteConfig, SiteConfigCreate, SiteConfigUpdate,
    ContentItem, ContentItemCreate, ContentItemUpdate
)
from app.api.deps import get_current_active_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

# --- Public Endpoints ---

@router.get("/config/{key}", response_model=SiteConfig)
def read_config(key: str, db: Session = Depends(get_db)):
    """Get site configuration by key"""
    config = get_config(db, key)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config

@router.get("/config", response_model=List[SiteConfig])
def read_all_configs(db: Session = Depends(get_db)):
    """Get all site configurations"""
    return get_all_configs(db)

@router.get("/items", response_model=List[ContentItem])
def read_content_items(
    type: Optional[str] = Query(None, description="Filter by content type"),
    is_active: Optional[bool] = Query(True, description="Filter by active status"),
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get content items (features, team members, etc.)"""
    return get_content_items(db, type=type, is_active=is_active, limit=limit, offset=offset)

@router.get("/items/{item_id}", response_model=ContentItem)
def read_content_item(item_id: str, db: Session = Depends(get_db)):
    """Get specific content item"""
    item = get_content_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    return item


# --- Admin Only Endpoints ---

@router.post("/config", response_model=SiteConfig, dependencies=[Depends(get_current_admin_user)])
def create_site_config(config: SiteConfigCreate, db: Session = Depends(get_db)):
    """Create new site configuration (Admin only)"""
    existing = get_config(db, config.key)
    if existing:
        raise HTTPException(status_code=400, detail="Configuration key already exists")
    return create_config(db, config)

@router.put("/config/{key}", response_model=SiteConfig, dependencies=[Depends(get_current_admin_user)])
def update_site_config(key: str, config: SiteConfigUpdate, db: Session = Depends(get_db)):
    """Update site configuration (Admin only)"""
    updated_config = update_config(db, key, config)
    if not updated_config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return updated_config

@router.post("/items", response_model=ContentItem, dependencies=[Depends(get_current_admin_user)])
def create_item(item: ContentItemCreate, db: Session = Depends(get_db)):
    """Create new content item (Admin only)"""
    return create_content_item(db, item)

@router.put("/items/{item_id}", response_model=ContentItem, dependencies=[Depends(get_current_admin_user)])
def update_item(item_id: str, item: ContentItemUpdate, db: Session = Depends(get_db)):
    """Update content item (Admin only)"""
    updated_item = update_content_item(db, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Content item not found")
    return updated_item

@router.delete("/items/{item_id}", response_model=dict, dependencies=[Depends(get_current_admin_user)])
def delete_item(item_id: str, db: Session = Depends(get_db)):
    """Delete content item (Admin only)"""
    success = delete_content_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"message": "Content item deleted successfully"}
