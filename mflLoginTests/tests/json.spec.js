// // import { test, expect } from "@playwright/test";
// // import fs from "fs";

// // test("test", async ({ page }) => {
// //   await page.goto("http://admin.kmhfltest.health.go.ke/");
// //   await page.getByRole("link", { name: "Log in" }).click();
// //   await page.getByPlaceholder("you@geemail.com").click();
// //   await page.getByPlaceholder("you@geemail.com").fill("test@mflcountyuser.com");
// //   await page.getByPlaceholder("you@geemail.com").press("Tab");
// //   await page.getByPlaceholder("*********").fill("county@1234");
// //   await page.getByRole("button", { name: "Log in" }).click();

// //   // Assert that an access token is returned
//   const response = await page.waitForResponse(
// //     (response) =>
// //       response.url().includes("oauth/token") && response.status() === 200
// //   );
// //   const responseBody = await response.json();
// //   expect(responseBody.access_token).toBeTruthy();

// //   // Save the response
// //   fs.writeFileSync("response.json", JSON.stringify(responseBody));
// // });
