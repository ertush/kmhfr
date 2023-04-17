// const { chromium } = require("playwright");
const { test, expect } = require("@playwright/test");

test("KMHFL", () => {
  //   let browser;
  //   let page;

  beforeAll(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should return access token upon login", async () => {
    await page.goto("https://kmhfl.health.go.ke/v3/login");

    // Enter login credentials
    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByPlaceholder("you@geemail.com").click();
    await page
      .getByPlaceholder("you@geemail.com")
      .fill("test@mflcountyuser.com");
    await page.getByPlaceholder("you@geemail.com").press("Tab");
    await page.getByPlaceholder("*********").fill("county@1234");
    await page.getByRole("button", { name: "Log in" }).click();

    // Submit login form
    await Promise.all([page.waitForNavigation(), page.click("#loginBtn")]);

    // Check that access token is returned
    const response = await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").textContent)
        .access_token;
    });
    expect(response).toBeDefined();
  });
});
