import { desc, isNull } from "drizzle-orm";
import { AppShell } from "@/components/layout/app-shell";
import { db } from "@/db";
import { periodos } from "@/db/schema";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  const listaPeriodos = await db
    .select({
      id: periodos.id,
      nombre: periodos.nombre,
      estado: periodos.estado,
    })
    .from(periodos)
    .where(isNull(periodos.deletedAt))
    .orderBy(desc(periodos.fechaInicio));

  const role = session.user.role === "admin" ? "admin" : "socio";

  return (
    <AppShell
      role={role}
      userName={session.user.name}
      username={session.user.username ?? ""}
      periods={listaPeriodos}
    >
      {children}
    </AppShell>
  );
}
