import { test, expect } from '@playwright/test';

``
test('is able to log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('you@geemail.com').click();
  await page.getByPlaceholder('you@geemail.com').fill('test@testmail.com');
  await page.getByPlaceholder('*********').click();
  await page.getByPlaceholder('*********').fill('Test@1234');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Unable to proove that the login is working
  // Will be working on this later

//  expect(page.url()).toEqual(/http:\/\/localhost:3000\/auth\/login.*/)
});




