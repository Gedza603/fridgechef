import { NextResponse } from "next/server";
import { getOpenAIClient, TEXT_MODEL } from "@/lib/openai-server";

export const runtime = "nodejs";

const RECIPE_SCHEMA = {
  type: "object",
  properties: {
    recipes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          ingredients: { type: "array", items: { type: "string" } },
          instructions: { type: "array", items: { type: "string" } },
          cookingTime: { type: "string" },
          difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
        },
        required: ["title", "description", "ingredients", "instructions", "cookingTime", "difficulty"],
        additionalProperties: false,
      },
    },
  },
  required: ["recipes"],
  additionalProperties: false,
} as const;

function buildPrompt(ingredients: string[]): string {
  return `You are a practical home-cooking assistant. Here is a list of ingredients the user currently has available:

${ingredients.map((i) => `- ${i}`).join("\n")}

Generate between 5 and 10 realistic, simple recipe ideas using mainly these ingredients.

Rules:
- Do not invent ingredients the user doesn't have, unless they are common pantry staples (salt, pepper, oil, water, flour, sugar) - if you use one of those, mention it in the ingredients list as "(pantry staple)".
- Prefer simple, quick, realistic home meals over elaborate restaurant dishes.
- Each recipe needs: a title, a one or two sentence description, the list of ingredients it uses (from the provided list plus any pantry staples), clear step-by-step cooking instructions, an estimated total cooking time (e.g. "20 minutes"), and a difficulty of Easy, Medium, or Hard.
- Vary the recipes so they are not too similar to each other.
- Return only recipes that can reasonably be made from the given ingredients.`;
}

export async function POST(req: Request) {
  let ingredients: string[] | undefined;
  try {
    const body = await req.json();
    ingredients = body?.ingredients;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return NextResponse.json({ error: "No ingredients were provided." }, { status: 400 });
  }

  try {
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: TEXT_MODEL,
      input: buildPrompt(ingredients),
      text: {
        format: {
          type: "json_schema",
          name: "recipe_suggestions",
          schema: RECIPE_SCHEMA,
        },
      },
    });

    const parsed = JSON.parse(response.output_text);
    const recipes = Array.isArray(parsed.recipes) ? parsed.recipes : [];

    return NextResponse.json({ recipes });
  } catch (err) {
    console.error("[/api/recipes]", err);
    const message =
      err instanceof Error && err.message.includes("OPENAI_API_KEY")
        ? err.message
        : "We couldn't generate recipes right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
