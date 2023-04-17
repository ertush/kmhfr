// auth.setup.ts
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Perform authentication steps.
  await page.goto("http://admin.kmhfltest.health.go.ke");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByPlaceholder("you@geemail.com").click();
  await page.getByPlaceholder("you@geemail.com").fill("test@mflcountyuser.com");
  await page.getByPlaceholder("*********").click();
  await page.getByPlaceholder("*********").fill("county@1234");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("http://admin.kmhfltest.health.go.ke/dashboard");
  await expect(page.getByRole("button", { name: "Profile" })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
