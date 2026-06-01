"""
PedagogAI — Pydantic Modellari
Barcha request/response sxemalari
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List


# ==================== AUTH ====================

class RegisterRequest(BaseModel):
    """Ro'yxatdan o'tish uchun keladigan ma'lumotlar"""
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    """Kirish uchun keladigan ma'lumotlar"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Login javobida qaytariladigan token"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Foydalanuvchi ma'lumotlari (parolsiz)"""
    id: int
    name: str
    email: str
    role: str


class RegisterResponse(BaseModel):
    """Ro'yxatdan o'tish javobi"""
    message: str
    user: UserResponse


# ==================== LESSON ====================

class LessonRequest(BaseModel):
    """Dars yaratish uchun keladigan ma'lumotlar (frontend script.js bilan mos)"""
    topic: str
    grade: str
    language: str = "uz"


class LessonResponse(BaseModel):
    """Yaratilgan dars javobi"""
    lesson: str


class LessonHistoryItem(BaseModel):
    """Dars tarixi elementi"""
    id: int
    topic: str
    grade: str
    language: str
    content: str
    created_at: str


# ==================== CROSSWORD ====================

class CrosswordRequest(BaseModel):
    """Krossvord yaratish uchun"""
    topic: str
    count: int = 5


class TestRequest(BaseModel):
    """Test savollari yaratish uchun"""
    topic: str
    grade: str
    count: int = 5


class TestQuestionItem(BaseModel):
    """Bitta test savoli"""
    question: str
    options: dict[str, str]
    answer: str


class TestGenerateResponse(BaseModel):
    """AI test generator javobi"""
    topic: str
    grade: str
    count: int
    questions: list[TestQuestionItem]


class ChatRequest(BaseModel):
    """AI yordamchi bilan suhbat"""
    message: str


# ==================== GENERAL ====================

class MessageResponse(BaseModel):
    """Oddiy xabar javobi"""
    message: str


class ErrorResponse(BaseModel):
    """Xato javobi"""
    error: str