import { useState } from "react";
import type { Card } from "@/lib/api";
import { api } from "@/lib/api";

interface Props {
  card: Card;
  accentColor?: string;
  onUpdated: (card: Card) => void;
  onDeleted: (id: number) => void;
}

export default function KanbanCard({ card, accentColor = "#6366F1", onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("card_id", String(card.id));
    e.dataTransfer.setData("source_column_id", String(card.column_id));
  }

  async function handleSave() {
    if (!title.trim()) return;
    const updated = await api.updateCard(card.id, { title, description });
    onUpdated(updated);
    setEditing(false);
  }

  async function handleDelete() {
    await api.deleteCard(card.id);
    onDeleted(card.id);
  }

  if (editing) {
    return (
      <div
        className="animate-fade-in rounded-xl p-3 flex flex-col gap-2"
        style={{
          background: "hsl(var(--card))",
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 0 3px ${accentColor}18, var(--shadow-sm)`,
        }}
      >
        <input
          className="w-full text-sm font-semibold rounded-lg px-3 py-2 outline-none transition-all"
          style={{
            border: "1.5px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = accentColor;
            e.target.style.boxShadow = `0 0 0 2px ${accentColor}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "hsl(var(--border))";
            e.target.style.boxShadow = "none";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setTitle(card.title); setDescription(card.description); setEditing(false); }
          }}
          autoFocus
          placeholder="Card title..."
          data-testid="input-card-title"
        />
        <textarea
          className="w-full text-xs rounded-lg px-3 py-2 outline-none resize-none transition-all font-sans"
          style={{
            border: "1.5px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--muted-foreground))",
          }}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = accentColor;
            e.target.style.boxShadow = `0 0 0 2px ${accentColor}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "hsl(var(--border))";
            e.target.style.boxShadow = "none";
          }}
          placeholder="Description..."
          data-testid="textarea-card-description"
        />
        <div className="flex gap-1.5">
          <button
            onClick={handleSave}
            className="flex-1 text-xs font-semibold text-white rounded-lg py-1.5 transition-opacity"
            style={{ background: accentColor }}
            data-testid="button-save-card"
          >
            Save
          </button>
          <button
            onClick={() => { setTitle(card.title); setDescription(card.description); setEditing(false); }}
            className="text-xs font-medium rounded-lg py-1.5 px-3 transition-colors"
            style={{
              border: "1.5px solid hsl(var(--border))",
              background: "hsl(var(--background))",
              color: "hsl(var(--muted-foreground))",
            }}
            data-testid="button-cancel-edit"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div
        className="animate-fade-in rounded-xl p-3 flex flex-col gap-2"
        style={{
          background: "hsl(var(--destructive) / 0.06)",
          border: "1.5px solid hsl(var(--destructive) / 0.3)",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "hsl(var(--destructive))" }}>
          Delete this card?
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--destructive) / 0.8)" }}>
          &ldquo;{card.title}&rdquo; will be permanently removed.
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={handleDelete}
            className="flex-1 text-xs font-semibold text-white rounded-lg py-1.5 transition-opacity"
            style={{ background: "hsl(var(--destructive))" }}
            data-testid="button-confirm-delete"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-xs font-medium rounded-lg py-1.5 px-3 transition-colors"
            style={{
              border: "1.5px solid hsl(var(--border))",
              background: "hsl(var(--background))",
              color: "hsl(var(--muted-foreground))",
            }}
            data-testid="button-cancel-delete"
          >
            Keep
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all select-none"
      style={{
        background: "hsl(var(--card))",
        border: hovered
          ? `1.5px solid ${accentColor}60`
          : "1.5px solid hsl(var(--card-border))",
        borderLeft: hovered
          ? `3px solid ${accentColor}`
          : "1.5px solid hsl(var(--card-border))",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      data-testid={`card-item-${card.id}`}
    >
      <p className="text-sm font-semibold leading-snug" style={{ color: "hsl(var(--foreground))" }}>
        {card.title}
      </p>

      {card.description && (
        <p
          className="text-xs mt-1 leading-relaxed line-clamp-2"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {card.description}
        </p>
      )}

      <div
        className="flex gap-1 mt-2 transition-all"
        style={{ visibility: hovered ? "visible" : "hidden" }}
      >
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-xs font-medium rounded-md px-2 py-1 transition-all"
          style={{
            border: "1.5px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--muted-foreground))",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
            (e.currentTarget as HTMLButtonElement).style.color = accentColor;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
            (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
          }}
          data-testid={`button-edit-card-${card.id}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1 text-xs font-medium rounded-md px-2 py-1 transition-all"
          style={{
            border: "1.5px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--muted-foreground))",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--destructive) / 0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--destructive))";
            (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--destructive) / 0.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
            (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
            (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--background))";
          }}
          data-testid={`button-delete-card-${card.id}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
