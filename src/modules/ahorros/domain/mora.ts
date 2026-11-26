import { diasDeAtraso } from "@/lib/periods";

export type ConfiguracionMora = {
  moraBase: number;
  moraDiasBase: number;
  moraPorDia: number;
};

/**
 * Calcula la mora sugerida sobre el ahorro.
 *
 * Regla del negocio:
 * - Hasta el día de pago: $0.
 * - Dentro de los días base de gracia después del vencimiento: mora base.
 * - Cada día adicional: mora base + moraPorDia por día.
 *
 * Con los valores por defecto (día 20, base $5.000, 3 días de gracia, $1.000/día):
 * paga el 21, 22 o 23 -> $5.000; el 24 -> $6.000; el 25 -> $7.000; el 30 -> $12.000.
 */
export function calcularMoraSugerida(
  fechaLimite: string,
  fechaPago: string | null | undefined,
  config: ConfiguracionMora,
): number {
  if (!fechaPago) return 0;

  const diasAtraso = diasDeAtraso(fechaLimite, fechaPago);

  if (diasAtraso <= 0) return 0;
  if (diasAtraso <= config.moraDiasBase) return config.moraBase;

  return config.moraBase + (diasAtraso - config.moraDiasBase) * config.moraPorDia;
}
