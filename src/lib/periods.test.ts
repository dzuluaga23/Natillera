import { describe, expect, it } from "vitest";
import { calcularPeriodo, diasDeAtraso, MESES_PERIODO, ultimoViernes } from "./periods";

describe("periodos", () => {
  it("calcula 12 meses de diciembre a noviembre", () => {
    const periodo = calcularPeriodo(2026);

    expect(periodo.nombre).toBe("Natillera 2026-2027");
    expect(periodo.meses).toHaveLength(12);
    expect(periodo.meses[0]).toMatchObject({ nombre: "Diciembre", anio: 2026, mes: 12 });
    expect(periodo.meses[11]).toMatchObject({ nombre: "Noviembre", anio: 2027, mes: 11 });
    expect(periodo.meses.map((mes) => mes.nombre)).toEqual([...MESES_PERIODO]);
  });

  it("usa el día de pago configurado en cada mes", () => {
    const periodo = calcularPeriodo(2026, 20);

    expect(periodo.meses[0].fechaLimite).toBe("2026-12-20");
    expect(periodo.meses[11].fechaLimite).toBe("2027-11-20");
    expect(periodo.fechaInicio).toBe("2026-12-01");
    expect(periodo.fechaFin).toBe("2027-11-30");
  });

  it("ajusta el día de pago al último día del mes cuando no existe", () => {
    const periodo = calcularPeriodo(2026, 31);
    const febrero = periodo.meses.find((mes) => mes.nombre === "Febrero");

    expect(febrero?.fechaLimite).toBe("2027-02-28");
  });

  it("encuentra el último viernes del mes", () => {
    expect(ultimoViernes(2026, 11)).toBe("2026-11-27");
    expect(ultimoViernes(2027, 1)).toBe("2027-01-29");
  });

  it("calcula días de atraso sin valores negativos", () => {
    expect(diasDeAtraso("2026-12-20", "2026-12-20")).toBe(0);
    expect(diasDeAtraso("2026-12-20", "2026-12-15")).toBe(0);
    expect(diasDeAtraso("2026-12-20", "2026-12-21")).toBe(1);
    expect(diasDeAtraso("2026-12-20", "2026-12-30")).toBe(10);
  });
});
