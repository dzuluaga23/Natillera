import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "olive" | "brown" | "clay";
  className?: string;
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-card text-foreground",
  olive: "bg-state-ontime text-state-ontime-foreground",
  brown: "bg-secondary text-secondary-foreground",
  clay: "bg-state-late text-state-late-foreground",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: StatCardProps) {
  const isNeutral = tone === "default";

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl p-4 ring-1",
        isNeutral ? "ring-border" : "ring-transparent",
        toneStyles[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.12em]",
            isNeutral ? "text-muted-foreground" : "opacity-80",
          )}
        >
          {label}
        </span>
        {Icon && <Icon className={cn("size-4", isNeutral ? "text-secondary" : "opacity-70")} />}
      </div>
      <span className="money font-heading text-2xl font-semibold tracking-tight">{value}</span>
      {hint && (
        <span className={cn("text-xs", isNeutral ? "text-muted-foreground" : "opacity-75")}>
          {hint}
        </span>
      )}
    </div>
  );
}
