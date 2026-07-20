"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useScans } from "@/hooks/useScans";
import { useRecipes } from "@/hooks/useRecipes";
import { ScanCard } from "@/components/ScanCard";
import { RecipeCard } from "@/components/RecipeCard";
import { EmptyState } from "@/components/EmptyState";
import type { Scan } from "@/types/scan";
import type { Recipe } from "@/types/recipe";

function matches(query: string, name: string, ingredients: string[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return name.toLowerCase().includes(q) || ingredients.some((i) => i.toLowerCase().includes(q));
}

export default function Home() {
  const { scans, isLoaded: scansLoaded } = useScans();
  const { recipes, isLoaded: recipesLoaded } = useRecipes();
  const [query, setQuery] = useState("");

  const filteredScans = useMemo(
    () => scans.filter((s: Scan) => matches(query, s.name, s.ingredients)),
    [scans, query]
  );
  const filteredRecipes = useMemo(
    () => recipes.filter((r: Recipe) => matches(query, r.title, r.ingredients)),
    [recipes, query]
  );

  const hasAnyData = scans.length > 0 || recipes.length > 0;

  return (
    <div className="space-y-14">
      <section className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-14 text-center text-white shadow-lg sm:py-20">
        <span className="text-5xl" aria-hidden>
          🧊🍳
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">FridgeChef</h1>
        <p className="max-w-lg text-balance text-emerald-50">
          Snap a photo of your fridge or cupboard and discover meals you can cook right now with
          what you already have.
        </p>
        <Link
          href="/scan"
          className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Scan Fridge
        </Link>
      </section>

      {hasAnyData && (
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scans and recipes by name or ingredient…"
            className="w-full rounded-full border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-emerald-900/40"
          />
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Your ingredient scans</h2>
          {scans.length > 0 && (
            <Link href="/scan" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
              + New scan
            </Link>
          )}
        </div>

        {!scansLoaded ? null : scans.length === 0 ? (
          <EmptyState
            icon="📷"
            message="No scans yet. Take a picture of your fridge to get started."
            action={
              <Link
                href="/scan"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
              >
                Scan Fridge
              </Link>
            }
          />
        ) : filteredScans.length === 0 ? (
          <EmptyState icon="🔍" message={`No scans match "${query}".`} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Favourite recipes</h2>

        {!recipesLoaded ? null : recipes.length === 0 ? (
          <EmptyState icon="⭐" message="No favourite recipes yet." />
        ) : filteredRecipes.length === 0 ? (
          <EmptyState icon="🔍" message={`No recipes match "${query}".`} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} href={`/recipes/${recipe.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
