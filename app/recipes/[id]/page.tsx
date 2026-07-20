"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeDetail } from "@/components/RecipeDetail";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { recipes, isLoaded, updateRecipe, deleteRecipe } = useRecipes();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const recipe = recipes.find((r) => r.id === params.id);

  if (!isLoaded) {
    return <LoadingSpinner label="Loading recipe…" size="lg" />;
  }

  if (!recipe) {
    return (
      <EmptyState
        icon="🔍"
        message="Recipe not found."
        action={
          <Link
            href="/"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
          >
            Back to Home
          </Link>
        }
      />
    );
  }

  function handleDelete() {
    if (!recipe) return;
    deleteRecipe(recipe.id);
    router.push("/");
  }

  async function handleShare() {
    if (!recipe) return;
    const text = [
      recipe.title,
      recipe.description,
      "",
      "Ingredients:",
      ...recipe.ingredients.map((i) => `- ${i}`),
      "",
      "Instructions:",
      ...recipe.instructions.map((s, i) => `${i + 1}. ${s}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access unavailable; silently ignore.
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {copied ? "Copied!" : "Copy recipe"}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete favourite
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <RecipeDetail
          key={recipe.id}
          recipe={recipe}
          onNotesChange={(notes) => updateRecipe(recipe.id, { notes })}
        />
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        title="Remove this favourite?"
        description="This recipe will be removed from your favourites. This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
