import { expect, test } from "@playwright/test";

// You'll write tests eventually, right?

test("index page has expected h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome to SvelteKit" })).toBeVisible();
});

// ...right?
