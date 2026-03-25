import { useState } from "react";
import type { Card, Column } from "@/lib/api";
import { api } from "@/lib/api";
import KanbanCard from "./KanbanCard";

const COLUMN_COLORS = [
  { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)" },
  { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" },
  { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)" },
  { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
  { dot: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.35)" },
  { dot: "#06B6D4", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.35)" },
];

interface Props {
  column: Column;
  columnIndex: number;
  onCardMoved: (cardId: number, toColumnId: number, position: number) => void;
  onCardCreated: (card: Card) => void;
  onCardUpdated: (card: Card) => void;
  onCardDeleted: (cardId: number, columnId: number) => void;
  onColumnRenamed: (columnId: number, name: string) => void;
}

export default function KanbanColumn({
  column,
  columnIndex,
  onCardMoved,
  onCardCreated,
  onCardUpdated,
  onCardDeleted,
  onColumnRenamed,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [colName, setColName] = useState(column.name);
  const [addingCard, setAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const color = COLUMN_COLORS[columnIndex % COLUMN_COLORS.length];

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const cardId = Number(e.dataTransfer.getData("card_id"));
    if (!cardId) return;
    const position = column.cards.length;
    await api.updateCard(cardId, { column_id: column.id, position });
    onCardMoved(cardId, column.id, position);
  }

  async function handleRename() {
    if (colName.trim() === column.name) { setEditingName(false); return; }
    await api.updateColumn(column.id, { name: colName });
    onColumnRenamed(column.id, colName);
    setEditingName(false);
  }

  async function handleAddCard() {
    if (!newTitle.trim()) return;
    const card = await api.createCard({
      column_id: column.id,
      title: newTitle.trim(),
      description: newDescription.trim(),
      position: column.cards.length,
    });
    onCardCreated(card);
    setNewTitle("");
    setNewDescription("");
    setAddingCard(false);
  }

  return (
    <div
      className="flex flex-col shrink-0 rounded-2xl transition-all"
      style={{
        width: "288px",
        background: "hsl(var(--sidebar))",
        border: dragOver
          ? `2px solid ${color.dot}`
          : "1.5px solid hsl(var(--border))",
        boxShadow: dragOver ? `0 0 0 4px ${color.dot}18` : "none",
        maxHeight: "calc(100vh - 140px)",
      }}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      data-testid={`column-${column.id}`}
    >
      <div
        className="flex items-center gap-2 px-3.5 py-3"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      >
        <div
          className="shrink-0 rounded-full"
          style={{
            width: "8px", height: "8px",
            background: color.dot,
            boxShadow: `0 0 0 3px ${color.bg}`,
          }}
        />

        {editingName ? (
          <div className="flex gap-1.5 flex-1 items-center">
            <input
              className="flex-1 text-sm font-semibold rounded-md px-2 py-0.5 outline-none transition-all"
              style={{
                border: `1.5px solid ${color.dot}`,
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                boxShadow: `0 0 0 2.5px ${color.bg}`,
              }}
              value={colName}
              onChange={(e) => setColName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") { setColName(column.name); setEditingName(false); }
              }}
              autoFocus
              data-testid="input-column-name"
            />
            <button
              onClick={handleRename}
              className="text-xs font-semibold text-white rounded-md px-2.5 py-1 shrink-0"
              style={{ background: color.dot }}
              data-testid="button-save-column-name"
            >
              Save
            </button>
            <button
              onClick={() => { setColName(column.name); setEditingName(false); }}
              className="text-xs rounded-md px-1.5 py-1 shrink-0 transition-colors"
              style={{ color: "hsl(var(--muted-foreground))", background: "transparent" }}
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <h2
              className="flex-1 text-sm font-bold truncate cursor-pointer transition-colors"
              style={{ color: "hsl(var(--foreground))", letterSpacing: "-0.1px" }}
              onClick={() => setEditingName(true)}
              title="Click to rename"
              data-testid={`text-column-name-${column.id}`}
            >
              {column.name}
            </h2>
            <div
              className="shrink-0 text-xs font-bold rounded-full px-2 py-0.5"
              style={{
                background: color.bg,
                color: color.dot,
                border: `1px solid ${color.border}`,
              }}
              data-testid={`text-column-count-${column.id}`}
            >
              {column.cards.length}
            </div>
          </>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5"
        style={{ minHeight: "60px" }}
      >
        {column.cards.length === 0 && !addingCard && (
          <div
            className="flex items-center justify-center py-8 rounded-xl my-1"
            style={{
              border: "1.5px dashed hsl(var(--border))",
            }}
          >
            <p className="text-xs text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
              Drop cards here
            </p>
          </div>
        )}
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            accentColor={color.dot}
            onUpdated={onCardUpdated}
            onDeleted={(id) => onCardDeleted(id, column.id)}
          />
        ))}
      </div>

      <div className="px-2.5 pb-3 shrink-0">
        {addingCard ? (
          <div
            className="rounded-xl p-3 flex flex-col gap-2"
            style={{
              background: "hsl(var(--card))",
              border: `1.5px solid ${color.dot}`,
              boxShadow: `0 0 0 3px ${color.bg}`,
            }}
          >
            <input
              className="w-full text-sm font-medium rounded-lg px-2.5 py-2 outline-none transition-all font-sans"
              style={{
                border: "1.5px solid hsl(var(--border))",
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              }}
              placeholder="Card title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = color.dot;
                e.target.style.boxShadow = `0 0 0 2px ${color.bg}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "hsl(var(--border))";
                e.target.style.boxShadow = "none";
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
              autoFocus
              data-testid="input-new-card-title"
            />
            <textarea
              className="w-full text-xs rounded-lg px-2.5 py-2 outline-none resize-none font-sans transition-all"
              style={{
                border: "1.5px solid hsl(var(--border))",
                background: "hsl(var(--background))",
                color: "hsl(var(--muted-foreground))",
              }}
              placeholder="Description (optional)..."
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = color.dot;
                e.target.style.boxShadow = `0 0 0 2px ${color.bg}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "hsl(var(--border))";
                e.target.style.boxShadow = "none";
              }}
              data-testid="textarea-new-card-description"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleAddCard}
                className="flex-1 text-xs font-semibold text-white rounded-lg py-1.5 transition-opacity"
                style={{
                  background: newTitle.trim() ? color.dot : `${color.dot}70`,
                  cursor: newTitle.trim() ? "pointer" : "not-allowed",
                }}
                data-testid="button-add-card"
              >
                Add card
              </button>
              <button
                onClick={() => { setAddingCard(false); setNewTitle(""); setNewDescription(""); }}
                className="text-xs font-medium rounded-lg py-1.5 px-3 transition-colors"
                style={{
                  border: "1.5px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  color: "hsl(var(--muted-foreground))",
                }}
                data-testid="button-cancel-add-card"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full flex items-center gap-1.5 text-sm font-medium rounded-xl px-3 py-2 transition-all text-left"
            style={{
              background: "transparent",
              border: "none",
              color: "hsl(var(--muted-foreground))",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--background))";
              (e.currentTarget as HTMLButtonElement).style.color = color.dot;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
            }}
            data-testid={`button-add-card-${column.id}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add card
          </button>
        )}
      </div>
    </div>
  );
}
