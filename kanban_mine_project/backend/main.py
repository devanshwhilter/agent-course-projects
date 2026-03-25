from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env from the working directory

from backend.db.database import init_db
from backend.routers import auth, board, cards, columns, ai

app = FastAPI(title="Kanban MVP")

@app.on_event("startup")
def on_startup():
    init_db()

# API routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(board.router, prefix="/api", tags=["board"])
app.include_router(cards.router, prefix="/api", tags=["cards"])
app.include_router(columns.router, prefix="/api", tags=["columns"])
app.include_router(ai.router, prefix="/api", tags=["ai"])


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Serve Next.js static export — must come last
FRONTEND_OUT = os.path.join(os.path.dirname(__file__), "..", "frontend", "out")
if os.path.isdir(FRONTEND_OUT):
    app.mount("/", StaticFiles(directory=FRONTEND_OUT, html=True), name="static")
