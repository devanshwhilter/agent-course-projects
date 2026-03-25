import { useEffect, useState, useCallback } from "react";
import type { Board, Card } from "@/lib/api";
import { api } from "@/lib/api";
import KanbanColumn from "./KanbanColumn";

interface Props {
  onBoardLoaded?: () => void;
  refreshTrigger?: number;
}

export default function KanbanBoard({ onBoardLoaded, refreshTrigger }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    try {
      const data = await api.getBoard();
      setBoard(data);
      onBoardLoaded?.();
    } catch (e) {
      setError(String(e));
    }
  }, [onBoardLoaded]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard, refreshTrigger]);

  function handleCardMoved(cardId: number, toColumnId: number, position: number) {
    setBoard((prev) => {
      if (!prev) return prev;
      let movedCard: Card | undefined;
      const cols = prev.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => {
          if (c.id === cardId) { movedCard = c; return false; }
          return true;
        }),
      }));
      return {
        ...prev,
        columns: cols.map((col) =>
          col.id === toColumnId
            ? { ...col, cards: [...col.cards, { ...movedCard!, column_id: toColumnId, position }] }
            : col
        ),
      };
    });
  }

  function handleCardCreated(card: Card) {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === card.column_id ? { ...col, cards: [...col.cards, card] } : col
        ),
      };
    });
  }

  function handleCardUpdated(card: Card) {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((c) => (c.id === card.id ? card : c)),
        })),
      };
    });
  }

  function handleCardDeleted(cardId: number, columnId: number) {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col
        ),
      };
    });
  }

  function handleColumnRenamed(columnId: number, name: string) {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => (col.id === columnId ? { ...col, name } : col)),
      };
    });
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "hsl(var(--destructive) / 0.08)",
            border: "1.5px solid hsl(var(--destructive) / 0.25)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
            Unable to load board
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{error}</p>
        </div>
        <button
          onClick={loadBoard}
          className="text-sm font-semibold text-white rounded-lg px-4 py-2 transition-opacity hover:opacity-90"
          style={{ background: "hsl(var(--primary))", boxShadow: "var(--shadow-md)" }}
          data-testid="button-retry-load"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-7">
        <div
          className="h-7 w-48 rounded-lg mb-7"
          style={{ background: "hsl(var(--muted))", animation: "pulse 1.5s ease-in-out infinite" }}
        />
        <div className="flex gap-4 items-start">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl"
              style={{
                width: "288px",
                height: "320px",
                background: "hsl(var(--sidebar))",
                border: "1.5px solid hsl(var(--border))",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const totalCards = board.columns.reduce((s, c) => s + c.cards.length, 0);

  return (
    <div className="p-7 pb-6">
      <div className="flex items-baseline gap-3 mb-6">
        <h1
          className="text-xl font-bold"
          style={{ color: "hsl(var(--foreground))", letterSpacing: "-0.3px" }}
          data-testid="text-board-name"
        >
          {board.name}
        </h1>
        <span className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
          {totalCards} task{totalCards !== 1 ? "s" : ""} · {board.columns.length} columns
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {board.columns.map((col, index) => (
          <KanbanColumn
            key={col.id}
            column={col}
            columnIndex={index}
            onCardMoved={handleCardMoved}
            onCardCreated={handleCardCreated}
            onCardUpdated={handleCardUpdated}
            onCardDeleted={handleCardDeleted}
            onColumnRenamed={handleColumnRenamed}
          />
        ))}
      </div>
    </div>
  );
}
