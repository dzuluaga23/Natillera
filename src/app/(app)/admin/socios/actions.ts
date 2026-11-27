"use server";

import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditoria, periodoSocios, socios } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { validarNumeroPolla } from "@/modules/polla/domain/numero-polla";
import { type SocioInput, socioSchema } from "@/modules/socios/schema";

export type ResultadoSocio = { ok: true } | { ok: false; error: string };

type Ocupado = { numero: string; socio: string };

function fechaHoyBogota(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

function revalidar() {
  revalidatePath("/admin/socios");
  revalidatePath("/admin/polla");
  revalidatePath("/admin");
  revalidatePath("/mi");
  revalidatePath("/mi/polla");
}

async function ocupadosDelPeriodo(periodoId: string): Promise<Ocupado[]> {
  const filas = await db
    .select({ numero: periodoSocios.numeroPolla, socio: socios.nombre })
    .from(periodoSocios)
    .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
    .where(and(eq(periodoSocios.periodoId, periodoId), isNull(periodoSocios.deletedAt)));

  return filas;
}

function validar(datos: SocioInput, ocupados: Ocupado[], numeroActual?: string | null) {
  const parsed = socioSchema.safeParse(datos);

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const numero = validarNumeroPolla(parsed.data.numero, {
    ocupados: ocupados.map((item) => item.numero),
    numeroActual,
  });

  if (!numero.ok) {
    return { ok: false as const, error: numero.error };
  }

  return { ok: true as const, datos: parsed.data, numero: numero.numero };
}

async function nombreDuplicado(nombre: string, socioId?: string) {
  const [fila] = await db
    .select({ id: socios.id })
    .from(socios)
    .where(
      and(
        isNull(socios.deletedAt),
        sql`lower(${socios.nombre}) = ${nombre.toLowerCase()}`,
        socioId ? sql`${socios.id} <> ${socioId}` : undefined,
      ),
    )
    .limit(1);

  return Boolean(fila);
}

export async function crearSocio(periodoId: string, datos: SocioInput): Promise<ResultadoSocio> {
  const session = await requireAdmin();
  const ocupados = await ocupadosDelPeriodo(periodoId);
  const resultado = validar(datos, ocupados);

  if (!resultado.ok) return resultado;

  const { nombre, telefono, cuota, estado, motivoRetiro } = resultado.datos;

  if (await nombreDuplicado(nombre)) {
    return { ok: false, error: "Ya existe un socio con ese nombre." };
  }

  const retirado = estado === "retirado";

  await db.transaction(async (tx) => {
    const [socio] = await tx
      .insert(socios)
      .values({ nombre, telefono: telefono || null })
      .returning({ id: socios.id });

    await tx.insert(periodoSocios).values({
      periodoId,
      socioId: socio.id,
      numeroPolla: resultado.numero,
      cuotaAhorro: cuota,
      estado,
      fechaRetiro: retirado ? fechaHoyBogota() : null,
      motivoRetiro: retirado ? motivoRetiro || null : null,
    });

    await tx.insert(auditoria).values({
      usuarioId: session.user.id,
      accion: "crear",
      tabla: "socios",
      registroId: socio.id,
      despues: {
        periodoId,
        nombre,
        telefono: telefono || null,
        numeroPolla: resultado.numero,
        cuotaAhorro: cuota,
        estado,
      },
    });
  });

  revalidar();
  return { ok: true };
}

export async function actualizarSocio(
  periodoId: string,
  socioId: string,
  datos: SocioInput,
): Promise<ResultadoSocio> {
  const session = await requireAdmin();

  const [actual] = await db
    .select({
      nombre: socios.nombre,
      telefono: socios.telefono,
      numeroPolla: periodoSocios.numeroPolla,
      cuotaAhorro: periodoSocios.cuotaAhorro,
      estado: periodoSocios.estado,
      fechaRetiro: periodoSocios.fechaRetiro,
      motivoRetiro: periodoSocios.motivoRetiro,
      asignacionId: periodoSocios.id,
    })
    .from(periodoSocios)
    .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
    .where(
      and(
        eq(periodoSocios.periodoId, periodoId),
        eq(periodoSocios.socioId, socioId),
        isNull(periodoSocios.deletedAt),
      ),
    )
    .limit(1);

  if (!actual) {
    return { ok: false, error: "Ese socio no pertenece al periodo seleccionado." };
  }

  const ocupados = await ocupadosDelPeriodo(periodoId);
  const resultado = validar(datos, ocupados, actual.numeroPolla);

  if (!resultado.ok) return resultado;

  const { nombre, telefono, cuota, estado, motivoRetiro } = resultado.datos;

  if (await nombreDuplicado(nombre, socioId)) {
    return { ok: false, error: "Ya existe otro socio con ese nombre." };
  }

  const retirado = estado === "retirado";
  const fechaRetiro = retirado ? (actual.fechaRetiro ?? fechaHoyBogota()) : null;

  await db.transaction(async (tx) => {
    await tx
      .update(socios)
      .set({ nombre, telefono: telefono || null, updatedAt: new Date() })
      .where(eq(socios.id, socioId));

    await tx
      .update(periodoSocios)
      .set({
        numeroPolla: resultado.numero,
        cuotaAhorro: cuota,
        estado,
        fechaRetiro,
        motivoRetiro: retirado ? motivoRetiro || null : null,
        updatedAt: new Date(),
      })
      .where(eq(periodoSocios.id, actual.asignacionId));

    await tx.insert(auditoria).values({
      usuarioId: session.user.id,
      accion: "actualizar",
      tabla: "periodo_socios",
      registroId: actual.asignacionId,
      antes: {
        nombre: actual.nombre,
        telefono: actual.telefono,
        numeroPolla: actual.numeroPolla,
        cuotaAhorro: actual.cuotaAhorro,
        estado: actual.estado,
        fechaRetiro: actual.fechaRetiro,
        motivoRetiro: actual.motivoRetiro,
      },
      despues: {
        nombre,
        telefono: telefono || null,
        numeroPolla: resultado.numero,
        cuotaAhorro: cuota,
        estado,
        fechaRetiro,
        motivoRetiro: retirado ? motivoRetiro || null : null,
      },
    });
  });

  revalidar();
  return { ok: true };
}

/**
 * Quita al socio del periodo sin borrar su historial ni su registro global.
 * El número queda libre y el socio desaparece de la lista del periodo.
 */
export async function quitarSocioDelPeriodo(
  periodoId: string,
  socioId: string,
): Promise<ResultadoSocio> {
  const session = await requireAdmin();

  const [actual] = await db
    .select({
      asignacionId: periodoSocios.id,
      numeroPolla: periodoSocios.numeroPolla,
      estado: periodoSocios.estado,
    })
    .from(periodoSocios)
    .innerJoin(socios, eq(periodoSocios.socioId, socios.id))
    .where(
      and(
        eq(periodoSocios.periodoId, periodoId),
        eq(periodoSocios.socioId, socioId),
        isNull(periodoSocios.deletedAt),
      ),
    )
    .limit(1);

  if (!actual) {
    return { ok: false, error: "Ese socio no pertenece al periodo seleccionado." };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(periodoSocios)
      .set({ deletedAt: new Date(), deletedBy: session.user.id })
      .where(eq(periodoSocios.id, actual.asignacionId));

    await tx.insert(auditoria).values({
      usuarioId: session.user.id,
      accion: "eliminar",
      tabla: "periodo_socios",
      registroId: actual.asignacionId,
      antes: { periodoId, socioId, ...actual },
    });
  });

  revalidar();
  return { ok: true };
}
