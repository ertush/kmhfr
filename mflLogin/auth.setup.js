// auth.setup.ts
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("http://admin.kmhfltest.health.go.ke");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByPlaceholder("you@geemail.com").click();
  await page.getByPlaceholder("you@geemail.com").fill("test@mflcountyuser.com");
  await page.getByPlaceholder("*********").click();
  await page.getByPlaceholder("*********").fill("county@1234");
  await page.getByRole("button", { name: "Log in" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("http://admin.kmhfltest.health.go.ke/dashboard");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole("button", { name: "Profile" })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
