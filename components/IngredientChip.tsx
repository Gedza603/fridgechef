"use client";

import { useEffect, useRef, useState } from "react";

interface IngredientChipProps {
  value: string;
  onRename: (next: string) => void;
  onRemove: () => void;
}

export function IngredientChip({ value, onRename, onRemove }: IngredientChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onRename(trimmed);
    else setDraft(value);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setIsEditing(false);
          }
        }}
        className="rounded-full border border-emerald-400 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 outline-none ring-2 ring-emerald-200 dark:bg-zinc-900 dark:text-zinc-50"
      />
    );
  }

  return (
    <span className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-50 py-1.5 pl-3 pr-1.5 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="max-w-[12rem] truncate text-left"
        title="Click to rename"
      >
        {value}
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${value}`}
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-emerald-600 transition-colors hover:bg-emerald-200 hover:text-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
      >
        ×
      </button>
    </span>
  );
}
