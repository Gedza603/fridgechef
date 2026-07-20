"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useScans } from "@/hooks/useScans";
import { useRecipes } from "@/hooks/useRecipes";
import { generateRecipes } from "@/lib/ai";
import { IngredientEditor } from "@/components/IngredientEditor";
import { RecipeCard } from "@/components/RecipeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import type { GeneratedRecipe } from "@/types/recipe";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ScanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { scans, isLoaded, updateScan, deleteScan } = useScans();
  const { recipes: favourites, addRecipe, deleteRecipe } = useRecipes();

  const scan = scans.find((s) => s.id === params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [ingredientsDraft, setIngredientsDraft] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  if (!isLoaded) {
    return <LoadingSpinner label="Loading scan…" size="lg" />;
  }

  if (!scan) {
    return (
      <EmptyState
        icon="🔍"
        message="Scan not found."
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

  function startEditing() {
    if (!scan) return;
    setNameDraft(scan.name);
    setIngredientsDraft(scan.ingredients);
    setIsEditing(true);
  }

  function saveEdits() {
    if (!scan) return;
    updateScan(scan.id, {
      name: nameDraft.trim() || scan.name,
      ingredients: ingredientsDraft,
    });
    setIsEditing(false);
  }

  async function handleGenerateRecipes() {
    if (!scan || scan.ingredients.length === 0) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const recipes = await generateRecipes(scan.ingredients);
      setGeneratedRecipes(recipes);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  function favouriteIdFor(title: string): string | undefined {
    return favourites.find((r) => r.title === title)?.id;
  }

  function toggleFavourite(recipe: GeneratedRecipe) {
    const existingId = favouriteIdFor(recipe.title);
    if (existingId) {
      deleteRecipe(existingId);
    } else {
      addRecipe({
        id: crypto.randomUUID(),
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        notes: "",
        savedAt: new Date().toISOString(),
      });
    }
  }

  function handleDelete() {
    if (!scan) return;
    deleteScan(scan.id);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element -- user-provided base64 data URL */}
        <img src={scan.image} alt={scan.name} className="max-h-96 w-full object-cover" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {isEditing ? (
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xl font-bold text-zinc-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          ) : (
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{scan.name}</h1>
          )}
          <p className="mt-1 text-sm text-zinc-400">Scanned {formatDate(scan.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveEdits}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEditing}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Edit ingredients
              </button>
              <button
                type="button"
                onClick={handleGenerateRecipes}
                disabled={isGenerating}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Generate Recipes
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Delete scan
              </button>
            </>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">Ingredients</h2>
        {isEditing ? (
          <IngredientEditor ingredients={ingredientsDraft} onChange={setIngredientsDraft} />
        ) : scan.ingredients.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No ingredients recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {scan.ingredients.map((ingredient, i) => (
              <span
                key={i}
                className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800"
              >
                {ingredient}
              </span>
            ))}
          </div>
        )}
      </section>

      {isGenerating && <LoadingSpinner label="Cooking up some ideas…" size="lg" />}

      {generateError && (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <p>{generateError}</p>
          <button
            type="button"
            onClick={handleGenerateRecipes}
            className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      )}

      {generatedRecipes && !isGenerating && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">Recipe ideas</h2>
          {generatedRecipes.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No recipes could be generated from these ingredients.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {generatedRecipes.map((recipe) => {
                const saved = Boolean(favouriteIdFor(recipe.title));
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    actions={
                      <button
                        type="button"
                        onClick={() => toggleFavourite(recipe)}
                        className={`w-full rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                          saved
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                        }`}
                      >
                        {saved ? "★ Saved to favourites" : "☆ Save as favourite"}
                      </button>
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        title="Delete this scan?"
        description="This will permanently remove the scan and its ingredient list. This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
