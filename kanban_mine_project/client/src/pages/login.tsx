import { useState } from "react";
import { useLocation } from "wouter";
import { api, setToken, isAuthenticated } from "@/lib/api";
import { useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated()) setLocation("/board");
  }, [setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { access_token } = await api.login(username, password);
      setToken(access_token);
      setLocation("/board");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4f46e5 70%, #7c3aed 100%)",
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "-80px", left: "-80px", width: "400px", height: "400px",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "-120px", right: "-60px", width: "500px", height: "500px",
          background: "rgba(255,255,255,0.03)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "30%", right: "15%", width: "200px", height: "200px",
          background: "rgba(167,139,250,0.07)",
        }}
      />

      <div
        className="w-full relative z-10 animate-fade-in"
        style={{
          maxWidth: "440px",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "48px 44px",
          boxShadow: "0 30px 60px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center mb-9">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-5"
            style={{
              width: "56px", height: "56px",
              background: "linear-gradient(145deg, #6366F1, #7C3AED)",
              boxShadow: "0 8px 20px rgba(99,102,241,0.45)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold mb-1.5"
            style={{ color: "#0F172A", letterSpacing: "-0.4px" }}
          >
            Welcome back
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
            Sign in to access your Kanban board
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#374151", letterSpacing: "0.06em" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl text-sm outline-none transition-all"
              style={{
                padding: "11px 14px",
                border: "1.5px solid #E2E8F0",
                background: "#F8FAFC",
                color: "#0F172A",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366F1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
                e.target.style.background = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#F8FAFC";
              }}
              placeholder="e.g. user"
              required
              data-testid="input-username"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#374151", letterSpacing: "0.06em" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl text-sm outline-none transition-all"
              style={{
                padding: "11px 14px",
                border: "1.5px solid #E2E8F0",
                background: "#F8FAFC",
                color: "#0F172A",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366F1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
                e.target.style.background = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#F8FAFC";
              }}
              placeholder="••••••••"
              required
              data-testid="input-password"
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm animate-fade-in"
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all mt-1"
            style={{
              padding: "13px",
              background: loading
                ? "linear-gradient(145deg, #a5b4fc, #c4b5fd)"
                : "linear-gradient(145deg, #6366F1, #7C3AED)",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.4)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(99,102,241,0.4)";
              }
            }}
            data-testid="button-sign-in"
          >
            {loading ? (
              <>
                <div
                  className="animate-spin-slow"
                  style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white", borderRadius: "50%",
                  }}
                />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div
          className="flex items-center justify-center gap-2 mt-6 pt-5"
          style={{ borderTop: "1px solid #F1F5F9" }}
        >
          <span className="text-xs" style={{ color: "#94A3B8" }}>Default credentials:</span>
          <code
            className="text-xs px-2 py-0.5 rounded-md"
            style={{ background: "#F1F5F9", color: "#64748B" }}
          >
            user / password
          </code>
        </div>
      </div>
    </div>
  );
}
