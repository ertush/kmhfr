const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage(
    "http://admin.kmhfltest.health.go.ke/auth/login"
  );

  // Navigate to the page and fetch the data
  const response = await page.fetch(
    "https://api.kmhfltest.health.go.ke/api/rest-auth/user/"
  );
  const jsonData = await response.json();

  // Validate the response
  const isValid = await page.evaluate((data) => {}, jsonData);

  console.log(isValid);

  await browser.close();
})();
