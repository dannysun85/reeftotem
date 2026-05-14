from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    session_id: Optional[str] = None
    account_id: Optional[str] = None
    expires_in: Optional[int] = None
    applications: Optional[List[Dict[str, Any]]] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    sid: Optional[str] = None
    client_id: Optional[str] = None
    token_use: Optional[str] = None
    account_version: Optional[int] = None
