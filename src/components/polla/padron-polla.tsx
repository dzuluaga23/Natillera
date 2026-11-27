import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NumeroPollaEstado } from "@/modules/polla/queries";

type PadronPollaProps = {
  entradas: NumeroPollaEstado[];
  /** Número del socio que está mirando, para resaltarlo. */
  numeroPropio?: string | null;
};

export function PadronPolla({ entradas, numeroPropio }: PadronPollaProps) {
  const elegidos = entradas.filter((entrada) => entrada.socio !== null);
  const libres = entradas.length - elegidos.length;

  return (
    <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg font-semibold">Padrón 00–99</h3>
          <p className="text-xs text-muted-foreground">
            Cada socio elige su número; los demás quedan libres.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{elegidos.length} ocupados</Badge>
          <Badge variant="outline">{libres} libres</Badge>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {entradas.map((entrada) => {
          const ocupado = entrada.socio !== null;
          const propio = numeroPropio === entrada.numero;
          const primerNombre = entrada.socio?.split(" ")[0] ?? "Libre";

          return (
            <li key={entrada.numero}>
              <div
                title={
                  ocupado ? `${entrada.numero} · ${entrada.socio}` : `${entrada.numero} · libre`
                }
                className={cn(
                  "flex h-12 flex-col items-center justify-center rounded-lg border px-1 text-center",
                  ocupado
                    ? "border-primary/30 bg-primary/10"
                    : "border-dashed border-border bg-background/40",
                  propio && "ring-2 ring-secondary ring-offset-1 ring-offset-card",
                )}
              >
                <span className="sr-only">
                  {ocupado
                    ? `Número ${entrada.numero}, ${entrada.socio}`
                    : `Número ${entrada.numero}, libre`}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "money text-sm font-semibold leading-none",
                    ocupado ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {entrada.numero}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 w-full truncate text-[9px] leading-tight",
                    ocupado ? "text-foreground/70" : "text-muted-foreground/70",
                  )}
                >
                  {primerNombre}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-primary/30 bg-primary/10" />
          Ocupado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-dashed border-border bg-background/40" />
          Libre
        </span>
        {numeroPropio && (
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border-2 border-secondary" />
            Tu número
          </span>
        )}
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold">Números elegidos</h4>
        {elegidos.length === 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">Todavía nadie ha elegido un número.</p>
        ) : (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-muted/80 text-[11px] uppercase tracking-wide text-muted-foreground backdrop-blur">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Número
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Socio
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {elegidos.map((entrada) => (
                  <tr key={entrada.numero} className="border-t border-border/60">
                    <td className="money px-3 py-1.5 font-semibold">{entrada.numero}</td>
                    <td className="px-3 py-1.5">{entrada.socio}</td>
                    <td className="px-3 py-1.5">
                      <Badge variant={entrada.estado === "activo" ? "secondary" : "outline"}>
                        {entrada.estado === "activo" ? "Activo" : "Retirado"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
