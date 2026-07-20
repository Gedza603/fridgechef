"use client";

import { useState } from "react";
import { IngredientChip } from "@/components/IngredientChip";

interface IngredientEditorProps {
  ingredients: string[];
  onChange: (next: string[]) => void;
}

export function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const [draft, setDraft] = useState("");

  function addIngredient() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...ingredients, trimmed]);
    setDraft("");
  }

  function renameAt(index: number, next: string) {
    onChange(ingredients.map((ing, i) => (i === index ? next : ing)));
  }

  function removeAt(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {ingredients.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <IngredientChip
              key={`${ingredient}-${index}`}
              value={ingredient}
              onRename={(next) => renameAt(index, next)}
              onRemove={() => removeAt(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No ingredients yet — add one below.</p>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addIngredient();
            }
          }}
          placeholder="Add an ingredient…"
          className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-emerald-900/40"
        />
        <button
          type="button"
          onClick={addIngredient}
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Add
        </button>
      </div>
    </div>
  );
}
