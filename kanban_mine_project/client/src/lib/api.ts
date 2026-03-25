function getToken(): string | null {
  return localStorage.getItem("kanban_token");
}

export function setToken(token: string) {
  localStorage.setItem("kanban_token", token);
}

export function clearToken() {
  localStorage.removeItem("kanban_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface Card {
  id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
}

export interface Column {
  id: number;
  name: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: number;
  name: string;
  columns: Column[];
}

export interface AIResponse {
  chat_response: string;
  board_update: {
    action: string;
    card_id?: number;
    column_id?: number;
    title?: string;
    description?: string;
    position?: number;
  } | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const api = {
  login(username: string, password: string): Promise<TokenResponse> {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  getBoard(): Promise<Board> {
    return request("/api/board");
  },

  createCard(data: { column_id: number; title: string; description?: string; position?: number }): Promise<Card> {
    return request("/api/cards", { method: "POST", body: JSON.stringify(data) });
  },

  updateCard(id: number, data: Partial<Pick<Card, "column_id" | "title" | "description" | "position">>): Promise<Card> {
    return request(`/api/cards/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  deleteCard(id: number): Promise<void> {
    return request(`/api/cards/${id}`, { method: "DELETE" });
  },

  updateColumn(id: number, data: { name?: string; position?: number }): Promise<unknown> {
    return request(`/api/columns/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },

  chat(message: string): Promise<AIResponse> {
    return request("/api/chat", { method: "POST", body: JSON.stringify({ message }) });
  },
};
