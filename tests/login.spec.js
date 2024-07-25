const { test, expect } = require('@playwright/test');

const baseURL = 'https://demo.haroldwaste.com';
const validEmail = 'qa@julesai.com';
const validPassword = 'QaJULES2023!';

test.describe('Login Tests', () => {

     // Setup common steps before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
    });

    //Empty Field Scenario
    test('Empty Fields', async ({ page }) => {
      await page.click('button[type="submit"]');
  
      // Add validation to check for error messages for empty fields
      await expect(page.locator('text=Required').nth(1)).toBeVisible();
    });

    //Invalid Email Id and Password Scenario
    test('Invalid Email', async ({ page }) => {
      await page.fill('input[name="email"]', 'test@automation.com');
      await page.fill('input[name="password"]', '1234567890');
      await page.click('button[type="submit"]');
  
      //Add in a timeout for the validation message to load
      await page.waitForTimeout(3000);
  
      // Add validation to check for error message
      await expect(page.locator('text = Your email and/or password are incorrect')).toBeVisible();
    });

    //Invalid Email Format and Password Too Short
    test('Invalid Email format', async ({ page }) => {
        await page.fill('input[name="email"]', 'test@');
        await page.fill('input[name="password"]', '123');
        await page.click('button[type="submit"]');
        
        // Add validation to check for error messages for empty fields
        await expect(page.locator('text=Email not valid')).toBeVisible();
        await expect(page.locator('text=Password too short')).toBeVisible();
    });

    //Successful Login Scenario and Navigation
    test('Successful Login', async ({ page }) => {
        await page.fill('input[name="email"]', validEmail);
        await page.fill('input[name="password"]', validPassword);
        await page.click('button[type="submit"]');
        
        //Add validation to check if login is successful, for example:
        await expect(page).toHaveURL(`${baseURL}/purchases`);
        await expect(page.locator('text=Purchase & Opportunity list')).toBeVisible();

        //Page navigation along with validation
        await page.locator('text = Purchase opportunities').click();
        await expect(page).toHaveURL(`${baseURL}/purchases?t=1`);

        await page.locator('text = Lost & Cancelled purchases').click();
        await expect(page).toHaveURL(`${baseURL}/purchases?t=2`);

        await page.locator('text = Closed purchases').click();
        await expect(page).toHaveURL(`${baseURL}/purchases?t=3`);
    });
});