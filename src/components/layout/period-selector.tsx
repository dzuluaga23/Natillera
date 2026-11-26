"use client";

import { CalendarRange } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export type PeriodoOpcion = {
  id: string;
  nombre: string;
  estado: string;
};

type PeriodSelectorProps = {
  periods: PeriodoOpcion[];
  selectedId?: string;
  className?: string;
  compact?: boolean;
};

export function PeriodSelector({ periods, selectedId, className, compact }: PeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activo = periods.find((periodo) => periodo.estado === "activo");
  const value = selectedId ?? activo?.id ?? periods[0]?.id ?? "";

  function cambiarPeriodo(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("periodo", id);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    });
  }

  if (periods.length === 0) {
    return <span className="text-xs text-muted-foreground">Sin periodos configurados</span>;
  }

  return (
    <label
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm shadow-[0_1px_2px_rgba(59,47,38,0.06)]",
        compact && "px-2 py-1",
        isPending && "opacity-70",
        className,
      )}
    >
      <CalendarRange className="size-4 text-secondary" />
      <span className="sr-only">Periodo</span>
      <select
        value={value}
        onChange={(event) => cambiarPeriodo(event.target.value)}
        className="max-w-[11rem] cursor-pointer appearance-none bg-transparent pr-1 text-sm font-medium text-foreground outline-none"
      >
        {periods.map((periodo) => (
          <option key={periodo.id} value={periodo.id}>
            {periodo.nombre}
          </option>
        ))}
      </select>
      <span
        className={cn(
          "ml-1 hidden rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline",
          value === activo?.id
            ? "bg-state-ontime text-state-ontime-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {value === activo?.id ? "Activo" : "Histórico"}
      </span>
    </label>
  );
}
