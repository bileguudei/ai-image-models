"use client";

import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ResultPanel } from "./result-panel";
import { ToolHeader } from "./tool-header";

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

      const response = await fetch("/api/ingredient-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const { text } = await response.json();

      setResult(text ?? "");
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
