import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ResultPanel({
  icon: Icon,
  title,
  filled = false,
  contentClassName,
  children,
}: {
  icon: LucideIcon;
  title: string;
  filled?: boolean;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="size-6" />
        <h3 className="text-xl font-semibold leading-6 text-foreground">
          {title}
        </h3>
      </div>
      {filled ? (
        <div
          className={cn(
            "w-full rounded-lg border border-border p-4 text-sm text-foreground",
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">{children}</p>
      )}
    </div>
  );
}
