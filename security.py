"""
PedagogAI — Xavfsizlik Moduli
JWT token yaratish/tekshirish va parol hashing
"""

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


import bcrypt
import hashlib

# ==================== PAROL HASHING (bcrypt) ====================

def _password_bytes(password: str) -> bytes:
    """SHA-256 pre-hash (bcrypt 72-byte limitidan himoya)"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest().encode('utf-8')


def hash_password(password: str) -> str:
    """Parolni sqlite saqlash uchun hash qilish"""
    digest = _password_bytes(password)
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(digest, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str | None) -> bool:
    """Yangi (SHA-256+bcrypt) va eski (to'g'ridan-to'g'ri bcrypt) hashlarni tekshirish"""
    if not hashed_password:
        return False
    stored = hashed_password.encode('utf-8')
    try:
        digest = _password_bytes(plain_password)
        if bcrypt.checkpw(digest, stored):
            return True
        # Eski foydalanuvchilar: parol to'g'ridan-to'g'ri bcrypt bilan hashlangan
        return bcrypt.checkpw(plain_password.encode('utf-8'), stored)
    except (ValueError, TypeError):
        return False


# ==================== JWT TOKEN ====================

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    JWT access token yaratish
    data ichida {"sub": email, "user_id": id} bo'ladi
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": int(expire.timestamp())})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        return token.decode('utf-8')
    return token


def decode_access_token(token: str) -> dict | None:
    """
    JWT tokenni dekodlash
    Agar token yaroqsiz yoki muddati o'tgan bo'lsa None qaytaradi
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
