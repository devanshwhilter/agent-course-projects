import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { isAuthenticated, clearToken } from "@/lib/api";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ChatSidebar from "@/components/kanban/ChatSidebar";

export default function BoardPage() {
  const [, setLocation] = useLocation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) setLocation("/login");
  }, [setLocation]);

  function handleLogout() {
    clearToken();
    setLocation("/login");
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "hsl(var(--background))" }}>
      <header
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          height: "56px",
          background: "#0F172A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(145deg, #6366F1, #7C3AED)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </div>
          <span
            className="text-base font-bold"
            style={{ color: "#F1F5F9", letterSpacing: "-0.2px" }}
          >
            Kanban
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(99,102,241,0.25)",
              color: "#A5B4FC",
              border: "1px solid rgba(99,102,241,0.4)",
            }}
          >
            MVP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 transition-all"
            style={{
              background: sidebarOpen ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.07)",
              color: sidebarOpen ? "#A5B4FC" : "#94A3B8",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = sidebarOpen
                ? "rgba(99,102,241,0.3)"
                : "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = sidebarOpen
                ? "rgba(99,102,241,0.2)"
                : "rgba(255,255,255,0.07)";
            }}
            data-testid="button-toggle-sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            AI Chat
          </button>

          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 transition-all"
            style={{
              background: "transparent",
              color: "#94A3B8",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
              (e.currentTarget as HTMLButtonElement).style.color = "#F87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
            }}
            data-testid="button-logout"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto min-w-0">
          <KanbanBoard refreshTrigger={refreshTrigger} />
        </main>
        {sidebarOpen && (
          <ChatSidebar onBoardUpdate={() => setRefreshTrigger((n) => n + 1)} />
        )}
      </div>
    </div>
  );
}
