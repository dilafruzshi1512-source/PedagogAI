"""
PedagogAI backend launcher.
- Loads .env from backend/
- Picks API_PORT or first free port in 8000-8099
- Writes port to backend/.port for Vite proxy
"""

from __future__ import annotations

import os
import socket
import subprocess
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
PORT_FILE = BACKEND_DIR / ".port"
ROOT_DIR = BACKEND_DIR.parent


def _port_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def find_free_port() -> int:
    preferred = int(os.getenv("API_PORT", "8000"))
    if _port_available(preferred):
        return preferred

    print(f"[WARN] Port {preferred} band — boshqa port qidirilmoqda...")
    for port in range(8000, 8100):
        if port != preferred and _port_available(port):
            return port

    raise SystemExit("[ERROR] 8000-8099 oralig'ida bo'sh port topilmadi.")


def _read_key_from_env_file(path: Path) -> str:
    if not path.exists():
        return ""
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if line.strip().startswith("OPENAI_API_KEY"):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def _warn_env_key_mismatch() -> None:
    root_key = _read_key_from_env_file(ROOT_DIR / ".env")
    backend_key = _read_key_from_env_file(BACKEND_DIR / ".env")
    if root_key and backend_key and root_key != backend_key:
        print("[WARN] .env va backend/.env da turli OPENAI_API_KEY bor.")
        print("       Loyiha ildizidagi .env ishlatiladi (override).")


def write_port_files(port: int) -> None:
    PORT_FILE.write_text(str(port), encoding="utf-8")

    vite_env = ROOT_DIR / ".env.development.local"
    lines = [
        f"VITE_BACKEND_PORT={port}",
        f"VITE_BACKEND_URL=http://127.0.0.1:{port}",
    ]
    vite_env.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    os.chdir(BACKEND_DIR)
    sys.path.insert(0, str(BACKEND_DIR))

    from config import OPENAI_API_KEY, API_HOST  # noqa: E402

    _warn_env_key_mismatch()

    port = find_free_port()
    write_port_files(port)

    print("=" * 50)
    print(f"  PedagogAI API: http://{API_HOST}:{port}")
    print(f"  Docs:          http://{API_HOST}:{port}/docs")
    print(f"  OpenAI key:    {'OK' if OPENAI_API_KEY else 'YO\'Q — backend/.env ni tekshiring'}")
    print("=" * 50)

    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--reload",
        "--host",
        API_HOST,
        "--port",
        str(port),
    ]
    subprocess.run(cmd, cwd=str(BACKEND_DIR))


if __name__ == "__main__":
    main()
