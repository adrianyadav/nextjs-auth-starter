import { test, expect } from '@playwright/test';
import { loginWithTestAccount, createOutfit } from '../utils';
import { getDefaultOutfitData } from '../test-data';

test.describe('Add Outfit', () => {
    let createdOutfits: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Login with existing test account before each test
        await loginWithTestAccount(page);
    });

    test('should create a new outfit successfully', async ({ page }) => {
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Verify the outfit was created
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
    });

    test('should create a private outfit successfully', async ({ page }) => {
        const { name: outfitName, isPrivate } = await createOutfit(page, {
            ...getDefaultOutfitData(true),
            isPrivate: true
        });
        createdOutfits.push(outfitName);

        // For private outfits, check the my-outfits page
        if (isPrivate) {
            await page.goto('/my-outfits');
        }

        // Verify the outfit was created
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
    });

    test('should navigate to create outfit page when clicking Create New Outfit button', async ({ page }) => {
        // First create an outfit so we have outfits to display
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to my outfits page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        // Verify the Create New Outfit button is visible
        const createButton = page.locator('[data-testid="create-new-outfit-button"]');
        await expect(createButton).toBeVisible();

        // Click the Create New Outfit button
        await createButton.click();

        // Verify we navigated to the create outfit page
        await expect(page).toHaveURL('/outfits/new');
    });
});
