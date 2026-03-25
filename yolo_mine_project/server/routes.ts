import type { Express } from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import path from "path";

const RESUME_SUMMARY = {
  name: "Devansh Raina",
  title: "Data Engineer & AI Developer",
  location: "Faridabad, India",
  email: "devansh.raina38@gmail.com",
  github: "https://github.com/devanshraina",
  linkedin: "https://linkedin.com/in/devanshraina",
  tagline: "I build data pipelines and AI systems that run in production — not just in notebooks.",
  summary: "Data engineer at Whilter.AI building pipelines for a real-time conversational AI platform. Engineered systems that process 1,000+ outputs per week, cut latency by 20%, and scaled throughput by 35%. Led migration from third-party APIs to self-hosted infrastructure.",
  skills: {
    ai: ["PyTorch", "TensorFlow", "Hugging Face Transformers", "XGBoost", "NLP"],
    languages: ["Python", "SQL", "C++"],
    data: ["ETL Pipelines", "Data Processing", "Data Modeling", "Data Warehousing"],
    databases: ["PostgreSQL", "MySQL"],
    infrastructure: ["AWS (S3)", "Docker"],
    tools: ["Pandas", "NumPy", "Git", "Streamlit", "Postman"],
  },
  experience: [
    {
      company: "Whilter.AI",
      role: "Data Engineer (Full Time)",
      period: "Jul 2025 — Present",
      achievements: [
        "Led migration from third-party API dependencies to self-hosted infrastructure",
        "Engineered modular streaming architecture for scalable multi-session orchestration",
        "Evaluated and integrated processing components to stabilize under concurrent load",
      ],
    },
    {
      company: "Whilter.AI",
      role: "Data Engineer (Internship)",
      period: "Jan 2025 — Jul 2025",
      achievements: [
        "Optimized pipelines achieving 35% higher throughput and 20% lower latency",
        "Deployed and monitored production pipelines",
        "Resolved runtime issues to maintain system uptime",
      ],
    },
  ],
  projects: [
    { name: "DataFlowKit", tech: ["Python", "SQL", "Pandas"], status: "Shipped" },
    { name: "AI Interview Mocker", tech: ["Python", "PostgreSQL", "NLP"], status: "Shipped" },
  ],
};

const SYSTEM_PROMPT = `You are Devansh Raina's AI Digital Twin — a professional, confident, and concise virtual representation.
You answer questions about Devansh's career, skills, experience, and projects based ONLY on the data below.
Do not invent, hallucinate, or guess. If asked about something not in the data, say you don't have that information available.
Be direct, professional, and slightly witty — reflect Devansh's personality.

Here is Devansh's complete professional data:
${JSON.stringify(RESUME_SUMMARY, null, 2)}

Rules:
- Stay in character as Devansh's professional digital twin
- Only discuss topics covered in the data above
- Keep responses concise (2-4 sentences max unless detail is specifically requested)
- Use first person ("I built...", "I led...")
- If asked personal questions not in the data, politely redirect to professional topics
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const validMessages = (messages as { role: string; content: string }[]).filter(
        (m) =>
          m &&
          typeof m.role === "string" &&
          typeof m.content === "string" &&
          (m.role === "user" || m.role === "assistant")
      );

      if (validMessages.length === 0) {
        return res.status(400).json({ error: "No valid messages" });
      }

      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        return res.json({
          message:
            "The AI Digital Twin isn't configured yet — but feel free to explore the portfolio above! To enable it, add your OPENROUTER_API_KEY to the environment secrets.",
        });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://devanshraina.dev",
          "X-Title": "Devansh Raina Portfolio",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...validMessages,
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.status}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const message =
        data.choices[0]?.message?.content ??
        "I'm sorry, I couldn't generate a response. Please try again.";

      return res.json({ message });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.json({
        message: "I'm having a bit of trouble right now. Please try again in a moment!",
      });
    }
  });

  app.get("/download", (req, res) => {
    const projectRoot = path.resolve(".");
    const filename = "portfolio_devansh_raina.tar.gz";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/gzip");

    const tar = spawn("tar", [
      "czf", "-",
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=.cache",
      "--exclude=dist",
      "--exclude=attached_assets",
      "client", "server", "shared", "public",
      "package.json", "tsconfig.json", "vite.config.ts",
      "tailwind.config.ts", "drizzle.config.ts", "index.html", "postcss.config.js"
    ], { cwd: projectRoot });

    tar.stdout.pipe(res);
    tar.stderr.on("data", (d) => console.error("tar error:", d.toString()));
    tar.on("error", (err) => {
      console.error("spawn error:", err);
      res.status(500).send("Failed to create archive");
    });
  });

  return httpServer;
}
