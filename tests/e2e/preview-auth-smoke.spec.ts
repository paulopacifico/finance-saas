import { expect, test } from "@playwright/test";

const previewBaseUrl = process.env.PREVIEW_BASE_URL;
const authCookieName = process.env.PREVIEW_AUTH_COOKIE_NAME;
const authCookieValue = process.env.PREVIEW_AUTH_COOKIE_VALUE;

test.describe("preview authenticated smoke", () => {
  test.skip(
    !previewBaseUrl || !authCookieName || !authCookieValue,
    "Set PREVIEW_BASE_URL, PREVIEW_AUTH_COOKIE_NAME and PREVIEW_AUTH_COOKIE_VALUE",
  );

  test("opens dashboard with a real authenticated session", async ({ page, context }) => {
    const parsedUrl = new URL(previewBaseUrl!);
    await context.addCookies([
      {
        name: authCookieName!,
        value: authCookieValue!,
        domain: parsedUrl.hostname,
        path: "/",
        httpOnly: true,
        secure: parsedUrl.protocol === "https:",
        sameSite: "Lax",
      },
    ]);

    await page.goto(`${previewBaseUrl!}/dashboard`);
    await expect(page.getByText("Finance Dashboard")).toBeVisible();
  });
});
