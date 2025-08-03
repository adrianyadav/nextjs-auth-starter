import { test, expect } from '@playwright/test';
import { createTestAccount, loginWithCredentials } from './utils';
import { AuthPage } from './pages/auth-page';

test.describe('Authentication', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
    });

    test('should create test account and login successfully', async ({ page }) => {
        // Create the test account that will be used by other tests
        const { testEmail, testPassword, testName } = await createTestAccount(page);

        // Verify user is logged in by checking for user-specific content
        await authPage.expectLoggedIn();

        // Test logout by going to login page
        await authPage.gotoLogin();

        // Login with the same credentials
        await authPage.login(testEmail, testPassword);

        // Verify user is logged in again
        await authPage.expectLoggedIn();
    });

    test('should show error for invalid login credentials', async ({ page }) => {
        await authPage.gotoLogin();

        // Try to login with invalid credentials
        await authPage.fillLoginForm('invalid@example.com', 'wrongpassword');
        await authPage.submitForm();

        // Should show error message
        await authPage.expectErrorVisible();
    });

    test('should navigate between register and login pages', async ({ page }) => {
        // Test navigation from register to login
        await authPage.gotoRegister();
        await authPage.goToLoginFromRegister();

        // Test navigation from login to register
        await authPage.goToRegisterFromLogin();
    });
}); 