from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from backend.auth_utils import get_current_user
from backend.db.database import get_connection

router = APIRouter()


class CardCreate(BaseModel):
    column_id: int
    title: str
    description: str = ""
    position: int = 0


class CardPatch(BaseModel):
    column_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None


@router.post("/cards", status_code=status.HTTP_201_CREATED)
def create_card(body: CardCreate, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)",
        (body.column_id, body.title, body.description, body.position),
    )
    conn.commit()
    card_id = cursor.lastrowid
    conn.close()
    return {"id": card_id, "column_id": body.column_id, "title": body.title,
            "description": body.description, "position": body.position}


@router.patch("/cards/{card_id}")
def update_card(card_id: int, body: CardPatch, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    existing = conn.execute("SELECT id FROM cards WHERE id = ?", (card_id,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Card not found")

    fields = {k: v for k, v in body.model_dump().items() if v is not None}
    if fields:
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        conn.execute(f"UPDATE cards SET {set_clause} WHERE id = ?", (*fields.values(), card_id))
        conn.commit()

    card = conn.execute(
        "SELECT id, column_id, title, description, position FROM cards WHERE id = ?", (card_id,)
    ).fetchone()
    conn.close()
    return dict(card)


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    conn.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    conn.commit()
    conn.close()
