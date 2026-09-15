import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { base64, mimeType } = await request.json();

  const interaction = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      {
        text: `Analyze the food image and identify only the ingredients or food items that are visibly present.

Return only Markdown without a code block. Start with this exact sentence:
Here's a breakdown of the items visible in the image:

Group the detected items using this nested-list format:
- **Vegetables:**
    - Item name
- **Proteins:**
    - Item name
- **Fruits:**
    - Item name
- **Grains/Seeds:**
    - Item name
- **Snacks/Treats:**
    - Item name
- **Dairy:**
    - Item name
- **Sauces/Condiments:**
    - Item name
- **Other:**
    - Item name

Rules:
- Omit categories with no detected items.
- List each visible item only once.
- Do not include a food name, recipe, nutrition estimate, or preparation instructions.
- Do not invent hidden ingredients. If an item is uncertain, add a short clarification in parentheses.
- Keep item names concise.`,
      },
    ],
  });

  return NextResponse.json({ text: interaction.text ?? "" });
}
