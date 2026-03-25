import sqlite3
import os

DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "..", "..", "data", "kanban.db"))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_connection()
    with conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                username  TEXT    NOT NULL UNIQUE,
                password  TEXT    NOT NULL
            );

            CREATE TABLE IF NOT EXISTS boards (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                name  TEXT    NOT NULL,
                owner INTEGER NOT NULL REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS columns (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                board_id  INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
                name      TEXT    NOT NULL,
                position  INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS cards (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                column_id   INTEGER NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
                title       TEXT    NOT NULL,
                description TEXT    NOT NULL DEFAULT '',
                position    INTEGER NOT NULL DEFAULT 0
            );

            -- Seed default user if not present
            INSERT OR IGNORE INTO users (username, password) VALUES ('user', 'password');

            -- Seed a default board if none exist
            INSERT OR IGNORE INTO boards (id, name, owner)
            SELECT 1, 'My Board', (SELECT id FROM users WHERE username = 'user')
            WHERE NOT EXISTS (SELECT 1 FROM boards);

            -- Seed default columns
            INSERT OR IGNORE INTO columns (id, board_id, name, position) VALUES (1, 1, 'To Do',       0);
            INSERT OR IGNORE INTO columns (id, board_id, name, position) VALUES (2, 1, 'In Progress', 1);
            INSERT OR IGNORE INTO columns (id, board_id, name, position) VALUES (3, 1, 'Done',        2);

            -- Seed dummy cards (only if no cards exist yet)
            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 1, 1, 'Set up project repo', 'Create GitHub repo, add README and .gitignore', 0
            WHERE NOT EXISTS (SELECT 1 FROM cards);

            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 2, 1, 'Design database schema', 'Define tables for users, boards, columns, and cards', 1
            WHERE NOT EXISTS (SELECT 1 FROM cards WHERE id != 1);

            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 3, 1, 'Write API documentation', 'Document all REST endpoints with request/response examples', 2
            WHERE NOT EXISTS (SELECT 1 FROM cards WHERE id NOT IN (1, 2));

            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 4, 2, 'Build login page', 'JWT-based auth with username and password fields', 0
            WHERE NOT EXISTS (SELECT 1 FROM cards WHERE id = 4);

            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 5, 2, 'Implement drag and drop', 'Use HTML5 drag events to move cards between columns', 1
            WHERE NOT EXISTS (SELECT 1 FROM cards WHERE id = 5);

            INSERT OR IGNORE INTO cards (id, column_id, title, description, position)
            SELECT 6, 3, 'Docker containerisation', 'Dockerfile with uv, runs on port 8000', 0
            WHERE NOT EXISTS (SELECT 1 FROM cards WHERE id = 6);
        """)
    conn.close()
