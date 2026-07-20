import { NextResponse } from "next/server";
import { getOpenAIClient, VISION_MODEL } from "@/lib/openai-server";

export const runtime = "nodejs";

const DETECT_PROMPT = `You are a helpful kitchen assistant. Look at this photo of a fridge or cupboard and identify every distinct food ingredient that is clearly visible.

Rules:
- Only list items you can actually see in the photo.
- Use short, plain ingredient names (e.g. "Eggs", "Milk", "Cheddar Cheese"), not brand names.
- Do not repeat the same ingredient twice.
- If nothing edible is visible, return an empty list.
- Return between 0 and 25 ingredients.`;

export async function POST(req: Request) {
  let image: string | undefined;
  try {
    const body = await req.json();
    image = body?.image;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "No image was provided." }, { status: 400 });
  }

  try {
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: VISION_MODEL,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: DETECT_PROMPT },
            { type: "input_image", image_url: image, detail: "auto" },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "detected_ingredients",
          schema: {
            type: "object",
            properties: {
              ingredients: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["ingredients"],
            additionalProperties: false,
          },
        },
      },
    });

    const parsed = JSON.parse(response.output_text);
    const ingredients: string[] = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];

    return NextResponse.json({ ingredients });
  } catch (err) {
    console.error("[/api/detect]", err);
    const message =
      err instanceof Error && err.message.includes("OPENAI_API_KEY")
        ? err.message
        : "We couldn't analyze that photo. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
