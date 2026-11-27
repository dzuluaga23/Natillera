import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { periodoSocios, socios } from "@/db/schema";
import { listarNumerosPolla } from "./domain/numero-polla";

export type NumeroPollaEstado = {
  numero: string;
  socioId: string | null;
  socio: string | null;
  estado: string | null;
};

/**
 * Devuelve los 100 números del periodo: cada uno con su socio o libre.
 * Es la vista que usan el admin y los socios para la polla general.
 */
export async function cargarPadronPolla(periodoId: string): Promise<NumeroPollaEstado[]> {
  const asignados = await db
    .select({
      numero: periodoSocios.numeroPolla,
      socioId: periodoSocios.socioId,
      socio: socios.nombre,
      estado: periodoSocios.estado,
    })
    .from(periodoSocios)
    .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
    .where(and(eq(periodoSocios.periodoId, periodoId), isNull(periodoSocios.deletedAt)))
    .orderBy(periodoSocios.numeroPolla);

  const porNumero = new Map(asignados.map((fila) => [fila.numero, fila]));

  return listarNumerosPolla().map((numero) => {
    const fila = porNumero.get(numero);

    return {
      numero,
      socioId: fila?.socioId ?? null,
      socio: fila?.socio ?? null,
      estado: fila?.estado ?? null,
    };
  });
}
