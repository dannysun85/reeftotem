from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import TokenPayload
from app.crud import user as crud_user
from app.crud import account as crud_account

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_token_payload(token: str = Depends(reusable_oauth2)) -> TokenPayload:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return token_data


def get_current_user(
    db: Session = Depends(get_db), token_data: TokenPayload = Depends(get_current_token_payload)
) -> User:
    if not token_data.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud_user.get_user(db, user_id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if token_data.sid:
        session = crud_account.get_account_session(db, token_data.sid)
        if not crud_account.is_account_session_active(session) or session.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account session is no longer active",
            )
        crud_account.touch_account_session(db, session)
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_superuser(
    current_user: User = Depends(get_current_active_user),
) -> User:
    # Use enum value or string check based on UserRole definition
    if str(current_user.role) != "UserRole.SUPER_ADMIN" and str(current_user.role) != "super_admin":
         # Check both role enum and is_superuser flag if exists (User model has role Enum)
         if str(current_user.role) != "UserRole.SUPER_ADMIN" and str(current_user.role) != "super_admin":
            raise HTTPException(
                status_code=400, detail="The user doesn't have enough privileges"
            )
    return current_user

def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    # Allow both admin and super_admin
    # UserRole is Enum, str() returns "UserRole.ADMIN" or value depending on implementation
    role = str(current_user.role)
    if role not in ["admin", "super_admin", "UserRole.ADMIN", "UserRole.SUPER_ADMIN"]:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user
