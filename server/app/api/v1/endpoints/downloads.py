from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.download import DownloadItemCreate, DownloadItemUpdate, DownloadItemResponse
from app.crud import download as crud_download
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[DownloadItemResponse])
def read_downloads(
    skip: int = 0, 
    limit: int = 100, 
    product_id: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    downloads = crud_download.get_downloads(db, skip=skip, limit=limit, product_id=product_id)
    return downloads

@router.post("/", response_model=DownloadItemResponse, dependencies=[Depends(get_current_admin_user)])
def create_download(
    download_in: DownloadItemCreate,
    db: Session = Depends(get_db)
) -> Any:
    return crud_download.create_download(db, download_in)

@router.get("/{download_id}", response_model=DownloadItemResponse)
def read_download(
    download_id: str,
    db: Session = Depends(get_db)
) -> Any:
    download = crud_download.get_download(db, download_id)
    if not download:
        raise HTTPException(status_code=404, detail="Download item not found")
    return download

@router.put("/{download_id}", response_model=DownloadItemResponse, dependencies=[Depends(get_current_admin_user)])
def update_download(
    download_id: str,
    download_in: DownloadItemUpdate,
    db: Session = Depends(get_db)
) -> Any:
    download = crud_download.update_download(db, download_id, download_in)
    if not download:
        raise HTTPException(status_code=404, detail="Download item not found")
    return download

@router.delete("/{download_id}", dependencies=[Depends(get_current_admin_user)])
def delete_download(
    download_id: str,
    db: Session = Depends(get_db)
) -> Any:
    success = crud_download.delete_download(db, download_id)
    if not success:
        raise HTTPException(status_code=404, detail="Download item not found")
    return {"status": "success"}

@router.post("/{download_id}/count", response_model=DownloadItemResponse)
def increment_count(
    download_id: str,
    db: Session = Depends(get_db)
) -> Any:
    download = crud_download.increment_download_count(db, download_id)
    if not download:
        raise HTTPException(status_code=404, detail="Download item not found")
    return download
