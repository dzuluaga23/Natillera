import { describe, expect, it } from "vitest";
import { type ConfiguracionMora, calcularMoraSugerida } from "./mora";

const config: ConfiguracionMora = {
  moraBase: 5_000,
  moraDiasBase: 3,
  moraPorDia: 1_000,
};

describe("mora sugerida", () => {
  it("no cobra mora si no hay pago registrado", () => {
    expect(calcularMoraSugerida("2026-12-20", null, config)).toBe(0);
    expect(calcularMoraSugerida("2026-12-20", undefined, config)).toBe(0);
  });

  it("no cobra mora si paga el día límite o antes", () => {
    expect(calcularMoraSugerida("2026-12-20", "2026-12-20", config)).toBe(0);
    expect(calcularMoraSugerida("2026-12-20", "2026-12-01", config)).toBe(0);
  });

  it("cobra la mora base durante los días de gracia", () => {
    expect(calcularMoraSugerida("2026-12-20", "2026-12-21", config)).toBe(5_000);
    expect(calcularMoraSugerida("2026-12-20", "2026-12-23", config)).toBe(5_000);
  });

  it("suma la mora diaria después del periodo de gracia", () => {
    expect(calcularMoraSugerida("2026-12-20", "2026-12-24", config)).toBe(6_000);
    expect(calcularMoraSugerida("2026-12-20", "2026-12-30", config)).toBe(12_000);
  });

  it("respeta una configuración distinta por periodo", () => {
    const otra: ConfiguracionMora = { moraBase: 2_000, moraDiasBase: 0, moraPorDia: 500 };

    expect(calcularMoraSugerida("2026-12-20", "2026-12-21", otra)).toBe(2_500);
  });
});
