import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  const interaction = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Extract the ingredients explicitly mentioned in this food description:

${description}

Return only Markdown without a code block.

If the dish name is mentioned, start with:
Here's a quick summary of the ingredients you used for **Dish name**:

Otherwise start with:
Here's a quick summary of the ingredients mentioned:

Then return one bullet for each ingredient:
- **Ingredient name**

Rules:
- Do not add ingredients that are not mentioned in the description.
- List each ingredient only once.
- Keep ingredient names concise.
- Add a short clarification in parentheses only when it appears in the description.`,
  });

  return NextResponse.json({ text: interaction.text ?? "" });
}
