"use client";

import { FileText, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResultPanel } from "./result-panel";
import { ToolHeader } from "./tool-header";
import Markdown from "react-markdown";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

type Status = "idle" | "loading" | "done";

export function ImageAnalysisTool() {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState("");

  function handleFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setStatus("idle");
  }

  const handleGenerate = async () => {
    if (!preview) return;
    const base64 = await fileToBase64(image!);
    try {
      setStatus("loading");
      const res = await fetch("/api/image-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType: image!.type }),
      });
      const { text } = await res.json();

      setResponse(text);
    } catch (error) {
      console.log("ERROR", error);
    }

    setStatus("done");
  };

  return (
    <div className="flex w-full flex-col">
      <ToolHeader
        icon={Sparkles}
        title="Image analysis"
        description="Upload a food photo, and AI will detect the ingredients."
        onReset={handleRemove}
        resetActive={status === "done"}
      />

      <div className="mt-2 flex w-full flex-col items-end gap-2">
        {preview ? (
          <div className="relative w-fit self-start rounded-lg border border-border p-1">
            <img
              src={preview}
              alt="Uploaded food"
              className="h-[133px] w-[200px] rounded-[6px] object-cover"
            />

            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove image"
              className="absolute bottom-2 right-2 flex size-6 items-center justify-center rounded-sm border border-border bg-background"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="font-medium text-foreground">Choose File</span>
            <span className="text-muted-foreground">JPG , PNG</span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        <Button
          disabled={!preview || status === "loading"}
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
          title="Here is the summary"
          filled={status === "done"}
          contentClassName="h-[259px] overflow-y-auto leading-6"
        >
          {status === "done" ? (
            <Markdown>{response}</Markdown>
          ) : (
            "First, enter your image to recognize an ingredients."
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
