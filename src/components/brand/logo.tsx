import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
};

export function Logo({ variant = "dark", compact = false, className }: LogoProps) {
  const light = variant === "light";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          light ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <Sprout className="size-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-lg font-semibold tracking-tight",
              light ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            Natillera
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-medium uppercase tracking-[0.18em]",
              light ? "text-sidebar-foreground/60" : "text-muted-foreground",
            )}
          >
            Ahorro comunitario
          </span>
        </span>
      )}
    </div>
  );
}
