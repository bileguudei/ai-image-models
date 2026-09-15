"use client";

import { GoogleGenAI } from "@google/genai";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ResultPanel } from "./result-panel";
import { ToolHeader } from "./tool-header";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

type Status = "idle" | "loading" | "done";

export function IngredientRecognitionTool() {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState("");

  function handleReset() {
    setDescription("");
    setStatus("idle");
    setResult("");
  }

  async function handleGenerate() {
    if (!description.trim()) return;

    try {
      setStatus("loading");

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

      setResult(interaction.text ?? "");
    } catch (error) {
      console.log("ERROR", error);
    }

    setStatus("done");
  }

  return (
    <div className="flex w-full flex-col">
      <ToolHeader
        icon={Sparkles}
        title="Ingredient recognition"
        description="Describe the food, and AI will detect the ingredients."
        onReset={handleReset}
        resetActive={status === "done"}
      />

      <div className="mt-2 flex w-full flex-col items-end gap-2">
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Орц тодорхойлох"
          className="min-h-32 w-full rounded-md border-input bg-background px-3 py-2 text-sm"
        />
        <Button
          disabled={!description.trim() || status === "loading"}
          onClick={handleGenerate}
          className={cn(
            "h-10 rounded-md px-4 py-2",
            status === "done" && "opacity-50",
          )}
        >
          {status === "loading" ? "Generating…" : "Generate"}
        </Button>
      </div>

      <div className="mt-6">
        <ResultPanel
          icon={FileText}
          title="Identified Ingredients"
          filled={status === "done"}
        >
          {status === "done" ? (
            <Markdown>{result}</Markdown>
          ) : (
            "First, enter your text to recognize an ingredients."
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
