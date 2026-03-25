import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STARTERS = [
  "What are your strongest technical skills?",
  "Tell me about your AI experience",
  "What projects have you shipped?",
  "Are you open to new opportunities?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[80%]">
      <div className="w-7 h-7 rounded-full bg-[var(--p-accent)]/20 border border-[var(--p-accent)]/30 flex items-center justify-center flex-shrink-0">
        <Bot size={13} className="text-[var(--p-accent)]" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--p-surface)] border border-[var(--p-border)]">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 bg-[var(--p-muted)] rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}
    >
      <div className="w-7 h-7 rounded-full bg-[var(--p-accent)]/20 border border-[var(--p-accent)]/30 flex items-center justify-center flex-shrink-0">
        {isUser ? (
          <User size={13} className="text-[var(--p-accent)]" />
        ) : (
          <Bot size={13} className="text-[var(--p-accent)]" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-[var(--p-accent)] text-white rounded-br-sm"
            : "bg-[var(--p-surface)] border border-[var(--p-border)] text-foreground rounded-bl-sm"
        )}
        data-testid={`chat-message-${message.id}`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hey there! I'm Devansh's AI Digital Twin. Ask me anything about his experience, skills, or what he's been building.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--p-accent)] text-white shadow-2xl flex items-center justify-center",
          open && "hidden"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 2 }}
        aria-label="Open AI chat"
        data-testid="button-open-chat"
        style={{ boxShadow: "0 0 30px rgba(129, 140, 248, 0.4)" }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          <MessageCircle size={22} />
        </motion.div>
        <span className="absolute inset-0 rounded-full border-2 border-[var(--p-accent)] animate-ping opacity-40" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] rounded-2xl border border-[var(--p-border)] bg-background shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 40px rgba(129, 140, 248, 0.1)" }}
            data-testid="chat-panel"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--p-border)] bg-[var(--p-surface)]/40 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--p-accent)] to-[var(--p-accent-2)] flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Digital Twin</p>
                  <p className="text-xs text-[var(--p-muted)]">Powered by AI · Always on</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-[var(--p-muted)] hover:text-foreground hover:bg-[var(--p-surface)] transition-colors"
                aria-label="Close chat"
                data-testid="button-close-chat"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 chat-container">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--p-border)] text-[var(--p-muted)] hover:border-[var(--p-accent)] hover:text-[var(--p-accent)] transition-all"
                    data-testid={`chat-starter-${s.slice(0, 10)}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="px-4 pb-4">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2 p-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]/40 focus-within:border-[var(--p-accent)]/60 transition-colors"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--p-muted)] px-2"
                  disabled={loading}
                  data-testid="input-chat"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg bg-[var(--p-accent)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--p-accent-2)] transition-colors"
                  aria-label="Send message"
                  data-testid="button-send-chat"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
