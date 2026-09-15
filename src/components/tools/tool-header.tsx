import { type LucideIcon, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ToolHeader({
  icon: Icon,
  title,
  description,
  onReset,
  resetActive = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onReset: () => void;
  resetActive?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-6" />
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        <Button
          variant={resetActive ? "default" : "outline"}
          onClick={onReset}
          aria-label="Reset"
          className="h-10 w-12 rounded-md border-border p-0"
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
