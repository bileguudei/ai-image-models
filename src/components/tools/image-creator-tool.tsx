"use client";

import { Image as ImageIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResultPanel } from "./result-panel";
import { ToolHeader } from "./tool-header";

type Status = "idle" | "loading" | "done";

export function ImageCreatorTool() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [imageUrl, setImageUrl] = useState("");

  function handleReset() {
    setValue("");
    setStatus("idle");
  }

  async function handleGenerate() {
    if (!value.trim()) return;
    setStatus("loading");
    const res = await fetch("/api/image-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: value }),
    });
    const { imageUrl } = await res.json();
    setImageUrl(imageUrl);
    setStatus("done");
  }

  return (
    <div className="flex w-full flex-col">
      <ToolHeader
        icon={Sparkles}
        title="Food image creator"
        description="What food image do you want? Describe it briefly."
        onReset={handleReset}
      />

      <div className="mt-2 flex w-full flex-col items-end gap-2">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Хоолны тайлбар"
          className="min-h-32 w-full rounded-md border-input bg-background px-3 py-2 text-sm"
        />
        <Button
          disabled={!value.trim() || status === "loading" || status === "done"}
          onClick={handleGenerate}
          className="h-10 rounded-md px-4 py-2"
        >
          {status === "loading" ? "Generating…" : "Generate"}
        </Button>
      </div>

      <div className="mt-6">
        <ResultPanel icon={ImageIcon} title="Result" filled={status === "done"}>
          {status === "done" ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {value}
              </span>
              <img src={imageUrl} alt="" className="w-96 rounded-lg border" />
            </div>
          ) : (
            "First, enter your text to generate an image."
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
