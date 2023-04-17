import { test, expect } from "@playwright/test";
import axios from "axios";

test("test", async ({ page }) => {
  await page.goto("http://admin.kmhfltest.health.go.ke/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByPlaceholder("you@geemail.com").click();
  await page.getByPlaceholder("you@geemail.com").fill("test@mflcountyuser.com");
  await page.getByPlaceholder("you@geemail.com").press("Tab");
  await page.getByPlaceholder("*********").fill("county@1234");
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait for the HTTP request to complete and get the response
  const response = await axios.get(
    "http://admin.kmhfltest.health.go.ke/api/auth/login"
  );

  // Assert that the access token is present in the response
  expect(response.data.access_token).toBeDefined();
});
