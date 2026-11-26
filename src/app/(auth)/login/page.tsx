import { BadgeCheck, PiggyBank, ShieldCheck, Ticket } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/brand/logo";
import { rutaInicio } from "@/lib/permissions";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Ingresar",
};

const beneficios = [
  {
    icon: PiggyBank,
    titulo: "Ahorro y mora claros",
    detalle: "Cada socio ve sus cuotas del periodo sin hojas de cálculo.",
  },
  {
    icon: Ticket,
    titulo: "Polla y rifas al día",
    detalle: "Números asignados, sorteos y ganadores en un solo lugar.",
  },
  {
    icon: ShieldCheck,
    titulo: "Todo queda registrado",
    detalle: "Auditoría de cambios, papelera y cierres con confirmación.",
  },
];

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(rutaInicio(session.user.role));
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-sidebar-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-secondary/40 blur-3xl"
        />

        <Logo variant="light" />

        <div className="relative max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-primary">
            Natillera digital
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-tight">
            La natillera de siempre, sin cuadernos ni enredos.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Ahorros, polla, rifas, préstamos y liquidación en un solo panel, con reglas claras para
            administradores y consulta tranquila para cada socio.
          </p>

          <ul className="mt-8 space-y-4">
            {beneficios.map(({ icon: Icon, titulo, detalle }) => (
              <li key={titulo} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{titulo}</span>
                  <span className="block text-xs leading-relaxed text-sidebar-foreground/60">
                    {detalle}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-sidebar-foreground/45">
          <BadgeCheck className="size-3.5" />
          Periodo diciembre – noviembre · Pesos colombianos · Hora de Bogotá
        </p>
      </section>

      <section className="flex flex-col justify-center px-5 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Ingresa a tu cuenta
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Usa el usuario y la contraseña que te entregó el administrador.
            </p>

            <LoginForm />
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border bg-card/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
              Cuentas demo
            </p>
            <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
              <p>
                Admin: <span className="font-medium text-foreground">admin</span> ·{" "}
                <span className="font-medium text-foreground">Admin123!</span>
              </p>
              <p>
                Socio: <span className="font-medium text-foreground">socio</span> ·{" "}
                <span className="font-medium text-foreground">Socio123!</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
