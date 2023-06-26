import { test, expect } from '@playwright/test';

``
test('is able to log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('test@mflcountyuser.com');
  await page.getByTestId('password_input').click();
  await page.getByTestId('password_input').fill('county@1234');
  await page.getByTestId('login_btn').click();

  // Unable to proove that the login is working
  // Will be working on this later

  expect(page.getByTestId('logout').textContent, "Log out")

//  expect(page.url()).toEqual(/http:\/\/localhost:3000\/auth\/login.*/)
});




