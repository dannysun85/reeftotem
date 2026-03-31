from sqlalchemy.orm import Session
from app.models.download import DownloadItem
from app.schemas.download import DownloadItemCreate, DownloadItemUpdate
from typing import List, Optional

def get_download(db: Session, download_id: str) -> Optional[DownloadItem]:
    return db.query(DownloadItem).filter(DownloadItem.id == download_id).first()

def get_downloads(db: Session, skip: int = 0, limit: int = 100, product_id: Optional[str] = None) -> List[DownloadItem]:
    query = db.query(DownloadItem)
    if product_id:
        query = query.filter(DownloadItem.product_id == product_id)
    return query.offset(skip).limit(limit).all()

def create_download(db: Session, download: DownloadItemCreate) -> DownloadItem:
    db_download = DownloadItem(**download.model_dump())
    db.add(db_download)
    db.commit()
    db.refresh(db_download)
    return db_download

def update_download(db: Session, download_id: str, download: DownloadItemUpdate) -> Optional[DownloadItem]:
    db_download = get_download(db, download_id)
    if not db_download:
        return None
    
    update_data = download.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_download, key, value)
    
    db.add(db_download)
    db.commit()
    db.refresh(db_download)
    return db_download

def delete_download(db: Session, download_id: str) -> bool:
    db_download = get_download(db, download_id)
    if not db_download:
        return False
    
    db.delete(db_download)
    db.commit()
    return True

def increment_download_count(db: Session, download_id: str) -> Optional[DownloadItem]:
    db_download = get_download(db, download_id)
    if not db_download:
        return None
    
    db_download.download_count += 1
    db.add(db_download)
    db.commit()
    db.refresh(db_download)
    return db_download
