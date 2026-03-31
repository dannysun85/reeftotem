from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.crud import product as crud_product
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
) -> Any:
    products = crud_product.get_products(db, skip=skip, limit=limit)
    return products

@router.post("/", response_model=ProductResponse, dependencies=[Depends(get_current_admin_user)])
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db)
) -> Any:
    product = crud_product.get_product_by_slug(db, slug=product_in.slug)
    if product:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    return crud_product.create_product(db, product_in)

@router.get("/{product_id}", response_model=ProductResponse)
def read_product(
    product_id: str,
    db: Session = Depends(get_db)
) -> Any:
    product = crud_product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(get_current_admin_user)])
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db)
) -> Any:
    product = crud_product.update_product(db, product_id, product_in)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}", dependencies=[Depends(get_current_admin_user)])
def delete_product(
    product_id: str,
    db: Session = Depends(get_db)
) -> Any:
    success = crud_product.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}
