import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION =
  "You are the assistant for a food AI app. The app lets users analyze a food photo, identify ingredients from a description, or generate a food image. Answer questions about food, ingredients, and the app's tools. Keep replies short and conversational.";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const interaction = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    contents: messages.map((message: { role: string; content: string }) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
  });

  return NextResponse.json({ text: interaction.text ?? "" });
}
