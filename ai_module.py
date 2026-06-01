"""
PedagogAI — AI Moduli
OpenAI GPT orqali dars va krossvord yaratish
Agar API kalit bo'lmasa, fallback shablon ishlatiladi
"""

import json
import re
import uuid
from config import OPENAI_API_KEY

_client = None


def get_openai_client():
    """OpenAI clientini lazy yaratish (yangilangan .env bilan)"""
    global _client
    if _client is not None:
        return _client

    if not OPENAI_API_KEY:
        return None

    if not OPENAI_API_KEY.startswith(("sk-", "sk-proj-")):
        print("[WARN] OPENAI_API_KEY formati noto'g'ri (sk- bilan boshlanishi kerak)")
        return None

    try:
        from openai import OpenAI
        _client = OpenAI(api_key=OPENAI_API_KEY)
        print("[OK] OpenAI client tayyor")
        return _client
    except Exception as e:
        print(f"[WARN] OpenAI init xatosi: {e}")
        return None


def check_openai_connection() -> dict:
    """API kalit va ulanishni tekshirish (health uchun)"""
    if not OPENAI_API_KEY:
        return {"ok": False, "error": "OPENAI_API_KEY topilmadi (backend/.env yoki .env)"}

    client = get_openai_client()
    if not client:
        return {"ok": False, "error": "OpenAI client yaratilmadi"}

    try:
        client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=5,
        )
        return {"ok": True}
    except Exception as e:
        err = str(e)
        if "invalid_api_key" in err or "Incorrect API key" in err:
            return {"ok": False, "error": "API kalit noto'g'ri. platform.openai.com dan yangi kalit oling."}
        if "insufficient_quota" in err or "429" in err:
            return {"ok": False, "error": "OpenAI kvotasi tugagan. Billing ni tekshiring."}
        return {"ok": False, "error": err[:200]}


# ==================== DARS YARATISH ====================

def generate_lesson_content(topic: str, grade: str, language: str = "uz") -> str:
    """
    AI orqali dars kontenti yaratish

    Args:
        topic: Mavzu nomi (masalan: "Algoritm")
        grade: Sinf raqami (masalan: "7")
        language: Til (default: "uz")

    Returns:
        Tayyor dars matni
    """

    prompt = f"""Sen tajribali pedagog o'qituvchisan. Quyidagi ma'lumotlar asosida to'liq dars rejasi yarat:

Mavzu: {topic}
Sinf: {grade}-sinf
Til: {"O'zbek" if language == "uz" else language}

Dars rejasi quyidagilarni o'z ichiga olsin:
1. Darsning maqsadi
2. Dars rejasi (bosqichlar bilan)
3. Yangi mavzu tushuntirishi (batafsil)
4. Amaliy mashqlar (3-5 ta)
5. Mustahkamlash savollari (3-5 ta)
6. Uy vazifasi

Javobni o'zbek tilida, tushunarli va professional tarzda yoz."""

    # OpenAI bilan urinish
    client = get_openai_client()
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Sen tajribali pedagog o'qituvchisan. O'zbek tilida professional dars rejalari yaratasiz."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[WARN] OpenAI generate xatosi: {e}")
            return _lesson_fallback(topic, grade)
    else:
        return _lesson_fallback(topic, grade)


