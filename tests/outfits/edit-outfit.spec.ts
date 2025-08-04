import { test, expect } from '@playwright/test';
import { loginWithTestAccount, createOutfit, editOutfit, cleanupTestOutfits } from '../utils';

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

test.describe('Edit Outfit', () => {
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

    test('should edit outfit description successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Edit the outfit description
        const newDescription = 'Updated description for testing';
        await editOutfit(page, outfitName, { description: newDescription });

        // Navigate to the outfit detail page to verify the description
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        await expect(page.locator(`text=${newDescription}`)).toBeVisible();
    });

    test('should edit outfit tags successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Edit the outfit tags
        const newTags = 'updated, winter, formal';
        await editOutfit(page, outfitName, { tags: newTags });

        // Navigate to the outfit detail page to verify the tags
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Check that the new tags are visible - use more specific selectors
        // Look for tags within the tags section or as Badge components
        await expect(page.locator('h2:has-text("Tags") + div').locator('text=updated')).toBeVisible();
        await expect(page.locator('h2:has-text("Tags") + div').locator('text=winter')).toBeVisible();
        await expect(page.locator('h2:has-text("Tags") + div').locator('text=formal')).toBeVisible();
    });

    test('should toggle outfit privacy successfully', async ({ page }) => {
        // Create a public outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Make it private
        await editOutfit(page, outfitName, { isPrivate: true });

        // Navigate to the outfit detail page to verify it's private
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Check that the private checkbox is checked
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        const privateCheckbox = page.locator('[data-testid="edit-outfit-private-checkbox"]');
        await expect(privateCheckbox).toBeChecked();

        // Cancel the edit
        const cancelButton = page.locator('[data-testid="edit-outfit-cancel-button"]');
        await cancelButton.click();
    });

    test('should add new item to outfit successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Add a new item
        const newItem = {
            name: 'New Sneakers',
            category: 'FOOTWEAR',
            description: 'Comfortable sneakers for walking',
            purchaseUrl: 'https://example.com/sneakers'
        };
        await editOutfit(page, outfitName, { items: [newItem] });

        // Navigate to the outfit detail page to verify the new item
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        await expect(page.locator('text=New Sneakers')).toBeVisible();
        await expect(page.locator('text=Footwear')).toBeVisible();
    });

    test('should edit existing item in outfit successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Edit the first item's name
        const itemNameInput = page.locator('[data-testid="edit-item-name-input-0"]');
        await itemNameInput.fill('Updated Cotton T-Shirt');

        // Save the changes
        const saveButton = page.locator('[data-testid="edit-outfit-save-button"]');
        await saveButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the item was updated
        await expect(page.locator('text=Updated Cotton T-Shirt')).toBeVisible();
    });

    test('should remove item from outfit successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Remove the first item
        const removeButton = page.locator('[data-testid="edit-remove-item-button-0"]');
        await removeButton.click();

        // Save the changes
        const saveButton = page.locator('[data-testid="edit-outfit-save-button"]');
        await saveButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the item was removed (should not see the original item name)
        await expect(page.locator('text=Cotton T-Shirt')).not.toBeVisible();
    });

    test('should cancel edit without saving changes', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Make some changes
        const nameInput = page.locator('[data-testid="edit-outfit-name-input"]');
        await nameInput.fill('This should not be saved');

        // Cancel the edit
        const cancelButton = page.locator('[data-testid="edit-outfit-cancel-button"]');
        await cancelButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the original name is still there
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
        await expect(page.locator('text=This should not be saved')).not.toBeVisible();
    });

    test('should show edit button only for owned outfits', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Verify edit button is visible for owned outfit
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await expect(editButton).toBeVisible();

        // Navigate to a public outfit (not owned by current user)
        await page.goto('/outfits');
        await page.waitForLoadState('networkidle');

        // Find a public outfit and click on it
        const publicOutfitCard = page.locator('a[href*="/outfits/"]').first();
        await publicOutfitCard.click();
        await page.waitForLoadState('networkidle');

        // Verify edit button is not visible for non-owned outfit
        await expect(page.locator('[data-testid="edit-outfit-button"]')).not.toBeVisible();
    });
}); 