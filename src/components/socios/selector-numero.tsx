"use client";

import { cn } from "@/lib/utils";
import { listarNumerosPolla } from "@/modules/polla/domain/numero-polla";

type SelectorNumeroProps = {
  valor: string;
  onCambio: (numero: string) => void;
  /** Número → nombre del socio que lo tiene. */
  ocupados: Record<string, string>;
  numeroActual?: string | null;
};

export function SelectorNumero({ valor, onCambio, ocupados, numeroActual }: SelectorNumeroProps) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {listarNumerosPolla().map((numero) => {
        const dueno = ocupados[numero];
        const esPropio = numeroActual === numero;
        const ocupado = Boolean(dueno) && !esPropio;
        const seleccionado = valor === numero;

        return (
          <button
            key={numero}
            type="button"
            disabled={ocupado}
            aria-pressed={seleccionado}
            aria-label={
              ocupado ? `Número ${numero}, ocupado por ${dueno}` : `Elegir el número ${numero}`
            }
            title={ocupado ? `${numero} · ${dueno}` : numero}
            onClick={() => onCambio(numero)}
            className={cn(
              "money flex h-8 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors",
              ocupado && "cursor-not-allowed border-border/60 bg-muted/60 text-muted-foreground/50",
              !ocupado &&
                !seleccionado &&
                "border-border bg-background hover:border-primary/50 hover:bg-primary/10",
              seleccionado && "border-primary bg-primary text-primary-foreground",
              esPropio && !seleccionado && "border-secondary/50 bg-secondary/10",
            )}
          >
            {numero}
          </button>
        );
      })}
    </div>
  );
}
