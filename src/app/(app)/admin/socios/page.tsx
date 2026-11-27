import { and, eq, isNull, sql } from "drizzle-orm";
import { Search, Ticket, UserCheck, UserMinus, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { QuitarSocioDialog } from "@/components/socios/quitar-socio-dialog";
import { SocioDialog } from "@/components/socios/socio-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { periodoSocios, socios } from "@/db/schema";
import { formatCOP, formatNumber } from "@/lib/money";
import { cargarPeriodoSeleccionado } from "@/lib/periodo-seleccionado";
import { requireAdmin } from "@/lib/session";
import { TOTAL_NUMEROS_POLLA } from "@/modules/polla/domain/numero-polla";

export const metadata: Metadata = {
  title: "Socios y números de polla",
};

type SociosPageProps = {
  searchParams: Promise<{ periodo?: string; q?: string }>;
};

export default async function SociosPage({ searchParams }: SociosPageProps) {
  await requireAdmin();
  const { periodo: periodoId, q } = await searchParams;
  const { periodo } = await cargarPeriodoSeleccionado(periodoId);

  if (!periodo) {
    return (
      <div>
        <PageHeader
          eyebrow="Socios"
          icon={Users}
          title="Socios y números"
          description="Administra las personas del periodo, su número de polla y su cuota."
        />
        <div className="rounded-xl bg-card p-6 text-center ring-1 ring-border">
          <Users className="mx-auto size-6 text-secondary" />
          <p className="mt-2 font-medium">Aún no hay periodos</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Crea un periodo en Configuración para empezar a registrar socios.
          </p>
        </div>
      </div>
    );
  }

  const filtro = q?.trim();
  const busqueda = filtro
    ? sql`(${socios.nombre} ilike ${`%${filtro}%`} or ${periodoSocios.numeroPolla} like ${`${filtro}%`})`
    : undefined;

  const filas = await db
    .select({
      socioId: socios.id,
      nombre: socios.nombre,
      telefono: socios.telefono,
      numeroPolla: periodoSocios.numeroPolla,
      cuotaAhorro: periodoSocios.cuotaAhorro,
      estado: periodoSocios.estado,
      motivoRetiro: periodoSocios.motivoRetiro,
    })
    .from(periodoSocios)
    .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
    .where(and(eq(periodoSocios.periodoId, periodo.id), isNull(periodoSocios.deletedAt), busqueda))
    .orderBy(periodoSocios.numeroPolla);

  const todos = filtro
    ? await db
        .select({
          numeroPolla: periodoSocios.numeroPolla,
          estado: periodoSocios.estado,
        })
        .from(periodoSocios)
        .where(and(eq(periodoSocios.periodoId, periodo.id), isNull(periodoSocios.deletedAt)))
    : filas;

  const activos = todos.filter((fila) => fila.estado === "activo").length;
  const retirados = todos.length - activos;
  const libres = TOTAL_NUMEROS_POLLA - todos.length;
  const ocupados = Object.fromEntries(filas.map((fila) => [fila.numeroPolla, fila.nombre]));
  const cuotaSugerida = filas[0]?.cuotaAhorro ?? 50_000;

  return (
    <div>
      <PageHeader
        eyebrow="Socios"
        icon={Users}
        title="Socios y números"
        description="Cada socio elige un número entre 00 y 99. Puedes editar sus datos, cambiar el número si está libre, retirarlo o quitarlo del periodo sin borrar el historial."
        actions={
          <>
            <form action="/admin/socios" className="flex items-center gap-2">
              <input type="hidden" name="periodo" value={periodo.id} />
              <Input
                name="q"
                defaultValue={filtro ?? ""}
                placeholder="Nombre o número"
                aria-label="Buscar socio"
                className="h-9 w-40 sm:w-52"
              />
              <Button type="submit" variant="outline" size="lg" className="h-9">
                <Search className="size-4" />
                <span className="sr-only sm:not-sr-only">Buscar</span>
              </Button>
            </form>
            <SocioDialog periodoId={periodo.id} ocupados={ocupados} cuotaSugerida={cuotaSugerida} />
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Socios en el periodo"
          value={formatNumber(todos.length)}
          hint={periodo.nombre}
          icon={Users}
          tone="olive"
        />
        <StatCard
          label="Activos"
          value={formatNumber(activos)}
          hint="Participan en el reparto"
          icon={UserCheck}
        />
        <StatCard
          label="Retirados"
          value={formatNumber(retirados)}
          hint="Conservan su número"
          icon={UserMinus}
          tone="brown"
        />
        <StatCard
          label="Números libres"
          value={`${formatNumber(libres)} de ${TOTAL_NUMEROS_POLLA}`}
          hint="Disponibles para elegir"
          icon={Ticket}
        />
      </div>

      <section className="mt-6 rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">Socios del periodo</h3>
          <Badge variant="outline">{formatNumber(filas.length)} en la lista</Badge>
        </div>

        {filas.length === 0 ? (
          <div className="mt-3 rounded-lg border border-dashed border-border bg-background/60 p-6 text-center">
            <Users className="mx-auto size-6 text-secondary" />
            <p className="mt-2 text-sm font-medium">
              {filtro ? "No encontramos socios con esa búsqueda" : "Todavía no hay socios"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {filtro
                ? "Prueba con otro nombre o número."
                : "Usa «Nuevo socio» para agregar el primero."}
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socio</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filas.map((fila) => (
                  <TableRow key={fila.socioId}>
                    <TableCell>
                      <span className="block font-medium">{fila.nombre}</span>
                      <span className="block text-xs text-muted-foreground">
                        {fila.telefono || "Sin teléfono"}
                      </span>
                    </TableCell>
                    <TableCell className="money font-semibold">{fila.numeroPolla}</TableCell>
                    <TableCell className="money">{formatCOP(fila.cuotaAhorro)}</TableCell>
                    <TableCell>
                      <Badge variant={fila.estado === "activo" ? "secondary" : "outline"}>
                        {fila.estado === "activo" ? "Activo" : "Retirado"}
                      </Badge>
                      {fila.estado === "retirado" && fila.motivoRetiro && (
                        <span className="mt-0.5 block max-w-40 truncate text-[11px] text-muted-foreground">
                          {fila.motivoRetiro}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <SocioDialog
                          periodoId={periodo.id}
                          ocupados={ocupados}
                          socio={{
                            socioId: fila.socioId,
                            nombre: fila.nombre,
                            telefono: fila.telefono,
                            numeroPolla: fila.numeroPolla,
                            cuotaAhorro: fila.cuotaAhorro,
                            estado: fila.estado,
                            motivoRetiro: fila.motivoRetiro,
                          }}
                        />
                        <QuitarSocioDialog
                          periodoId={periodo.id}
                          socioId={fila.socioId}
                          nombre={fila.nombre}
                          numeroPolla={fila.numeroPolla}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Los números ocupados no se pueden repetir dentro del periodo. La base de datos también lo
        impide con una restricción CHECK y un índice único.
      </p>
    </div>
  );
}
