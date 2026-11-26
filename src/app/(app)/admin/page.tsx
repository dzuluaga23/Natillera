import { and, count, desc, eq, isNull, sql, sum } from "drizzle-orm";
import {
  ArrowRight,
  BellRing,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/common/stat-card";
import { adminNav } from "@/components/layout/nav-items";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { configuracionPeriodo, periodoSocios, periodos, user } from "@/db/schema";
import { formatCOP, formatNumber } from "@/lib/money";
import { formatFechaLarga } from "@/lib/periods";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "Panel administrador",
};

type AdminPageProps = {
  searchParams: Promise<{ periodo?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await requireAdmin();
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

  const [config] = periodoActivo
    ? await db
        .select()
        .from(configuracionPeriodo)
        .where(eq(configuracionPeriodo.periodoId, periodoActivo.id))
        .limit(1)
    : [];

  const [resumenSocios] = periodoActivo
    ? await db
        .select({
          socios: count(),
          cuotaTotal: sum(periodoSocios.cuotaAhorro),
        })
        .from(periodoSocios)
        .where(
          and(
            eq(periodoSocios.periodoId, periodoActivo.id),
            eq(periodoSocios.estado, "activo"),
            isNull(periodoSocios.deletedAt),
          ),
        )
    : [{ socios: 0, cuotaTotal: null }];

  const [resumenUsuarios] = await db
    .select({
      admins: sql<number>`count(*) filter (where ${user.role} = 'admin')`,
      sociosConCuenta: sql<number>`count(*) filter (where ${user.role} = 'socio')`,
    })
    .from(user)
    .where(isNull(user.deletedAt));

  const sociosActivos = Number(resumenSocios?.socios ?? 0);
  const cuotaTotal = Number(resumenSocios?.cuotaTotal ?? 0);
  const admins = Number(resumenUsuarios?.admins ?? 0);

  const modulos = adminNav.filter((item) => item.href !== "/admin");

  return (
    <div>
      <PageHeader
        eyebrow="Panel administrador"
        icon={ShieldCheck}
        title={`Hola, ${session.user.name.split(" ")[0]}`}
        description={
          periodoActivo
            ? `Periodo ${periodoActivo.nombre} · ${periodoActivo.estado === "activo" ? "en curso" : periodoActivo.estado}. Revisa el estado general y entra a cada módulo.`
            : "Aún no hay periodos configurados."
        }
        actions={
          <>
            <Badge variant="outline" className="h-8 gap-1.5 px-2.5">
              <CalendarRange className="size-3.5" />
              {periodoActivo
                ? `${formatFechaLarga(periodoActivo.fechaInicio)} – ${formatFechaLarga(periodoActivo.fechaFin)}`
                : "Sin periodo"}
            </Badge>
            <Button
              variant="outline"
              size="lg"
              className="h-8"
              disabled
              title="Disponible en el Sprint 4"
            >
              <Eye className="size-3.5" />
              Vista de socio
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Socios activos"
          value={formatNumber(sociosActivos)}
          hint={
            periodoActivo
              ? `Números de polla 00–${String(Math.max(sociosActivos - 1, 0)).padStart(2, "0")}`
              : "Sin periodo"
          }
          icon={Users}
          tone="olive"
        />
        <StatCard
          label="Ahorro esperado"
          value={formatCOP(cuotaTotal * 12)}
          hint={
            cuotaTotal > 0
              ? `${formatCOP(cuotaTotal)} por mes · 12 cuotas`
              : "Define la cuota en socios"
          }
          icon={Wallet}
        />
        <StatCard
          label="Valor de la polla"
          value={formatCOP(config?.valorPolla ?? 0)}
          hint="Por número asignado cada mes"
          icon={CircleDollarSign}
          tone="brown"
        />
        <StatCard
          label="Administradores"
          value={`${admins} de 3`}
          hint={admins < 1 ? "Debe existir al menos uno" : "Máximo 3 cuentas admin"}
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold">Módulos</h3>
              <p className="text-xs text-muted-foreground">
                Cada módulo se habilita en su sprint, con datos reales.
              </p>
            </div>
            <Badge variant="outline">Sprint 0</Badge>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {modulos.map(({ href, label, description, icon: Icon, soon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
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
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </span>
                </span>
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
            <div className="flex items-center gap-2">
              <BellRing className="size-4 text-secondary" />
              <h3 className="font-heading text-base font-semibold">Alertas del periodo</h3>
            </div>
            <div className="mt-3 rounded-lg border border-dashed border-border bg-background/60 p-4 text-center">
              <CheckCircle2 className="mx-auto size-6 text-primary/70" />
              <p className="mt-2 text-sm font-medium">Sin alertas todavía</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Las cuotas vencidas y la mora aparecerán aquí cuando actives el módulo de ahorros.
              </p>
            </div>
          </section>

          <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
            <h3 className="font-heading text-base font-semibold">Fundaciones listas</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Base de datos y migraciones",
                "Acceso por usuario y contraseña",
                "Diseño beige, marrón y oliva",
                "Auditoría y papelera preparadas",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground/80">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              {periodoActivo
                ? `Configuración: pago el día ${config?.diaPago ?? 20}, mora base ${formatCOP(config?.moraBase ?? 0)}.`
                : "Crea un periodo en Configuración para comenzar."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
