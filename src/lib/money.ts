const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/** Formatea un valor entero en pesos colombianos. */
export function formatCOP(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) return copFormatter.format(0);
  return copFormatter.format(Number(value));
}

/** Formatea un número entero con separadores de miles. */
export function formatNumber(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) return numberFormatter.format(0);
  return numberFormatter.format(Number(value));
}

/** Convierte texto libre en un entero de pesos. Acepta "$ 50.000" o "50000". */
export function parseCOP(input: string): number {
  const digits = input.replace(/[^\d-]/g, "");
  const value = Number.parseInt(digits, 10);
  return Number.isNaN(value) ? 0 : value;
}

/** Redondea a pesos enteros. La natillera no usa centavos. */
export function toCOP(value: number): number {
  return Math.round(value);
}
