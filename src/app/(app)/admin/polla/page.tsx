import { and, eq, isNull } from "drizzle-orm";
import { CircleDollarSign, Info, Ticket, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { PadronPolla } from "@/components/polla/padron-polla";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { configuracionPeriodo, periodoSocios } from "@/db/schema";
import { formatCOP, formatNumber } from "@/lib/money";
import { cargarPeriodoSeleccionado } from "@/lib/periodo-seleccionado";
import { requireAdmin } from "@/lib/session";
import { TOTAL_NUMEROS_POLLA } from "@/modules/polla/domain/numero-polla";
import { cargarPadronPolla } from "@/modules/polla/queries";

export const metadata: Metadata = {
  title: "Polla",
};

type PollaPageProps = {
  searchParams: Promise<{ periodo?: string }>;
};

export default async function PollaAdminPage({ searchParams }: PollaPageProps) {
  await requireAdmin();
  const { periodo: periodoId } = await searchParams;
  const { periodo } = await cargarPeriodoSeleccionado(periodoId);

  const [config] = periodo
    ? await db
        .select()
        .from(configuracionPeriodo)
        .where(eq(configuracionPeriodo.periodoId, periodo.id))
        .limit(1)
    : [];

  const padron = periodo ? await cargarPadronPolla(periodo.id) : [];
  const elegidos = padron.filter((entrada) => entrada.socio !== null).length;
  const libres = TOTAL_NUMEROS_POLLA - elegidos;
  const valorPolla = config?.valorPolla ?? 0;

  const retirados = periodo
    ? (
        await db
          .select({ total: periodoSocios.id })
          .from(periodoSocios)
          .where(
            and(
              eq(periodoSocios.periodoId, periodo.id),
              eq(periodoSocios.estado, "retirado"),
              isNull(periodoSocios.deletedAt),
            ),
          )
      ).length
    : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Polla"
        icon={CircleDollarSign}
        title="Números y padrón"
        description="Cada socio elige un número del 00 al 99. No son consecutivos: el padrón completo tiene 100 casillas y solo se ocupan las que cada socio escoge."
        actions={
          <Badge variant="outline" className="h-8 px-2.5">
            {periodo?.nombre ?? "Sin periodo"}
          </Badge>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Números ocupados"
          value={`${formatNumber(elegidos)} de ${TOTAL_NUMEROS_POLLA}`}
          hint={`${formatNumber(libres)} libres para elegir`}
          icon={Users}
          tone="olive"
        />
        <StatCard
          label="Valor de la polla"
          value={formatCOP(valorPolla)}
          hint="Por número, cada mes"
          icon={CircleDollarSign}
          tone="brown"
        />
        <StatCard
          label="Recaudo mensual"
          value={formatCOP(valorPolla * elegidos)}
          hint="Si todos los números ocupados pagan"
          icon={Ticket}
        />
        <StatCard
          label="Socios retirados"
          value={formatNumber(retirados)}
          hint="Conservan su número, pero no participan"
          icon={Info}
        />
      </div>

      {periodo ? (
        <div className="mt-6">
          <PadronPolla entradas={padron} />
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Los sorteos, el número ganador y el reparto del premio se habilitan en el Sprint 2. Aquí
            ya vive el padrón real del periodo: los 100 números y quién eligió cada uno.
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-card p-6 text-center ring-1 ring-border">
          <Info className="mx-auto size-6 text-secondary" />
          <p className="mt-2 font-medium">Aún no hay periodos configurados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea un periodo en Configuración para asignar los números de polla.
          </p>
        </div>
      )}
    </div>
  );
}
