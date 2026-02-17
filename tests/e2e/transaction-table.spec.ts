import { expect, test } from "@playwright/test";

test("filters transactions by category and paginates", async ({ page }) => {
  await page.goto("/dashboard");
  const table = page.getByRole("table");

  await expect(page.getByText("Finance Dashboard")).toBeVisible();
  await expect(page.getByText("Page 1 of 2")).toBeVisible();

  await page.getByTestId("transaction-category-filter").selectOption("Bills");
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
  await expect(table.getByText("Home internet")).toBeVisible();
  await expect(table.getByText("Electricity")).toBeVisible();
  await expect(table.getByText("Streaming")).toBeVisible();

  await page.getByTestId("transaction-category-filter").selectOption("All");
  await expect(page.getByText("Page 1 of 2")).toBeVisible();

  await page.getByTestId("transaction-pagination-next").click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(table.getByText("Public transit")).toBeVisible();
});
