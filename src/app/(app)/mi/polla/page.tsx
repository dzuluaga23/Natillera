import { and, eq, isNull } from "drizzle-orm";
import { CircleDollarSign, Info, Ticket, Users, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { PadronPolla } from "@/components/polla/padron-polla";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { configuracionPeriodo, periodoSocios } from "@/db/schema";
import { formatCOP, formatNumber } from "@/lib/money";
import { cargarPeriodoSeleccionado } from "@/lib/periodo-seleccionado";
import { requireSocio } from "@/lib/session";
import { TOTAL_NUMEROS_POLLA } from "@/modules/polla/domain/numero-polla";
import { cargarPadronPolla } from "@/modules/polla/queries";

export const metadata: Metadata = {
  title: "Polla general",
};

type MiPollaPageProps = {
  searchParams: Promise<{ periodo?: string }>;
};

export default async function MiPollaPage({ searchParams }: MiPollaPageProps) {
  const session = await requireSocio();
  const { periodo: periodoId } = await searchParams;
  const { periodo } = await cargarPeriodoSeleccionado(periodoId);

  const propia =
    periodo && session.user.socioId
      ? (
          await db
            .select({ numeroPolla: periodoSocios.numeroPolla })
            .from(periodoSocios)
            .where(
              and(
                eq(periodoSocios.periodoId, periodo.id),
                eq(periodoSocios.socioId, session.user.socioId),
                isNull(periodoSocios.deletedAt),
              ),
            )
            .limit(1)
        )[0]
      : undefined;

  const padron = periodo ? await cargarPadronPolla(periodo.id) : [];
  const elegidos = padron.filter((entrada) => entrada.socio !== null).length;
  const libres = TOTAL_NUMEROS_POLLA - elegidos;

  const [config] = periodo
    ? await db
        .select()
        .from(configuracionPeriodo)
        .where(eq(configuracionPeriodo.periodoId, periodo.id))
        .limit(1)
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Polla general"
        icon={CircleDollarSign}
        title="Los 100 números"
        description="El padrón del periodo va del 00 al 99. Cada socio elige su número y el resto queda libre; aquí ves quién tiene cada uno."
        actions={
          <Badge variant="outline" className="h-8 px-2.5">
            {periodo?.nombre ?? "Sin periodo"}
          </Badge>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tu número"
          value={propia?.numeroPolla ?? "—"}
          hint={propia ? "Resaltado en el padrón" : "El admin aún no te asigna uno"}
          icon={CircleDollarSign}
          tone="brown"
        />
        <StatCard
          label="Números ocupados"
          value={`${formatNumber(elegidos)} de ${TOTAL_NUMEROS_POLLA}`}
          hint={`${formatNumber(libres)} libres`}
          icon={Users}
          tone="olive"
        />
        <StatCard
          label="Números libres"
          value={formatNumber(libres)}
          hint="Disponibles para elegir"
          icon={Ticket}
        />
        <StatCard
          label="Valor de la polla"
          value={formatCOP(config?.valorPolla ?? 0)}
          hint="Aporte de cada número cada mes"
          icon={Wallet}
        />
      </div>

      {periodo ? (
        <div className="mt-6">
          <PadronPolla entradas={padron} numeroPropio={propia?.numeroPolla ?? null} />
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Los sorteos, ganadores y premios se publican en el Sprint 2. Tu número no cambia durante
            el periodo.
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-card p-6 text-center ring-1 ring-border">
          <Info className="mx-auto size-6 text-secondary" />
          <p className="mt-2 font-medium">Todavía no hay un periodo activo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cuando el administrador configure el periodo verás aquí los 100 números.
          </p>
        </div>
      )}
    </div>
  );
}
