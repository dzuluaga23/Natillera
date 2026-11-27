import { expect, type Page, test } from "@playwright/test";

async function iniciarSesion(page: Page, usuario: string, clave: string) {
  await page.goto("/login");
  await page.getByLabel("Usuario", { exact: true }).fill(usuario);
  await page.getByLabel("Contraseña", { exact: true }).fill(clave);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test("el admin ve el padrón de 100 números y cuántos están ocupados", async ({ page }) => {
  await iniciarSesion(page, "admin", "Admin123!");
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/polla");

  await expect(page.getByRole("heading", { name: "Números y padrón" })).toBeVisible();
  await expect(page.getByText("25 de 100")).toBeVisible();
  await expect(page.getByText("75 libres para elegir")).toBeVisible();
  await expect(page.getByText("Padrón 00–99")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Ana María Restrepo" })).toBeVisible();
});

test("el socio ve su número y el padrón completo", async ({ page }) => {
  await iniciarSesion(page, "socio", "Socio123!");
  await expect(page).toHaveURL(/\/mi$/);

  await page.goto("/mi/polla");

  await expect(page.getByRole("heading", { name: "Los 100 números" })).toBeVisible();
  await expect(page.getByText("Tu número", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Números elegidos")).toBeVisible();
  await expect(page.getByText("03", { exact: true }).first()).toBeVisible();
});
