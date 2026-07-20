"use client";

import { useState } from "react";
import type { Recipe } from "@/types/recipe";
import { DifficultyBadge } from "@/components/DifficultyBadge";

interface RecipeDetailProps {
  recipe: Recipe;
  onNotesChange: (notes: string) => void;
}

/** Note: render with a `key={recipe.id}` prop so switching recipes resets the notes draft. */
export function RecipeDetail({ recipe, onNotesChange }: RecipeDetailProps) {
  const [notes, setNotes] = useState(recipe.notes);

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {recipe.title}
          </h1>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">{recipe.description}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span aria-hidden>⏱</span>
          {recipe.cookingTime}
        </div>
      </header>

      <section className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_2fr]">
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <span className="text-emerald-500" aria-hidden>
                  ✓
                </span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">Your notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onNotesChange(notes)}
          placeholder='e.g. "Use mozzarella instead"'
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-900/40"
        />
      </section>
    </article>
  );
}
