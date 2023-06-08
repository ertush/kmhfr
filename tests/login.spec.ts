import { test, expect } from '@playwright/test';


test('has loggined and has redirected to dashboard ', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('you@geemail.com').click();
  await page.getByPlaceholder('you@geemail.com').fill('test@testmail.com');
  await page.getByPlaceholder('*********').click();
  await page.getByPlaceholder('*********').fill('Test@1234');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  await page.waitForTimeout(5000);

  await expect(page.locator('#dashboard-title')).toHaveText("Overview");
    


});
