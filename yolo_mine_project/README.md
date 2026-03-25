# Devansh Raina — AI-Powered Portfolio

A full-stack personal portfolio website with an integrated AI chat widget that acts as a digital twin, answering questions about skills, experience, and projects in real time.

---

## What It Is

An interactive portfolio and resume website built for Devansh Raina (Data Engineer / AI Developer at Whilter.AI). The site features:

- **Animated landing page** — Hero section with rotating job titles, floating gradient orbs that react to mouse movement, skills breakdown, experience timeline, and project showcase
- **AI Chat Widget** — A floating chat interface powered by OpenRouter (GPT-4o mini) that acts as an AI digital twin, answering visitor questions strictly about professional background, skills, and projects
- **Portfolio Download** — A `/download` endpoint that packages and delivers the full project as a `.tar.gz` archive
- **Dark / Light theme** — System-aware theming with manual toggle

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | Wouter |
| Animations | Framer Motion |
| Styling | Tailwind CSS + Radix UI + Shadcn/ui |
| State / Data fetching | TanStack React Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React, React Icons |
| Build tool | Vite |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Language | TypeScript (via tsx / esbuild) |
| AI API | OpenRouter (`openai/gpt-4o-mini`) |
| Database ORM | Drizzle ORM + PostgreSQL |
| Validation | Zod |
| Sessions | express-session + Passport |

---

## Project Structure

```
yolo_mine_project/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # UI components (Hero, About, ChatWidget, etc.)
│       ├── pages/           # Route pages
│       ├── lib/             # resumeData.ts, queryClient, utils
│       └── hooks/
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes (/api/chat, /download)
│   ├── storage.ts           # In-memory storage
│   └── vite.ts              # Vite dev-server integration
├── shared/
│   └── schema.ts            # Shared Zod schemas
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── package.json
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
DATABASE_URL=postgresql://user:password@host:5432/dbname   # optional, for DB features
PORT=5002                                                   # optional, defaults to 5002
```

> Without `OPENROUTER_API_KEY`, the chat widget gracefully degrades with a fallback message.

---

## How to Run

### Prerequisites
- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Development (with hot reload)

```bash
npm run dev
```

Starts the Express server + Vite dev server at `http://localhost:5002`.

### Production build

```bash
npm run build
npm start
```

Builds the React app into `dist/public` and serves it statically via Express.

### Database migrations (if using PostgreSQL)

```bash
npm run db:push
```

### Type check

```bash
npm run check
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message to the AI digital twin |
| `GET` | `/download` | Download the full portfolio project as `.tar.gz` |

### `/api/chat` — Request / Response

```json
// Request body
{
  "messages": [
    { "role": "user", "content": "What are your top skills?" }
  ]
}

// Response
{
  "message": "My top skills include..."
}
```

---

## Key Features in Detail

### AI Chat Widget
- Powered by **OpenRouter** (`openai/gpt-4o-mini`)
- System prompt constrains the model to respond only with information from `resumeData.ts` — no hallucination
- Includes starter prompt suggestions, typing indicator, and conversation history
- Max tokens: 400, Temperature: 0.7

### Animations
- Framer Motion drives all scroll-triggered animations, staggered list reveals, and the floating orb parallax effect
- Rotating hero text cycles through: *Data Engineer → Pipeline Architect → AI Developer → Systems Builder*

### Theme System
- Tailwind `darkMode: ["class"]` with CSS custom properties
- Managed via `next-themes` and a custom `ThemeProvider`
