"use client";

import Link from "next/link";
import { useScans } from "@/hooks/useScans";
import { useRecipes } from "@/hooks/useRecipes";
import { ScanCard } from "@/components/ScanCard";
import { RecipeCard } from "@/components/RecipeCard";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { scans, isLoaded: scansLoaded } = useScans();
  const { recipes, isLoaded: recipesLoaded } = useRecipes();

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
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Favourite recipes</h2>

        {!recipesLoaded ? null : recipes.length === 0 ? (
          <EmptyState icon="⭐" message="No favourite recipes yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} href={`/recipes/${recipe.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
