from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from backend.auth_utils import get_current_user
from backend.db.database import get_connection

router = APIRouter()


class ColumnUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[int] = None


@router.put("/columns/{column_id}")
def update_column(column_id: int, body: ColumnUpdate, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    existing = conn.execute("SELECT id FROM columns WHERE id = ?", (column_id,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Column not found")

    fields = {k: v for k, v in body.model_dump().items() if v is not None}
    if fields:
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        conn.execute(f"UPDATE columns SET {set_clause} WHERE id = ?", (*fields.values(), column_id))
        conn.commit()

    col = conn.execute(
        "SELECT id, board_id, name, position FROM columns WHERE id = ?", (column_id,)
    ).fetchone()
    conn.close()
    return dict(col)
