"use client";

import { useCallback, useEffect, useState } from "react";
import type { Recipe } from "@/types/recipe";
import * as storage from "@/lib/storage";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setRecipes(storage.getRecipes());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Reads from localStorage (an external system) on mount to hydrate state safely.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addRecipe = useCallback(
    (recipe: Recipe) => {
      storage.addRecipe(recipe);
      refresh();
    },
    [refresh]
  );

  const updateRecipe = useCallback(
    (id: string, updates: Partial<Omit<Recipe, "id">>) => {
      storage.updateRecipe(id, updates);
      refresh();
    },
    [refresh]
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      storage.deleteRecipe(id);
      refresh();
    },
    [refresh]
  );

  const isSaved = useCallback(
    (title: string) => recipes.some((r) => r.title === title),
    [recipes]
  );

  return { recipes, isLoaded, addRecipe, updateRecipe, deleteRecipe, isSaved, refresh };
}
