import { InferenceClient } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const client = new InferenceClient(process.env.HF_TOKEN);

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  const dataUrl = await client.textToImage(
    {
      provider: "fal-ai",
      model: "black-forest-labs/Flux.1-dev",
      inputs: prompt,
    },
    {
      outputType: "dataUrl",
    },
  );

  return NextResponse.json({ imageUrl: dataUrl });
}
