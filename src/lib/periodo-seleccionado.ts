import { desc, isNull } from "drizzle-orm";
import { db } from "@/db";
import { periodos } from "@/db/schema";

/**
 * Lista los periodos y resuelve el seleccionado por query param,
 * cayendo al periodo activo y luego al más reciente.
 */
export async function cargarPeriodoSeleccionado(periodoId?: string) {
  const lista = await db
    .select()
    .from(periodos)
    .where(isNull(periodos.deletedAt))
    .orderBy(desc(periodos.fechaInicio));

  const periodo =
    lista.find((item) => item.id === periodoId) ??
    lista.find((item) => item.estado === "activo") ??
    lista[0];

  return { periodos: lista, periodo };
}
