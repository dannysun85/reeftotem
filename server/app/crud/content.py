from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.content import SiteConfig, ContentItem
from app.schemas.content import SiteConfigCreate, SiteConfigUpdate, ContentItemCreate, ContentItemUpdate

# Site Config CRUD
def get_config(db: Session, key: str) -> Optional[SiteConfig]:
    return db.query(SiteConfig).filter(SiteConfig.key == key).first()

def get_all_configs(db: Session) -> List[SiteConfig]:
    return db.query(SiteConfig).all()

def create_config(db: Session, config: SiteConfigCreate) -> SiteConfig:
    db_config = SiteConfig(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

from sqlalchemy.orm.attributes import flag_modified
import logging

logger = logging.getLogger(__name__)

def update_config(db: Session, key: str, config: SiteConfigUpdate) -> Optional[SiteConfig]:
    db_config = get_config(db, key)
    if not db_config:
        return None
    
    update_data = config.model_dump(exclude_unset=True)
    logger.info(f"Updating config {key} with data: {update_data}")

    for field, value in update_data.items():
        setattr(db_config, field, value)
        if field == "value":
            flag_modified(db_config, "value") # Force SQLAlchemy to see the change
    
    try:
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        logger.info(f"Config {key} updated successfully")
        return db_config
    except Exception as e:
        logger.error(f"Error updating config {key}: {e}")
        db.rollback()
        raise e

# Content Item CRUD
def get_content_item(db: Session, item_id: str) -> Optional[ContentItem]:
    return db.query(ContentItem).filter(ContentItem.id == item_id).first()

def get_content_items(
    db: Session, 
    type: Optional[str] = None, 
    is_active: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0
) -> List[ContentItem]:
    query = db.query(ContentItem)
    if type:
        query = query.filter(ContentItem.type == type)
    if is_active is not None:
        query = query.filter(ContentItem.is_active == is_active)
    
    return query.order_by(ContentItem.sort_order).limit(limit).offset(offset).all()

def create_content_item(db: Session, item: ContentItemCreate) -> ContentItem:
    db_item = ContentItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_content_item(db: Session, item_id: str, item: ContentItemUpdate) -> Optional[ContentItem]:
    db_item = get_content_item(db, item_id)
    if not db_item:
        return None
    
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
        
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_content_item(db: Session, item_id: str) -> bool:
    db_item = get_content_item(db, item_id)
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True
