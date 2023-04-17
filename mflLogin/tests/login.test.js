import { test, expect } from "@playwright/test";

// const browser = await playwright.chromium.launch({ headless: false });
// const context = await browser.newContext();

// const page = await context.newPage(
//   "http://admin.kmhfltest.health.go.ke/auth/login"
// );
// const response = await page.fetch(
//   `https://api.kmhfltest.health.go.ke/api/rest-auth/user/`
// );
// const jsonData = await response.json();

// await browser.close();

test("test", async ({ page }) => {
  await page.goto("http://admin.kmhfltest.health.go.ke");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByPlaceholder("you@geemail.com").click();
  await page.getByPlaceholder("you@geemail.com").fill("test@mflcountyuser.com");
  await page.getByPlaceholder("*********").click();
  await page.getByPlaceholder("*********").fill("county@1234");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.goto("http://admin.kmhfltest.health.go.ke/dashboard");
});
