import { describe, expect, it } from "vitest";
import { formatCOP, formatNumber, parseCOP, toCOP } from "./money";

function normalizar(valor: string): string {
  return valor.replace(/\s/g, " ");
}

describe("money", () => {
  it("formatea pesos colombianos sin decimales", () => {
    expect(normalizar(formatCOP(50_000))).toBe("$ 50.000");
    expect(normalizar(formatCOP(0))).toBe("$ 0");
    expect(normalizar(formatCOP(1_250_000))).toBe("$ 1.250.000");
  });

  it("trata valores nulos como cero", () => {
    expect(normalizar(formatCOP(null))).toBe("$ 0");
    expect(normalizar(formatCOP(undefined))).toBe("$ 0");
  });

  it("formatea números con separador de miles", () => {
    expect(formatNumber(1234)).toBe("1.234");
    expect(formatNumber(undefined)).toBe("0");
  });

  it("interpreta texto libre escrito por el administrador", () => {
    expect(parseCOP("$ 50.000")).toBe(50_000);
    expect(parseCOP("50000")).toBe(50_000);
    expect(parseCOP("1.234.567")).toBe(1_234_567);
    expect(parseCOP("")).toBe(0);
    expect(parseCOP("abc")).toBe(0);
  });

  it("redondea a pesos enteros", () => {
    expect(toCOP(49_999.4)).toBe(49_999);
    expect(toCOP(49_999.6)).toBe(50_000);
  });
});
