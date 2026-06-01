"""
PedagogAI — SQLite Ma'lumotlar Bazasi
users va lessons jadvallari bilan ishlash
"""

import sqlite3
from config import DATABASE_PATH


def _row_to_dict(row: sqlite3.Row | None) -> dict | None:
    if row is None:
        return None
    data = dict(row)
    if data.get("role") is None:
        data["role"] = "teacher"
    return data


def get_connection():
    """SQLite ga ulanish — har bir so'rov uchun yangi connection"""
    conn = sqlite3.connect(DATABASE_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def init_db():
    """Jadvallarni yaratish (agar mavjud bo'lmasa)"""
    conn = get_connection()
    cursor = conn.cursor()

    # ==================== USERS ====================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT    NOT NULL,
            email           TEXT    UNIQUE NOT NULL,
            hashed_password TEXT    NOT NULL,
            role            TEXT    DEFAULT 'teacher',
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==================== LESSONS ====================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lessons (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER,
            topic       TEXT    NOT NULL,
            grade       TEXT    NOT NULL,
            language    TEXT    DEFAULT 'uz',
            content     TEXT    NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()
    print("[OK] Database tayyor: pedagogai.db")


# ==================== USER CRUD ====================

def create_user(name: str, email: str, hashed_password: str, role: str = "teacher") -> dict:
    """Yangi foydalanuvchi yaratish"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, hashed_password, role) VALUES (?, ?, ?, ?)",
        (name, email, hashed_password, role)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return {"id": user_id, "name": name, "email": email, "role": role}


def get_user_by_email(email: str) -> dict | None:
    """Email orqali foydalanuvchini topish"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_dict(row)


def get_user_by_id(user_id: int) -> dict | None:
    """ID orqali foydalanuvchini topish"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_dict(row)


def get_all_users() -> list:
    """Barcha foydalanuvchilar ro'yxati (admin uchun)"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role, created_at FROM users ORDER BY id")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


# ==================== LESSON CRUD ====================

def save_lesson(user_id: int, topic: str, grade: str, language: str, content: str) -> int:
    """Yaratilgan darsni saqlash"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO lessons (user_id, topic, grade, language, content) VALUES (?, ?, ?, ?, ?)",
        (user_id, topic, grade, language, content)
    )
    conn.commit()
    lesson_id = cursor.lastrowid
    conn.close()
    return lesson_id


def get_user_lessons(user_id: int) -> list:
    """Foydalanuvchining barcha darslari"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM lessons WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
