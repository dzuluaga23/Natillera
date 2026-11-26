import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const MESES_PERIODO = [
  "Diciembre",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
] as const;

export type MesPeriodo = {
  /** Posición dentro del periodo: 1 = diciembre, 12 = noviembre. */
  indice: number;
  /** Año calendario del mes. */
  anio: number;
  /** Mes calendario 1-12. */
  mes: number;
  nombre: string;
  /** Fecha límite de pago en formato YYYY-MM-DD. */
  fechaLimite: string;
};

export type PeriodoCalculado = {
  nombre: string;
  anioInicio: number;
  anioFin: number;
  fechaInicio: string;
  fechaFin: string;
  meses: MesPeriodo[];
};

function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Calcula las fechas de un periodo dic (año X) - nov (año X+1). */
export function calcularPeriodo(anioInicio: number, diaPago = 20): PeriodoCalculado {
  const meses: MesPeriodo[] = MESES_PERIODO.map((nombre, index) => {
    const fecha = new Date(anioInicio, 11 + index, 1);
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const dia = Math.min(Math.max(diaPago, 1), ultimoDia);

    return {
      indice: index + 1,
      anio,
      mes,
      nombre,
      fechaLimite: toIsoDate(new Date(anio, mes - 1, dia)),
    };
  });

  return {
    nombre: `Natillera ${anioInicio}-${anioInicio + 1}`,
    anioInicio,
    anioFin: anioInicio + 1,
    fechaInicio: `${anioInicio}-12-01`,
    fechaFin: `${anioInicio + 1}-11-30`,
    meses,
  };
}

/** Devuelve el último viernes del mes en formato YYYY-MM-DD. */
export function ultimoViernes(anio: number, mes: number): string {
  const ultimoDia = new Date(anio, mes, 0);
  const diaSemana = ultimoDia.getDay();
  const offset = (diaSemana - 5 + 7) % 7;
  const viernes = new Date(anio, mes - 1, ultimoDia.getDate() - offset);
  return toIsoDate(viernes);
}

/** Diferencia en días calendario entre la fecha límite y la fecha de pago. */
export function diasDeAtraso(fechaLimite: string, fechaPago: string): number {
  return Math.max(0, differenceInCalendarDays(parseISO(fechaPago), parseISO(fechaLimite)));
}

/** Formatea una fecha ISO corta en español, por ejemplo "20 dic 2026". */
export function formatFechaCorta(fecha: string): string {
  return format(parseISO(fecha), "d MMM yyyy", { locale: es });
}

/** Formatea una fecha ISO larga en español. */
export function formatFechaLarga(fecha: string): string {
  return format(parseISO(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
}
