import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import models
from database.database import get_db

# Secret key to sign tokens. Override via JWT_SECRET_KEY in production.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
AUTH_MODE = os.getenv("AUTH_MODE", "jwt").strip().lower()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login/token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/users/login/token", auto_error=False)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception


def _resolve_user_from_authentik_headers(request: Request, db: Session) -> models.User:
    email = (request.headers.get("x-authentik-email") or "").strip().lower()
    username_header = (request.headers.get("x-authentik-username") or "").strip()

    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authentik identity headers")

    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        return existing_user

    base_username = username_header or email.split("@")[0] or "user"
    base_username = base_username[:40]
    candidate = base_username
    suffix = 1
    while db.query(models.User).filter(models.User.username == candidate).first():
        candidate = f"{base_username[:35]}-{suffix}"
        suffix += 1

    user = models.User(username=candidate, email=email, hashed_password="")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_current_user_id(
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme_optional),
) -> int:
    if AUTH_MODE == "authentik":
        user = _resolve_user_from_authentik_headers(request, db)
        return user.id

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    return int(verify_token(token))


def enforce_user_ownership(path_user_id: int, current_user_id: int) -> None:
    if path_user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: you can only access your own resources",
        )
    