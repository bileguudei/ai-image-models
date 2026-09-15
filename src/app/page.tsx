import { ChatWidget } from "@/components/chat-widget";
import { ImageAnalysisTool } from "@/components/tools/image-analysis-tool";
import { ImageCreatorTool } from "@/components/tools/image-creator-tool";
import { IngredientRecognitionTool } from "@/components/tools/ingredient-recognition-tool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="h-14 shrink-0 border-b border-border px-12 py-4">
        <h1 className="text-base font-semibold text-foreground">AI tools</h1>
      </header>

      <main className="flex flex-1 justify-center px-6 py-6">
        <div className="w-full max-w-[580px]">
          <Tabs defaultValue="analysis" className="gap-0">
            <TabsList className="h-9! w-fit max-w-full justify-start overflow-x-auto rounded-lg bg-muted p-1">
              <TabsTrigger
                value="analysis"
                className="h-auto rounded-md border-0! px-3 py-1 text-sm font-medium opacity-50 after:hidden data-active:opacity-100"
              >
                Image analysis
              </TabsTrigger>
              <TabsTrigger
                value="recognition"
                className="h-auto rounded-md border-0! px-3 py-1 text-sm font-medium opacity-50 after:hidden data-active:opacity-100"
              >
                Ingredient recognition
              </TabsTrigger>
              <TabsTrigger
                value="creator"
                className="h-auto rounded-md border-0! px-3 py-1 text-sm font-medium opacity-50 after:hidden data-active:opacity-100"
              >
                Image creator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="mt-6">
              <ImageAnalysisTool />
            </TabsContent>
            <TabsContent value="recognition" className="mt-6">
              <IngredientRecognitionTool />
            </TabsContent>
            <TabsContent value="creator" className="mt-6">
              <ImageCreatorTool />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
