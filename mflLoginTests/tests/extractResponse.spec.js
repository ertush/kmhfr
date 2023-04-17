// playwright/fixtures.ts
import { test as baseTest } from "@playwright/test";
import fs from "fs";
import path from "path";

export * from "@playwright/test";
// export const test = baseTest.extend<{}, { workerStorageState: string }({
//   // Use the same storage state for all tests in this worker.
//   storageState: ({ workerStorageState }, use) => use(workerStorageState),

// Authenticate once per worker with a worker-scoped fixture.
workerStorageState: [
  async ({ browser }, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = test.info().parallelIndex;
    const response = path.resolve(
      test.info().project.outputDir,
      `.auth/${id}.json`
    );

    if (fs.existsSync(response)) {
      // Reuse existing authentication state if any.
      await use(response);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Acquire an account.

    // can run tests at the same time without interference.
    const account = await acquireAccount(id);

    // Perform authentication
    await page.goto("http://admin.kmhfltest.health.go.ke");
    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByPlaceholder("you@geemail.com").click();
    await page
      .getByPlaceholder("you@geemail.com")
      .fill("test@mflcountyuser.com");
    await page.getByPlaceholder("*********").click();
    await page.getByPlaceholder("*********").fill("county@12345");
    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("http://admin.kmhfltest.health.go.ke/dashboard");

    await expect(page.getByRole("button", { name: "profile" })).toBeVisible();

    await page.context().storageState({ path: response });
    await page.close();
    await use(response);
  },
  { scope: "worker" },
];
// });
