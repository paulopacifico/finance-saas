import { expect, test } from "@playwright/test";

test("filters transactions by category and paginates", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByText("Finance Dashboard")).toBeVisible();
  await expect(page.getByText("Página 1 de 2")).toBeVisible();

  await page.getByLabel("Categoria").selectOption("Bills");
  await expect(page.getByText("Página 1 de 1")).toBeVisible();
  await expect(page.getByText("Internet residencial")).toBeVisible();
  await expect(page.getByText("Eletricidade")).toBeVisible();
  await expect(page.getByText("Streaming")).toBeVisible();

  await page.getByLabel("Categoria").selectOption("Todas");
  await expect(page.getByText("Página 1 de 2")).toBeVisible();

  await page.getByRole("button", { name: "Próxima" }).click();
  await expect(page.getByText("Página 2 de 2")).toBeVisible();
  await expect(page.getByText("Transporte público")).toBeVisible();
});
