import OpenAI from "openai";

/** Server-only helper. Never import this from client components. */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it to a .env.local file and restart the dev server."
    );
  }
  return new OpenAI({ apiKey });
}

export const VISION_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
export const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