def _lesson_fallback(topic: str, grade: str) -> str:
    """OpenAI ishlamasa, tayyor shablon qaytarish"""
    return (
        f"DARS REJASI\n\n"
        f"Mavzu: {topic}\n"
        f"Sinf: {grade}-sinf\n\n"
        f"{'=' * 40}\n\n"
        f"DARSNING MAQSADI:\n"
        f"- O'quvchilarga \"{topic}\" mavzusini tushuntirish\n"
        f"- Amaliy ko'nikmalar hosil qilish\n"
        f"- Mustaqil fikrlash qobiliyatini rivojlantirish\n\n"
        f"{'=' * 40}\n\n"
        f"DARS BOSQICHLARI:\n\n"
        f"1. TASHKILIY QISM (5 daqiqa)\n"
        f"   - Davomatni tekshirish\n"
        f"   - O'tgan mavzuni qisqa takrorlash\n"
        f"   - Bugungi dars rejasi bilan tanishtirish\n\n"
        f"2. YANGI MAVZU (20 daqiqa)\n"
        f"   \"{topic}\" - bu {grade}-sinf o'quvchilari uchun muhim mavzu.\n\n"
        f"   Asosiy tushunchalar:\n"
        f"   - {topic} nima va uning ta'rifi\n"
        f"   - {topic}ning tarixiy rivojlanishi\n"
        f"   - {topic}ning ahamiyati va qo'llanilishi\n"
        f"   - Hayotiy misollar orqali tushuntirish\n\n"
        f"3. AMALIY MASHQLAR (10 daqiqa)\n"
        f"   a) {topic} haqida 3 ta gap yozing\n"
        f"   b) {topic}ni sxema/rasm shaklida tasvirlang\n"
        f"   c) Guruhda {topic} haqida muhokama qiling\n"
        f"   d) {topic} bo'yicha taqqoslash jadvalini to'ldiring\n\n"
        f"4. MUSTAHKAMLASH (5 daqiqa)\n"
        f"   Savol 1: {topic} nima?\n"
        f"   Savol 2: {topic}ning asosiy vazifasi nima?\n"
        f"   Savol 3: {topic} hayotda qayerda qo'llaniladi?\n"
        f"   Savol 4: {topic} bo'yicha misol keltiring\n"
        f"   Savol 5: {topic}ning afzalliklari nimada?\n\n"
        f"5. UY VAZIFASI\n"
        f"   - {topic} mavzusida esse yozing (150-200 so'z)\n"
        f"   - 5 ta nazorat savoli tayyorlang\n"
        f"   - Mavzu bo'yicha qo'shimcha ma'lumot toping\n\n"
        f"{'=' * 40}\n"
        f"Dars yakunlandi!\n"
        f"PedagogAI tomonidan yaratildi"
    )


# ==================== KROSSVORD YARATISH ====================

def generate_crossword(topic: str, count: int = 5) -> str:
    """
    Krossvord uchun so'zlar va savollar generatsiya qilish
    """

    prompt = f"""{topic} mavzusida {count} ta krossvord uchun so'zlar va savollar yarat.

JSON formatda qaytar:
[
  {{"word": "SO'Z", "clue": "Savol yoki ta'rif"}}
]

Faqat JSON qaytar, boshqa hech narsa yozma."""

    client = get_openai_client()
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[WARN] Crossword xatosi: {e}")
            return _crossword_fallback(topic)
    else:
        return _crossword_fallback(topic)


def _crossword_fallback(topic: str) -> str:
    """Krossvord uchun fallback"""
    data = [
        {"word": topic.upper().replace(" ", ""), "clue": f"{topic} nima?"},
        {"word": "BILIM", "clue": "O'qish orqali olinadigan narsa"},
        {"word": "DARS", "clue": "Maktabda o'tiladigan mashg'ulot"},
        {"word": "KITOB", "clue": "Bilim manbai"},
        {"word": "FAN", "clue": "O'qitiladigan yo'nalish"}
    ]
    return json.dumps(data, ensure_ascii=False)


# ==================== TEST YARATISH ====================

def _extract_json_array(text: str) -> list:
    """AI javobidan JSON massivini ajratib olish"""
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE | re.MULTILINE)
    cleaned = re.sub(r"\s*```\s*$", "", cleaned, flags=re.MULTILINE)
    start = cleaned.find("[")
    end = cleaned.rfind("]")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("JSON massiv topilmadi")
    return json.loads(cleaned[start : end + 1])


def _normalize_test_question(raw: dict, index: int) -> dict:
    """Savolni standart formatga keltirish"""
    question_text = (
        raw.get("question")
        or raw.get("savol")
        or raw.get("text")
        or ""
    )
    question_text = str(question_text).strip()
    if not question_text:
        raise ValueError(f"{index + 1}-savol matni bo'sh")

    options_raw = raw.get("options") or raw.get("variants") or raw.get("variantlar") or {}
    options: dict[str, str] = {}

    if isinstance(options_raw, list):
        labels = ["A", "B", "C", "D"]
        for i, val in enumerate(options_raw[:4]):
            options[labels[i]] = str(val).strip()
    elif isinstance(options_raw, dict):
        for key, val in options_raw.items():
            label = str(key).strip().upper().replace(".", "")[:1]
            if label in {"A", "B", "C", "D"}:
                options[label] = str(val).strip()

    if len(options) < 4:
        raise ValueError(f"{index + 1}-savolda 4 ta variant yo'q")

    answer = str(raw.get("answer") or raw.get("javob") or "A").strip().upper()
    answer = answer[:1] if answer else "A"
    if answer not in options:
        answer = "A"

    return {
        "question": question_text,
        "options": {k: options[k] for k in ["A", "B", "C", "D"]},
        "answer": answer,
    }


