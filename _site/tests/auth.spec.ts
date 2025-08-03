import { test, expect } from '@playwright/test';
import { createTestAccount, loginWithCredentials } from './utils';

test.describe('Authentication', () => {
    test('should create test account and login successfully', async ({ page }) => {
        // Create the test account that will be used by other tests
        const { testEmail, testPassword, testName } = await createTestAccount(page);

        // Verify user is logged in by checking for user-specific content
        await expect(page.locator('text=Save New Outfit')).toBeVisible();
        await expect(page.locator('text=View My Outfits')).toBeVisible();

        // Test logout by going to login page
        await page.goto('/login');

        // Login with the same credentials
        await loginWithCredentials(page, testEmail, testPassword);

        // Verify user is logged in again
        await expect(page.locator('text=Save New Outfit')).toBeVisible();
        await expect(page.locator('text=View My Outfits')).toBeVisible();
    });

    test('should show error for invalid login credentials', async ({ page }) => {
        await page.goto('/login');

        // Try to login with invalid credentials
        await page.fill('input[name="email"]', 'invalid@example.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('should navigate between register and login pages', async ({ page }) => {
        // Test navigation from register to login
        await page.goto('/register');
        await page.click('text=Already have an account? Sign in');
        await expect(page).toHaveURL('/login');

        // Test navigation from login to register
        await page.click('text=No account? Register.');
        await expect(page).toHaveURL('/register');
    });
}); 