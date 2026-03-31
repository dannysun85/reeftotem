from fastapi import APIRouter
from app.api.v1.endpoints import auth, products, downloads, content, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(downloads.router, prefix="/downloads", tags=["downloads"])
api_router.include_router(content.router, prefix="/content", tags=["content"])

@api_router.get("/health")
def health_check():
    return {"status": "ok"}
