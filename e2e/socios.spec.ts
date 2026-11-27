import { expect, type Page, test } from "@playwright/test";

async function iniciarSesion(page: Page, usuario: string, clave: string) {
  await page.goto("/login");
  await page.getByLabel("Usuario", { exact: true }).fill(usuario);
  await page.getByLabel("Contraseña", { exact: true }).fill(clave);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test("el admin ve la lista de socios y el selector de números", async ({ page }) => {
  await iniciarSesion(page, "admin", "Admin123!");
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/socios");

  await expect(page.getByRole("heading", { name: "Socios y números" })).toBeVisible();
  await expect(page.getByText("25 en la lista")).toBeVisible();
  await expect(page.getByText("Ana María Restrepo", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Nuevo socio" }).click();

  // Los números ocupados se deshabilitan; los libres se pueden elegir.
  await expect(page.getByRole("button", { name: /Número 03, ocupado por/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Elegir el número 04" })).toBeEnabled();
});
