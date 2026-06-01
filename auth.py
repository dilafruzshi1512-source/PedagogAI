"""
PedagogAI — Auth Router
Register, Login, /me endpointlari
"""

import sqlite3

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from schemas import (
    RegisterRequest, RegisterResponse,
    LoginRequest, TokenResponse,
    UserResponse
)
from security import hash_password, verify_password, create_access_token, decode_access_token
from users_db import create_user, get_user_by_email, get_user_by_id


router = APIRouter(tags=["Auth"])
security_scheme = HTTPBearer(auto_error=False)


def _db_http_error(exc: Exception) -> HTTPException:
    if isinstance(exc, sqlite3.IntegrityError):
        return HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan")
    if isinstance(exc, sqlite3.OperationalError):
        return HTTPException(status_code=503, detail="Ma'lumotlar bazasi band. Qayta urinib ko'ring.")
    return HTTPException(status_code=500, detail="Server xatosi. Qayta urinib ko'ring.")


# ==================== REGISTER ====================

@router.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest):
    """
    Yangi foydalanuvchi ro'yxatdan o'tkazish

    Frontend dan keladigan ma'lumotlar:
    {
        "name": "Dilafruz",
        "email": "dilafruz@mail.com",
        "password": "12345"
    }
    """

    try:
        existing = get_user_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Bu email allaqachon ro'yxatdan o'tgan"
            )

        hashed = hash_password(data.password)
        user = create_user(
            name=data.name,
            email=data.email,
            hashed_password=hashed
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise _db_http_error(exc) from exc

    return {
        "message": "Ro'yxatdan muvaffaqiyatli o'tildi",
        "user": user
    }


# ==================== LOGIN ====================

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    """
    Foydalanuvchi tizimga kirish

    Frontend dan keladigan ma'lumotlar:
    {
        "email": "dilafruz@mail.com",
        "password": "12345"
    }

    Javob:
    {
        "access_token": "eyJhbGci...",
        "token_type": "bearer"
    }
    """

    try:
        user = get_user_by_email(data.email)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Foydalanuvchi topilmadi"
            )

        stored_hash = user.get("hashed_password")
        if not verify_password(data.password, stored_hash):
            raise HTTPException(
                status_code=401,
                detail="Parol noto'g'ri"
            )

        token = create_access_token({
            "sub": user["email"],
            "user_id": user["id"]
        })
    except HTTPException:
        raise
    except Exception as exc:
        raise _db_http_error(exc) from exc

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ==================== CURRENT USER DEPENDENCY ====================

def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> dict:
    """
    JWT token orqali joriy foydalanuvchini aniqlash
    Boshqa endpoint'larda Depends() sifatida ishlatiladi
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=401,
            detail="Avtorizatsiya talab qilinadi"
        )

    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Token yaroqsiz yoki muddati o'tgan"
        )

    user = get_user_by_email(payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Foydalanuvchi topilmadi"
        )

    return user


# ==================== GET ME ====================

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Joriy foydalanuvchi ma'lumotlari

    Header: Authorization: Bearer <token>

    Javob:
    {
        "id": 1,
        "name": "Dilafruz",
        "email": "dilafruz@mail.com",
        "role": "teacher"
    }
    """
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }
