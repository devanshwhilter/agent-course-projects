import json
import os
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.auth_utils import get_current_user
from backend.db.database import get_connection

router = APIRouter()

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# -- Schemas ------------------------------------------------------------------

class BoardUpdate(BaseModel):
    action: str           # "move_card" | "add_card" | "rename_card" | "delete_card"
    card_id: Optional[int] = None
    column_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None


class AIResponse(BaseModel):
    chat_response: str
    board_update: Optional[BoardUpdate] = None


class ChatRequest(BaseModel):
    message: str


# -- Helpers ------------------------------------------------------------------

def _fetch_board_json(user_id: int) -> dict:
    conn = get_connection()
    board = conn.execute(
        "SELECT id, name FROM boards WHERE owner = ? LIMIT 1", (user_id,)
    ).fetchone()
    if not board:
        conn.close()
        return {}
    columns = conn.execute(
        "SELECT id, name, position FROM columns WHERE board_id = ? ORDER BY position",
        (board["id"],),
    ).fetchall()
    result = {"id": board["id"], "name": board["name"], "columns": []}
    for col in columns:
        cards = conn.execute(
            "SELECT id, column_id, title, description, position FROM cards WHERE column_id = ? ORDER BY position",
            (col["id"],),
        ).fetchall()
        result["columns"].append({
            "id": col["id"],
            "name": col["name"],
            "position": col["position"],
            "cards": [dict(c) for c in cards],
        })
    conn.close()
    return result


def _apply_board_update(update: BoardUpdate) -> None:
    conn = get_connection()
    if update.action == "move_card" and update.card_id and update.column_id:
        conn.execute(
            "UPDATE cards SET column_id = ?, position = ? WHERE id = ?",
            (update.column_id, update.position or 0, update.card_id),
        )
    elif update.action == "add_card" and update.column_id and update.title:
        conn.execute(
            "INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)",
            (update.column_id, update.title, update.description or "", update.position or 0),
        )
    elif update.action == "rename_card" and update.card_id and update.title:
        conn.execute("UPDATE cards SET title = ? WHERE id = ?", (update.title, update.card_id))
    elif update.action == "delete_card" and update.card_id:
        conn.execute("DELETE FROM cards WHERE id = ?", (update.card_id,))
    conn.commit()
    conn.close()


# -- Routes -------------------------------------------------------------------

@router.get("/test-ai")
async def test_ai():
    """Quick sanity-check: ask the model what 2+2 is."""
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            OPENROUTER_URL,
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            json={
                "model": OPENROUTER_MODEL,
                "messages": [{"role": "user", "content": "What is 2+2? Reply with only the number."}],
            },
            timeout=30,
        )
    resp.raise_for_status()
    answer = resp.json()["choices"][0]["message"]["content"].strip()
    return {"answer": answer}


@router.post("/chat", response_model=AIResponse)
async def chat(body: ChatRequest, current_user: dict = Depends(get_current_user)):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set")

    board_state = _fetch_board_json(int(current_user["sub"]))

    system_prompt = f"""You are a Kanban board assistant. The current board state is:

{json.dumps(board_state, indent=2)}

Respond ONLY with valid JSON matching this schema:
{{
  "chat_response": "<your message to the user>",
  "board_update": {{
    "action": "move_card | add_card | rename_card | delete_card",
    "card_id": <int or null>,
    "column_id": <int or null>,
    "title": "<string or null>",
    "description": "<string or null>",
    "position": <int or null>
  }} or null
}}

If no board change is needed, set board_update to null."""

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            OPENROUTER_URL,
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": body.message},
                ],
                "response_format": {"type": "json_object"},
            },
            timeout=60,
        )
    resp.raise_for_status()

    raw = resp.json()["choices"][0]["message"]["content"]
    data = json.loads(raw)
    ai_resp = AIResponse(**data)

    if ai_resp.board_update:
        _apply_board_update(ai_resp.board_update)

    return ai_resp
