import { describe, expect, it } from "vitest";
import {
  listarNumerosPolla,
  normalizarNumeroPolla,
  numerosLibres,
  validarNumeroPolla,
} from "./numero-polla";

describe("padrón de polla", () => {
  it("tiene los 100 números del 00 al 99", () => {
    const numeros = listarNumerosPolla();

    expect(numeros).toHaveLength(100);
    expect(numeros[0]).toBe("00");
    expect(numeros[99]).toBe("99");
    expect(new Set(numeros).size).toBe(100);
  });
});

describe("normalización del número de polla", () => {
  it("completa a dos cifras", () => {
    expect(normalizarNumeroPolla("7")).toBe("07");
    expect(normalizarNumeroPolla(7)).toBe("07");
    expect(normalizarNumeroPolla("0")).toBe("00");
    expect(normalizarNumeroPolla(0)).toBe("00");
  });

  it("respeta los ceros a la izquierda y los espacios", () => {
    expect(normalizarNumeroPolla("07")).toBe("07");
    expect(normalizarNumeroPolla(" 07 ")).toBe("07");
    expect(normalizarNumeroPolla("99")).toBe("99");
  });

  it("rechaza valores fuera de 00–99 o con otros caracteres", () => {
    expect(normalizarNumeroPolla("100")).toBeNull();
    expect(normalizarNumeroPolla(100)).toBeNull();
    expect(normalizarNumeroPolla("-1")).toBeNull();
    expect(normalizarNumeroPolla("7A")).toBeNull();
    expect(normalizarNumeroPolla("")).toBeNull();
    expect(normalizarNumeroPolla("  ")).toBeNull();
    expect(normalizarNumeroPolla(null)).toBeNull();
    expect(normalizarNumeroPolla(undefined)).toBeNull();
  });
});

describe("validación de disponibilidad", () => {
  it("acepta un número libre y lo devuelve normalizado", () => {
    expect(validarNumeroPolla("7", { ocupados: ["03", "11", "77"] })).toEqual({
      ok: true,
      numero: "07",
    });
  });

  it("rechaza un número ya elegido por otro socio", () => {
    const resultado = validarNumeroPolla("11", { ocupados: ["03", "11", "77"] });

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("11");
  });

  it("permite conservar el número propio al editar", () => {
    expect(validarNumeroPolla("11", { ocupados: ["03", "11", "77"], numeroActual: "11" })).toEqual({
      ok: true,
      numero: "11",
    });
  });

  it("rechaza formatos inválidos con un mensaje en español", () => {
    const resultado = validarNumeroPolla("123", { ocupados: [] });

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("00 y 99");
  });
});

describe("números libres", () => {
  it("con 25 socios quedan 75 libres", () => {
    const ocupados = [
      "03",
      "07",
      "11",
      "16",
      "22",
      "28",
      "31",
      "35",
      "41",
      "44",
      "47",
      "53",
      "58",
      "61",
      "66",
      "72",
      "77",
      "81",
      "85",
      "89",
      "92",
      "94",
      "96",
      "98",
      "99",
    ];
    const libres = numerosLibres(ocupados);

    expect(libres).toHaveLength(75);
    expect(libres).not.toContain("07");
    expect(libres[0]).toBe("00");
  });

  it("ignora valores nulos o inválidos sin romper el cálculo", () => {
    expect(numerosLibres([null, "07", "7A", undefined, "07"])).toHaveLength(99);
  });
});
