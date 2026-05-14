from datetime import datetime, timedelta
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.api.deps import get_current_active_user, get_current_token_payload
from app.crud import account as crud_account
from app.crud import user as crud_user
from app.models.user import User
from app.schemas.account import AccountContextResponse, AccountSessionResponse, LogoutResponse, SsoApplication
from app.schemas.token import Token
from app.schemas.token import TokenPayload

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    request: Request,
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.utcnow() + access_token_expires
    client_id = getattr(form_data, "client_id", None) or "website"
    session = crud_account.create_account_session(
        db,
        user_id=user.id,
        client_id=client_id,
        expires_at=expires_at,
        device_label=client_id,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    user.last_login = datetime.utcnow()
    db.add(user)
    db.commit()
    return {
        "access_token": security.create_access_token(
            user.id,
            expires_delta=access_token_expires,
            session_id=session.id,
            client_id=client_id,
        ),
        "token_type": "bearer",
        "session_id": session.id,
        "account_id": user.id,
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "applications": [application.model_dump() for application in crud_account.get_sso_applications()],
    }


@router.get("/sso/applications", response_model=List[SsoApplication])
def read_sso_applications() -> Any:
    return crud_account.get_sso_applications()


@router.get("/me", response_model=AccountContextResponse)
def read_account_context(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    token_data: TokenPayload = Depends(get_current_token_payload),
) -> Any:
    current_session = crud_account.get_account_session(db, token_data.sid) if token_data.sid else None
    return {
        "account": current_user,
        "current_session": current_session,
        "applications": crud_account.get_sso_applications(),
        "billing_owner": {"owner_type": "user", "owner_id": current_user.id},
        "consistency_contract": {
            "identity_source": "users",
            "session_source": "account_sessions",
            "billing_source": "Billing Core",
            "entitlement_refresh": "applications may cache read-only entitlements for 1-5 minutes; usage reserve must be real-time",
        },
    }


@router.get("/sessions", response_model=List[AccountSessionResponse])
def read_account_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return crud_account.list_account_sessions(db, current_user.id, active_only=False)


@router.post("/logout", response_model=LogoutResponse)
def logout_current_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    token_data: TokenPayload = Depends(get_current_token_payload),
) -> Any:
    if not token_data.sid:
        return LogoutResponse(revoked=False, reason="legacy_token_without_session")
    session = crud_account.revoke_account_session(db, token_data.sid, user_id=current_user.id)
    return LogoutResponse(revoked=bool(session), session_id=token_data.sid)


@router.delete("/sessions/{session_id}", response_model=LogoutResponse)
def revoke_account_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    session = crud_account.revoke_account_session(db, session_id, user_id=current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Account session not found")
    return LogoutResponse(revoked=True, session_id=session_id)
