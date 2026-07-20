import type { ReactNode } from "react";
import Link from "next/link";
import type { RecipeBase } from "@/types/recipe";
import { DifficultyBadge } from "@/components/DifficultyBadge";

interface RecipeCardProps {
  recipe: RecipeBase & { id: string };
  href?: string;
  actions?: ReactNode;
}

export function RecipeCard({ recipe, href, actions }: RecipeCardProps) {
  const body = (
    <div className="flex flex-1 flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{recipe.title}</h3>
        <DifficultyBadge difficulty={recipe.difficulty} />
      </div>
      <p className="line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400">{recipe.description}</p>
      <div className="mt-auto flex items-center gap-3 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1">⏱ {recipe.cookingTime}</span>
        <span className="inline-flex items-center gap-1">
          🥕 {recipe.ingredients.length} ingredient{recipe.ingredients.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {href ? (
        <Link href={href} className="flex flex-1 flex-col">
          {body}
        </Link>
      ) : (
        body
      )}
      {actions && (
        <div className="flex items-center gap-2 border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
          {actions}
        </div>
      )}
    </div>
  );
}
