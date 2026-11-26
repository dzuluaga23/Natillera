import { and, desc, eq, isNull } from "drizzle-orm";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  HandCoins,
  Info,
  Scale,
  Ticket,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/common/link-button";
import { StatCard } from "@/components/common/stat-card";
import { socioNav } from "@/components/layout/nav-items";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { periodoSocios, periodos, socios } from "@/db/schema";
import { formatCOP } from "@/lib/money";
import { MESES_PERIODO } from "@/lib/periods";
import { requireSocio } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mi resumen",
};

type MiPageProps = {
  searchParams: Promise<{ periodo?: string }>;
};

export default async function MiPage({ searchParams }: MiPageProps) {
  const session = await requireSocio();
  const { periodo: periodoId } = await searchParams;

  const listaPeriodos = await db
    .select()
    .from(periodos)
    .where(isNull(periodos.deletedAt))
    .orderBy(desc(periodos.fechaInicio));

  const periodoActivo =
    listaPeriodos.find((periodo) => periodo.id === periodoId) ??
    listaPeriodos.find((periodo) => periodo.estado === "activo") ??
    listaPeriodos[0];

  const asignacion = session.user.socioId
    ? (
        await db
          .select({
            numeroPolla: periodoSocios.numeroPolla,
            cuotaAhorro: periodoSocios.cuotaAhorro,
            estado: periodoSocios.estado,
            nombre: socios.nombre,
          })
          .from(periodoSocios)
          .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
          .where(
            and(
              eq(periodoSocios.socioId, session.user.socioId),
              isNull(periodoSocios.deletedAt),
              periodoActivo ? eq(periodoSocios.periodoId, periodoActivo.id) : undefined,
            ),
          )
          .limit(1)
      )[0]
    : undefined;

  const modulos = socioNav.filter((item) => item.href !== "/mi");

  return (
    <div>
      <PageHeader
        eyebrow="Mi natillera"
        icon={Wallet}
        title={`Hola, ${session.user.name.split(" ")[0]}`}
        description={
          periodoActivo
            ? `Este es tu resumen del periodo ${periodoActivo.nombre}. Solo tú y los administradores pueden ver esta información.`
            : "Todavía no hay un periodo asignado a tu cuenta."
        }
        actions={
          <Badge variant="outline" className="hidden h-8 gap-1.5 px-2.5 sm:inline-flex">
            <CalendarDays className="size-3.5" />
            {periodoActivo?.nombre ?? "Sin periodo"}
          </Badge>
        }
      />

      {!asignacion ? (
        <div className="rounded-xl bg-card p-6 text-center ring-1 ring-border">
          <Info className="mx-auto size-6 text-secondary" />
          <p className="mt-2 font-medium">Tu cuenta aún no está vinculada a un socio del periodo</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Pídele al administrador que asocie tu usuario con tu registro de socio. Mientras tanto,
            puedes revisar la polla general.
          </p>
          <LinkButton href="/mi/polla" variant="outline" className="mt-4">
            Ver polla general
          </LinkButton>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Número de polla"
              value={asignacion.numeroPolla}
              hint={periodoActivo?.nombre ?? "Periodo actual"}
              icon={CircleDollarSign}
              tone="brown"
            />
            <StatCard
              label="Cuota mensual"
              value={formatCOP(asignacion.cuotaAhorro)}
              hint="Ahorro mensual asignado"
              icon={Wallet}
              tone="olive"
            />
            <StatCard
              label="Ahorro acumulado"
              value={formatCOP(0)}
              hint="Aún no hay pagos registrados"
              icon={Wallet}
            />
            <StatCard
              label="Mora acumulada"
              value={formatCOP(0)}
              hint="Sin cuotas vencidas"
              icon={Scale}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-semibold">Avance del periodo</h3>
                  <p className="text-xs text-muted-foreground">
                    12 cuotas de diciembre a noviembre
                  </p>
                </div>
                <span className="money text-sm font-medium">0 de 12 cuotas</span>
              </div>

              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={12}
                aria-valuenow={0}
                aria-label="Cuotas pagadas del periodo"
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full w-0 rounded-full bg-primary transition-all" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
                {MESES_PERIODO.map((mes) => (
                  <div
                    key={mes}
                    className={cn(
                      "rounded-lg border border-border bg-background/60 px-2 py-2 text-center",
                      mes === "Diciembre" && "border-primary/30 bg-primary/5",
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {mes.slice(0, 3)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-foreground/70">Pendiente</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Los pagos los registra el administrador. Si ves un valor distinto al que pagaste,
                escríbele para que lo corrija; todos los cambios quedan en auditoría.
              </div>
            </section>

            <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
              <h3 className="font-heading text-lg font-semibold">Tu estado</h3>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Socio</dt>
                  <dd className="truncate font-medium">{asignacion.nombre}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Estado</dt>
                  <dd>
                    <Badge variant="secondary">
                      {asignacion.estado === "activo" ? "Activo" : "Retirado"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Polla</dt>
                  <dd className="money font-medium">{asignacion.numeroPolla}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Cuota</dt>
                  <dd className="money font-medium">{formatCOP(asignacion.cuotaAhorro)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Periodo</dt>
                  <dd className="font-medium">{periodoActivo?.nombre ?? "—"}</dd>
                </div>
              </dl>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                Tu acceso es de solo lectura. Puedes consultar tus datos y la polla general.
              </p>
            </section>
          </div>

          <section className="mt-4">
            <h3 className="mb-2 font-heading text-lg font-semibold">Explora</h3>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {modulos.map(({ href, label, description, icon: Icon, soon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-start gap-3 rounded-xl bg-card p-3 ring-1 ring-border transition-colors hover:ring-primary/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{label}</span>
                      {soon && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Pronto
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 p-3 text-xs text-muted-foreground">
            <HandCoins className="size-4 text-secondary" />
            ¿Tienes un préstamo o una boleta de rifa? Los verás aquí cuando actives esos módulos.
            <Ticket className="ml-auto size-4 text-secondary" />
          </div>
        </>
      )}
    </div>
  );
}
