import type { Express } from "express";
import { createServer, type Server } from "http";

const KANBAN_BACKEND = process.env.KANBAN_API_URL || "http://localhost:8000";

async function proxyRequest(req: any, res: any, targetPath: string) {
  try {
    const url = `${KANBAN_BACKEND}${targetPath}`;
    const method = req.method;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization as string;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && method !== "DELETE" && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);

    res.status(response.status);

    if (response.status === 204) {
      return res.end();
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (error: any) {
    console.error("Proxy error:", error.message);
    res.status(503).json({
      message: "Kanban API unavailable. Please ensure the backend is running.",
      detail: error.message,
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/auth/login", (req, res) => proxyRequest(req, res, "/api/auth/login"));
  app.get("/api/board", (req, res) => proxyRequest(req, res, "/api/board"));
  app.post("/api/cards", (req, res) => proxyRequest(req, res, "/api/cards"));
  app.patch("/api/cards/:id", (req, res) => proxyRequest(req, res, `/api/cards/${req.params.id}`));
  app.delete("/api/cards/:id", (req, res) => proxyRequest(req, res, `/api/cards/${req.params.id}`));
  app.put("/api/columns/:id", (req, res) => proxyRequest(req, res, `/api/columns/${req.params.id}`));
  app.post("/api/chat", (req, res) => proxyRequest(req, res, "/api/chat"));
  app.get("/api/health", (req, res) => proxyRequest(req, res, "/api/health"));

  return httpServer;
}