def parse_test_response(raw: str, expected_count: int) -> list[dict]:
    """AI matnini tekshirilgan savollar ro'yxatiga aylantirish"""
    data = _extract_json_array(raw)
    if not isinstance(data, list) or len(data) == 0:
        raise ValueError("Savollar ro'yxati bo'sh")

    questions = [_normalize_test_question(item, i) for i, item in enumerate(data)]
    if len(questions) < max(1, expected_count // 2):
        raise ValueError("Yetarli savollar yaratilmadi")
    return questions[:expected_count]


def generate_test(topic: str, grade: str, count: int = 5) -> list[dict]:
    """
    OpenAI orqali o'zbek tilida ko'p tanlovli test savollari yaratish.
    Har safar yangi, mavzuga mos savollar qaytaradi.
    """
    client = get_openai_client()
    if not client:
        raise RuntimeError(
            "OpenAI API kaliti sozlanmagan. .env yoki backend/.env faylida OPENAI_API_KEY ni kiriting."
        )

    count = max(3, min(15, int(count)))
    session_id = uuid.uuid4().hex[:8]

    system_prompt = """Sen tajribali o'zbek maktab o'qituvchisi va test tuzuvchisisan.
Vazifang: berilgan mavzu va sinf uchun pedagogik jihatdan to'g'ri, tushunarli,
ko'p tanlovli test savollarini yaratish.

Qoidalar:
- Barcha matnlar o'zbek tilida bo'lsin
- Har bir savol mantiqan to'g'ri va bilimni tekshirsin
- 4 ta variant (A, B, C, D) bo'lsin, faqat bittasi to'g'ri
- Noto'g'ri variantlar ham mazmunli va o'quvchini chalg'itadigan bo'lsin
- Savollar bir-biridan farq qilsin, takrorlanmasin
- Faqat JSON massiv qaytaring, boshqa matn yozmang"""

    user_prompt = f"""Mavzu: {topic}
Sinf: {grade}-sinf
Savollar soni: {count}
Sessiya: {session_id}

{count} ta yangi test savoli yarating. Har safar boshqa savollar bo'lsin.

JSON format:
[
  {{
    "question": "Savol matni",
    "options": {{"A": "variant", "B": "variant", "C": "variant", "D": "variant"}},
    "answer": "A"
  }}
]"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=3500,
            temperature=0.9,
            presence_penalty=0.4,
            frequency_penalty=0.3,
        )
        raw = response.choices[0].message.content or ""
        return parse_test_response(raw, count)
    except (json.JSONDecodeError, ValueError, KeyError) as e:
        raise RuntimeError(f"AI javobini qayta ishlashda xatolik: {e}") from e
    except Exception as e:
        err = str(e)
        if "invalid_api_key" in err or "Incorrect API key" in err:
            raise RuntimeError(
                "OpenAI API kaliti noto'g'ri. Loyiha ildizidagi .env faylida to'g'ri OPENAI_API_KEY kiriting."
            ) from e
        if "insufficient_quota" in err or "429" in err:
            raise RuntimeError("OpenAI kvotasi tugagan. Billing sahifasini tekshiring.") from e
        raise RuntimeError(f"OpenAI test yaratishda xatolik: {e}") from e


# ==================== AI CHAT ====================

def chat_with_ai(message: str) -> str:
    """
    O'qituvchi uchun AI yordamchi - savollarga javob beradi
    """
    system_prompt = """Sen PedagogAI - o'zbek tilidagi aqlli pedagogika yordamchisisiz.
O'qituvchilarga quyidagi sohalarda yordam berasan:
- Dars rejasi va metodikasi
- O'quvchilarga yondashuv usullari
- Mavzu bo'yicha izohlar va tushuntirishlar
- Pedagogika maslahatlar

Doim qisqa, aniq va dostonarli tarzda javob ber. O'zbek tilida gaplash."""

    client = get_openai_client()
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[WARN] Chat xatosi: {e}")
            return _chat_fallback(message)
    else:
        return _chat_fallback(message)


def _chat_fallback(message: str) -> str:
    """Chat uchun fallback"""
    return (
        f"Savolingiz: '{message}'\n\n"
        "Hozirda AI xizmati vaqtincha ishlamayapti. "
        "Quyidagi manbalardan foydalaning:\n"
        "- pedagogical.uz - O'zbek pedagogikasi resurslari\n"
        "- edu.uz - Ta'lim portali\n"
        "- ziyonet.uz - O'quv materiallari\n\n"
        "Tez orada javob berishga harakat qilamiz!"
    )
