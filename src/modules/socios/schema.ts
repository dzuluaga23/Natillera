import { z } from "zod";
import { normalizarNumeroPolla } from "@/modules/polla/domain/numero-polla";

/** Formulario de alta y edición de un socio en el periodo. */
export const socioSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(80, "El nombre es demasiado largo."),
  telefono: z.string().trim().max(30, "El teléfono es demasiado largo."),
  numero: z
    .string()
    .trim()
    .refine(
      (valor) => normalizarNumeroPolla(valor) !== null,
      "Escribe un número de dos cifras entre 00 y 99.",
    ),
  cuota: z
    .number({ error: "La cuota debe ser un número entero." })
    .int("La cuota debe ser un número entero.")
    .min(0, "La cuota no puede ser negativa.")
    .max(100_000_000, "La cuota es demasiado alta."),
  estado: z.enum(["activo", "retirado"]),
  motivoRetiro: z.string().trim().max(200, "El motivo es demasiado largo."),
});

export type SocioInput = z.infer<typeof socioSchema>;

export const socioEdicionSchema = socioSchema;
