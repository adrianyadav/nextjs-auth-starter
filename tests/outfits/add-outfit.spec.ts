import { test, expect } from '@playwright/test';
import { loginWithTestAccount, createOutfit, cleanupTestOutfits } from '../utils';

// Shared outfit data
const getOutfitData = (isPrivate = false) => ({
    name: `${isPrivate ? 'Private ' : ''}Summer Casual Outfit ${Date.now()}`,
    description: 'A comfortable summer outfit for casual occasions',
    tags: 'casual, summer, comfortable',
    items: [
        {
            name: 'Cotton T-Shirt',
            category: 'UPPERWEAR',
            description: 'Comfortable cotton t-shirt',
            purchaseUrl: 'https://example.com/tshirt'
        },
        {
            name: 'Jeans',
            category: 'LOWERWEAR',
            description: 'Blue denim jeans'
        }
    ]
});

test.describe('Add Outfit', () => {
    let createdOutfits: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Login with existing test account before each test
        await loginWithTestAccount(page);
    });

    test.afterEach(async ({ page }) => {
        // Clean up any outfits created during the test
        if (createdOutfits.length > 0) {
            await cleanupTestOutfits(page, createdOutfits);
            createdOutfits = []; // Reset the array
        }
    });

    test('should create a new outfit successfully', async ({ page }) => {
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Wait for any toast notifications to appear and disappear
        try {
            const toast = page.locator('[role="status"]');
            await expect(toast.first()).toBeVisible({ timeout: 3000 });
            await expect(toast.first()).not.toBeVisible({ timeout: 6000 });
        } catch {
            // Toast might not appear or disappear as expected, that's okay
            console.log('Toast notification check skipped');
        }

        // Verify the outfit was created
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
    });

    test('should create a private outfit successfully', async ({ page }) => {
        const { name: outfitName, isPrivate } = await createOutfit(page, {
            ...getOutfitData(true),
            isPrivate: true
        });
        createdOutfits.push(outfitName);

        // For private outfits, check the my-outfits page
        if (isPrivate) {
            await page.goto('/my-outfits');
        }

        // Wait for any toast notifications to appear and disappear
        try {
            const toast = page.locator('[role="status"]');
            await expect(toast.first()).toBeVisible({ timeout: 3000 });
            await expect(toast.first()).not.toBeVisible({ timeout: 6000 });
        } catch {
            // Toast might not appear or disappear as expected, that's okay
            console.log('Toast notification check skipped');
        }

        // Debug: Check what's actually on the page
        console.log('Looking for outfit:', outfitName);
        console.log('Is private:', isPrivate);
        console.log('Current URL:', page.url());

        // Wait a bit longer and check page content
        await page.waitForTimeout(2000);

        // Get all outfit names on the page for debugging
        const outfitElements = await page.locator('a[href*="/outfits/"]').allTextContents();
        console.log('Outfits found on page:', outfitElements);

        // Verify the outfit was created
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
    });
}); 