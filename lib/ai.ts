import type { GeneratedRecipe } from "@/types/recipe";

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

/** Sends a photo (data URL) to the vision model and returns detected ingredient names. */
export async function detectIngredients(imageDataUrl: string): Promise<string[]> {
  const res = await fetch("/api/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageDataUrl }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Failed to detect ingredients. Please try again."));
  }

  const data = await res.json();
  return Array.isArray(data.ingredients) ? data.ingredients : [];
}

/** Asks the AI to generate recipe ideas from a confirmed ingredient list. */
export async function generateRecipes(ingredients: string[]): Promise<GeneratedRecipe[]> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Failed to generate recipes. Please try again."));
  }

  const data = await res.json();
  const recipes = Array.isArray(data.recipes) ? data.recipes : [];
  return recipes.map((r: Omit<GeneratedRecipe, "id">) => ({
    ...r,
    id: crypto.randomUUID(),
  }));
}
