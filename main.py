"""
PedagogAI — Asosiy FastAPI Ilovasi
Barcha route'lar, CORS, va middleware'lar
"""

import logging

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Optional

logger = logging.getLogger("pedagogai")

from auth import router as auth_router, get_current_user
from schemas import LessonRequest, CrosswordRequest, TestRequest, ChatRequest, TestGenerateResponse
from ai_module import (
    generate_lesson_content,
    generate_crossword,
    generate_test,
    chat_with_ai,
    check_openai_connection,
)
from config import OPENAI_API_KEY, API_HOST, API_PORT
from users_db import init_db, save_lesson, get_user_lessons


# ==================== APP YARATISH ====================

app = FastAPI(
    title="PedagogAI API",
    description="O'qituvchilar uchun AI yordamchisi — dars rejasi, test va krossvord yaratish",
    version="1.0.0"
)


# ==================== CORS SOZLASH ====================
# Frontend (HTML fayllar) brauzerdan API ga murojaat qilishi uchun

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "https://pedagog-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Server xatosi. Qayta urinib ko'ring."},
    )


# ==================== DATABASE INIT ====================

@app.on_event("startup")
def startup():
    """Server ishga tushganda database'ni yaratish"""
    init_db()
    print("[OK] PedagogAI API ishga tushdi!")


# ==================== AUTH ROUTES ====================
# POST /register — Ro'yxatdan o'tish
# POST /login    — Kirish (JWT token olish)
# GET  /me       — Joriy foydalanuvchi ma'lumotlari

app.include_router(auth_router)


# ==================== DARS YARATISH ====================

@app.post("/generate-lesson")
def create_lesson(req: LessonRequest):
    """
    AI orqali dars yaratish

    Frontend script.js dan keladigan so'rov:
    POST http://127.0.0.1:8000/generate-lesson
    Body: {"topic": "Algoritm", "grade": "7", "language": "uz"}

    Javob: {"lesson": "📘 DARS REJASI..."}
    yoki:  {"error": "Xato xabari"}
    """
    try:
        content = generate_lesson_content(
            topic=req.topic,
            grade=req.grade,
            language=req.language
        )
        return {"lesson": content}

    except Exception as e:
        return {"error": f"Dars yaratishda xatolik: {str(e)}"}


@app.post("/create-lesson")
def create_lesson_with_auth(
    req: LessonRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Auth bilan dars yaratish va saqlash (kelajakda frontend auth qo'shganda)

    Header: Authorization: Bearer <token>
    Body:   {"topic": "Algoritm", "grade": "7", "language": "uz"}

    Javob: {"lesson": "...", "lesson_id": 1, "saved": true}
    """
    try:
        content = generate_lesson_content(
            topic=req.topic,
            grade=req.grade,
            language=req.language
        )

        # Darsni bazaga saqlash
        lesson_id = save_lesson(
            user_id=current_user["id"],
            topic=req.topic,
            grade=req.grade,
            language=req.language,
            content=content
        )

        return {
            "lesson": content,
            "lesson_id": lesson_id,
            "saved": True
        }

    except Exception as e:
        return {"error": f"Dars yaratishda xatolik: {str(e)}"}


# ==================== DARS TARIXI ====================

@app.get("/my-lessons")
def my_lessons(current_user: dict = Depends(get_current_user)):
    """
    Joriy foydalanuvchining saqlangan darslari

    Header: Authorization: Bearer <token>

    Javob: {"lessons": [{id, topic, grade, ...}, ...]}
    """
    lessons = get_user_lessons(current_user["id"])
    return {"lessons": lessons}


# ==================== KROSSVORD ====================

@app.post("/generate-crossword")
def create_crossword(req: CrosswordRequest):
    """
    Krossvord uchun so'zlar va savollar yaratish

    Body: {"topic": "Informatika", "count": 5}
    Javob: {"data": "[{word, clue}, ...]"}
    """
    try:
        data = generate_crossword(topic=req.topic, count=req.count)
        return {"data": data}

    except Exception as e:
        return {"error": f"Krossvord yaratishda xatolik: {str(e)}"}


# ==================== TEST YARATISH ====================

@app.post("/generate-test", response_model=TestGenerateResponse)
def create_test(req: TestRequest, current_user: dict = Depends(get_current_user)):
    """
    AI orqali test savollari yaratish (OpenAI, o'zbek tilida)
    Header: Authorization: Bearer <token>
    Body: {"topic": "Algoritm", "grade": "7", "count": 5}
    """
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Mavzu kiritilishi shart")

    count = max(3, min(15, req.count))

    try:
        questions = generate_test(topic=topic, grade=req.grade, count=count)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test yaratishda xatolik: {str(e)}") from e

    return {
        "topic": topic,
        "grade": req.grade,
        "count": len(questions),
        "questions": questions,
    }


# ==================== AI CHAT ====================

@app.post("/chat")
def ai_chat(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    """
    AI yordamchi bilan suhbat
    Header: Authorization: Bearer <token>
    Body: {"message": "Savolingiz"}
    """
    try:
        reply = chat_with_ai(message=req.message)
        return {"reply": reply}
    except Exception as e:
        return {"error": f"AI javob berishda xatolik: {str(e)}"}


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health():
    """Server va OpenAI holati"""
    openai_status = check_openai_connection()
    return {
        "status": "ok",
        "api_host": API_HOST,
        "api_port": API_PORT,
        "openai_configured": bool(OPENAI_API_KEY),
        "openai": openai_status,
    }


@app.get("/")
def root():
    """API ishlayotganini tekshirish"""
    return {
        "message": "PedagogAI API ishlayapti!",
        "version": "1.0.0",
        "endpoints": {
            "register": "POST /register",
            "login": "POST /login",
            "me": "GET /me",
            "generate_lesson": "POST /generate-lesson",
            "create_lesson": "POST /create-lesson (auth)",
            "my_lessons": "GET /my-lessons (auth)",
            "crossword": "POST /generate-crossword",
            "test": "POST /generate-test (auth)",
            "chat": "POST /chat (auth)",
            "docs": "GET /docs"
        }
    }
