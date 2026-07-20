import type { Scan } from "@/types/scan";
import type { Recipe } from "@/types/recipe";

const SCANS_KEY = "fridgechef:scans";
const RECIPES_KEY = "fridgechef:recipes";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

function sortByDateDesc<T extends { createdAt?: string; savedAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const bDate = b.createdAt ?? b.savedAt ?? "";
    const aDate = a.createdAt ?? a.savedAt ?? "";
    return bDate.localeCompare(aDate);
  });
}

// ---- Scans ----

export function getScans(): Scan[] {
  return sortByDateDesc(readList<Scan>(SCANS_KEY));
}

export function getScan(id: string): Scan | undefined {
  return readList<Scan>(SCANS_KEY).find((s) => s.id === id);
}

export function addScan(scan: Scan): void {
  const scans = readList<Scan>(SCANS_KEY);
  writeList(SCANS_KEY, [scan, ...scans]);
}

export function updateScan(id: string, updates: Partial<Omit<Scan, "id">>): void {
  const scans = readList<Scan>(SCANS_KEY).map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  writeList(SCANS_KEY, scans);
}

export function deleteScan(id: string): void {
  writeList(
    SCANS_KEY,
    readList<Scan>(SCANS_KEY).filter((s) => s.id !== id)
  );
}

// ---- Favourite recipes ----

export function getRecipes(): Recipe[] {
  return sortByDateDesc(readList<Recipe>(RECIPES_KEY));
}

export function getRecipe(id: string): Recipe | undefined {
  return readList<Recipe>(RECIPES_KEY).find((r) => r.id === id);
}

export function addRecipe(recipe: Recipe): void {
  const recipes = readList<Recipe>(RECIPES_KEY);
  writeList(RECIPES_KEY, [recipe, ...recipes]);
}

export function updateRecipe(id: string, updates: Partial<Omit<Recipe, "id">>): void {
  const recipes = readList<Recipe>(RECIPES_KEY).map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  writeList(RECIPES_KEY, recipes);
}

export function deleteRecipe(id: string): void {
  writeList(
    RECIPES_KEY,
    readList<Recipe>(RECIPES_KEY).filter((r) => r.id !== id)
  );
}

export function isRecipeSaved(title: string): boolean {
  return readList<Recipe>(RECIPES_KEY).some((r) => r.title === title);
}
