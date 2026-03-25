import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  onBoardUpdate: () => void;
}

const SUGGESTIONS = [
  "Add a card for writing unit tests",
  "Move card 1 to Done",
  "What cards are in progress?",
];

export default function ChatSidebar({ onBoardUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: res.chat_response }]);
      if (res.board_update) {
        onBoardUpdate();
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I ran into an error: ${String(e)}` },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <aside
      className="flex flex-col shrink-0 h-full"
      style={{
        width: "320px",
        background: "hsl(var(--card))",
        borderLeft: "1px solid hsl(var(--border))",
      }}
      data-testid="chat-sidebar"
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5 shrink-0"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(145deg, #6366F1, #7C3AED)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10" />
            <path d="M12 22A10 10 0 0 1 2 12" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
            AI Assistant
          </h2>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Kanban-aware · Always ready
          </p>
        </div>
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background: "#10B981",
            boxShadow: "0 0 0 2.5px rgba(16,185,129,0.2)",
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <p className="text-sm leading-relaxed mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
              Hi! I can help you manage your board. Try asking me to add, move, or update cards.
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs font-medium rounded-lg px-3 py-2 transition-all font-sans"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1.5px solid hsl(var(--border))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary))";
                    (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--primary))";
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary) / 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                    (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--card))";
                  }}
                >
                  <span style={{ opacity: 0.5, marginRight: "6px" }}>›</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex animate-fade-in"
            style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
          >
            {msg.role === "assistant" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                style={{ background: "linear-gradient(145deg, #6366F1, #7C3AED)" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              </div>
            )}
            <div
              className="text-sm leading-relaxed max-w-[82%] break-words"
              style={{
                padding: msg.role === "user" ? "9px 13px" : "10px 13px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                background: msg.role === "user"
                  ? "linear-gradient(145deg, #6366F1, #7C3AED)"
                  : "hsl(var(--background))",
                color: msg.role === "user" ? "#FFFFFF" : "hsl(var(--foreground))",
                border: msg.role === "user" ? "none" : "1.5px solid hsl(var(--border))",
                boxShadow: msg.role === "user"
                  ? "0 4px 12px rgba(99,102,241,0.3)"
                  : "var(--shadow-xs)",
              }}
              data-testid={`message-${msg.role}-${i}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(145deg, #6366F1, #7C3AED)" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
              style={{
                background: "hsl(var(--background))",
                border: "1.5px solid hsl(var(--border))",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        className="p-3 shrink-0"
        style={{ borderTop: "1px solid hsl(var(--border))" }}
      >
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            className="flex-1 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans"
            style={{
              border: "1.5px solid hsl(var(--border))",
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            }}
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            onFocus={(e) => {
              e.target.style.borderColor = "hsl(var(--primary))";
              e.target.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "hsl(var(--border))";
              e.target.style.boxShadow = "none";
            }}
            disabled={loading}
            data-testid="input-chat"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(145deg, #6366F1, #7C3AED)"
                : "hsl(var(--background))",
              border: `1.5px solid ${input.trim() && !loading ? "transparent" : "hsl(var(--border))"}`,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              boxShadow: input.trim() && !loading ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
            }}
            data-testid="button-send-chat"
          >
            {loading ? (
              <div
                className="animate-spin-slow"
                style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(99,102,241,0.3)",
                  borderTopColor: "#6366F1", borderRadius: "50%",
                }}
              />
            ) : (
              <svg
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? "white" : "hsl(var(--muted-foreground))"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "hsl(var(--muted-foreground) / 0.7)" }}>
          Press Enter to send
        </p>
      </div>
    </aside>
  );
}
