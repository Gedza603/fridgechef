export type Difficulty = "Easy" | "Medium" | "Hard";

export interface RecipeBase {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: Difficulty;
}

/** A recipe suggestion returned by the AI, not yet saved as a favourite. */
export interface GeneratedRecipe extends RecipeBase {
  id: string;
}

/** A recipe the user has saved as a favourite. */
export interface Recipe extends RecipeBase {
  id: string;
  notes: string;
  savedAt: string;
}
