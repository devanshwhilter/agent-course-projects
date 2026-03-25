# Kanban MVP

A full-stack Kanban board application with an AI assistant that can understand and modify your board through natural language chat.

## What It Does

- **Kanban Board**: Manage tasks across columns (To Do, In Progress, Done) — create, move, update, and delete cards
- **AI Chat Assistant**: Chat with an AI that has full context of your board and can perform operations (add cards, move them, rename, delete) based on your instructions
- **Authentication**: JWT-based login to protect your board

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query |
| Backend | FastAPI (Python), SQLite |
| Proxy Server | Express.js (Node.js) |
| AI | OpenRouter API (default: `openai/gpt-4o-mini`) |

## Project Structure

```
kanban_mine_project/
├── client/          # React frontend (Vite)
├── backend/         # FastAPI Python backend
│   ├── routers/     # auth, board, cards, columns, ai
│   ├── db/          # SQLite init & connection
│   └── auth_utils.py
├── server/          # Express.js proxy server
├── shared/          # Shared TypeScript schemas
└── data/            # SQLite database file
```

## Setup

### Prerequisites

- Node.js 20+
- Python 3.9+
- An [OpenRouter](https://openrouter.ai) API key

### 1. Install Node dependencies

```bash
npm install
```

### 2. Install Python dependencies

```bash
cd backend
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] httpx pydantic
```

### 3. Set environment variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Optional overrides:

```env
KANBAN_API_URL=http://localhost:8000   # Backend URL
PORT=5005                               # Express server port
DB_PATH=data/kanban.db                 # SQLite database path
JWT_SECRET=change-me-in-production     # JWT signing secret
OPENROUTER_MODEL=openai/gpt-4o-mini    # LLM model
```

## Running the App

### Start the backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Start the frontend + proxy server (in a separate terminal)

```bash
npm run dev
```

The app will be available at `http://localhost:5005`.

### Default login credentials

```
Username: user
Password: password
```

## Other Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build frontend + Express server for production |
| `npm start` | Run the production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema to PostgreSQL (Drizzle ORM) |

## API Endpoints

All requests go through the Express proxy on port 5005, which forwards to the FastAPI backend on port 8000.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login — returns JWT token |
| GET | `/api/board` | Fetch board with all columns and cards |
| POST | `/api/cards` | Create a card |
| PATCH | `/api/cards/:id` | Update a card (title, description, column) |
| DELETE | `/api/cards/:id` | Delete a card |
| PUT | `/api/columns/:id` | Rename a column |
| POST | `/api/chat` | Send a message to the AI assistant |
| GET | `/api/health` | Health check |

## How the AI Works

When you send a message via the chat sidebar:

1. The backend fetches your current board state (all columns and cards)
2. It sends the board state + your message to OpenRouter as context
3. The AI responds in natural language and optionally returns a structured `board_update` action
4. The frontend applies the board update (create/move/delete card) and refreshes the board

## Database Schema

SQLite tables initialized automatically on first run:

- **users** — `id`, `username`, `password`
- **boards** — `id`, `name`, `owner`
- **columns** — `id`, `board_id`, `name`, `position`
- **cards** — `id`, `column_id`, `title`, `description`, `position`

Default data (seeded on first run): 1 user, 1 board, 3 columns, and 6 sample cards.
