from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.auth_utils import create_access_token
from backend.db.database import get_connection

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    conn = get_connection()
    row = conn.execute(
        "SELECT id, username FROM users WHERE username = ? AND password = ?",
        (body.username, body.password),
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(row["id"]), "username": row["username"]})
    return TokenResponse(access_token=token)


@router.post("/logout")
def logout():
    # JWT is stateless; logout is handled client-side by discarding the token.
    return {"message": "Logged out"}
