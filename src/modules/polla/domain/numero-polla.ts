/**
 * Reglas de los números de polla.
 *
 * Cada socio elige un número entre 00 y 99. Los números NO son consecutivos
 * ni dependen de la cantidad de socios: con 25 socios hay 25 ocupados y 75 libres.
 */

export const TOTAL_NUMEROS_POLLA = 100;
export const NUMERO_POLLA_MIN = 0;
export const NUMERO_POLLA_MAX = TOTAL_NUMEROS_POLLA - 1;

/** Devuelve el padrón completo: "00", "01", …, "99". */
export function listarNumerosPolla(): string[] {
  return Array.from({ length: TOTAL_NUMEROS_POLLA }, (_, indice) =>
    String(indice).padStart(2, "0"),
  );
}

/**
 * Normaliza un número escrito a mano.
 * Acepta `7`, `"7"`, `"07"` y `" 7 "` → `"07"`.
 * Devuelve `null` si no es un entero entre 00 y 99.
 */
export function normalizarNumeroPolla(valor: string | number | null | undefined): string | null {
  if (valor === null || valor === undefined) return null;

  const texto = String(valor).trim();

  if (!/^\d{1,2}$/.test(texto)) return null;

  const numero = Number.parseInt(texto, 10);

  if (numero < NUMERO_POLLA_MIN || numero > NUMERO_POLLA_MAX) return null;

  return texto.padStart(2, "0");
}

export function esNumeroPollaValido(valor: string | number | null | undefined): boolean {
  return normalizarNumeroPolla(valor) !== null;
}

export type ResultadoNumeroPolla = { ok: true; numero: string } | { ok: false; error: string };

export type ContextoNumeroPolla = {
  /** Números ya elegidos por otros socios en el periodo. */
  ocupados: Iterable<string | null | undefined>;
  /** Número actual del socio que se edita: puede conservarlo. */
  numeroActual?: string | null;
};

/**
 * Valida el número que escribe el administrador.
 * La unicidad sí se bloquea: dos socios no pueden tener el mismo número en un periodo.
 */
export function validarNumeroPolla(
  valor: string | number | null | undefined,
  { ocupados, numeroActual }: ContextoNumeroPolla,
): ResultadoNumeroPolla {
  const numero = normalizarNumeroPolla(valor);

  if (!numero) {
    return { ok: false, error: "Escribe un número de dos cifras entre 00 y 99." };
  }

  const actual = normalizarNumeroPolla(numeroActual);
  if (numero === actual) return { ok: true, numero };

  const yaElegido = Array.from(ocupados, (otro) => normalizarNumeroPolla(otro)).includes(numero);

  if (yaElegido) {
    return { ok: false, error: `El número ${numero} ya lo eligió otro socio en este periodo.` };
  }

  return { ok: true, numero };
}

/** Números del 00 al 99 que nadie ha elegido todavía. */
export function numerosLibres(ocupados: Iterable<string | null | undefined>): string[] {
  const usados = new Set(
    Array.from(ocupados, (numero) => normalizarNumeroPolla(numero)).filter(
      (numero): numero is string => numero !== null,
    ),
  );

  return listarNumerosPolla().filter((numero) => !usados.has(numero));
}
