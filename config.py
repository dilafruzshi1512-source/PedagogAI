"""
PedagogAI — Konfiguratsiya fayli
Barcha muhim sozlamalar .env fayldan o'qiladi
"""

import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent


def _clean_env(value: str | None) -> str:
    if not value:
        return ""
    return value.strip().strip('"').strip("'")


# backend/.env, keyin loyiha ildizi .env (yangi kalit odatda ildizda bo'ladi)
load_dotenv(BACKEND_DIR / ".env", encoding="utf-8")
load_dotenv(ROOT_DIR / ".env", encoding="utf-8", override=True)

# ==================== OPENAI ====================
OPENAI_API_KEY = _clean_env(os.getenv("OPENAI_API_KEY"))

# ==================== JWT ====================
SECRET_KEY = _clean_env(os.getenv("SECRET_KEY")) or "pedagogai-default-secret-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ==================== DATABASE ====================
DATABASE_PATH = str(BACKEND_DIR / "pedagogai.db")

# ==================== SERVER ====================
API_HOST = _clean_env(os.getenv("API_HOST")) or "127.0.0.1"
API_PORT = int(_clean_env(os.getenv("API_PORT")) or "8000")
