import { expect, test } from "@playwright/test";

async function iniciarSesion(
  page: import("@playwright/test").Page,
  usuario: string,
  clave: string,
) {
  await page.goto("/login");
  await page.getByLabel("Usuario", { exact: true }).fill(usuario);
  await page.getByLabel("Contraseña", { exact: true }).fill(clave);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test("redirige al login cuando no hay sesión", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Ingresa a tu cuenta" })).toBeVisible();
});

test("un administrador entra al panel", async ({ page }) => {
  await iniciarSesion(page, "admin", "Admin123!");

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: /Hola, Administrador/i })).toBeVisible();
  await expect(page.getByText("Módulos", { exact: true })).toBeVisible();
});

test("un socio entra a su resumen y no al panel admin", async ({ page }) => {
  await iniciarSesion(page, "socio", "Socio123!");

  await expect(page).toHaveURL(/\/mi$/);
  await expect(page.getByText("Número de polla")).toBeVisible();

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/mi$/);
});

test("muestra credenciales inválidas", async ({ page }) => {
  await iniciarSesion(page, "admin", "clave-incorrecta");

  await expect(page.getByText("Usuario o contraseña incorrectos.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("el sistema de diseño es accesible con sesión", async ({ page }) => {
  await iniciarSesion(page, "admin", "Admin123!");
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/design");

  await expect(page.getByRole("heading", { name: "Sistema de diseño", level: 2 })).toBeVisible();
  await expect(page.getByText("Paleta")).toBeVisible();
});
