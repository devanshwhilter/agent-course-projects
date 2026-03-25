from fastapi import APIRouter, Depends

from backend.auth_utils import get_current_user
from backend.db.database import get_connection

router = APIRouter()


@router.get("/board")
def get_board(current_user: dict = Depends(get_current_user)):
    conn = get_connection()

    board = conn.execute(
        "SELECT id, name FROM boards WHERE owner = ? LIMIT 1",
        (int(current_user["sub"]),),
    ).fetchone()

    if not board:
        conn.close()
        return {"id": None, "name": None, "columns": []}

    columns = conn.execute(
        "SELECT id, name, position FROM columns WHERE board_id = ? ORDER BY position",
        (board["id"],),
    ).fetchall()

    result_columns = []
    for col in columns:
        cards = conn.execute(
            "SELECT id, column_id, title, description, position FROM cards WHERE column_id = ? ORDER BY position",
            (col["id"],),
        ).fetchall()
        result_columns.append({
            "id": col["id"],
            "name": col["name"],
            "position": col["position"],
            "cards": [dict(c) for c in cards],
        })

    conn.close()
    return {"id": board["id"], "name": board["name"], "columns": result_columns}
