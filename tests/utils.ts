import { Page, Locator, expect } from '@playwright/test';

// Page Object for common form interactions
class FormPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-testid="email-input"]');
        this.passwordInput = page.locator('[data-testid="password-input"]');
        this.nameInput = page.locator('[data-testid="name-input"]');
        this.submitButton = page.locator('[data-testid="submit-button"]');
        this.errorMessage = page.locator('[data-testid="error-message"]');
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    async submit() {
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async waitForNavigation() {
        await this.page.waitForURL('/', { timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded');
    }
}

// Page Object for outfit creation
class OutfitFormPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly descriptionTextarea: Locator;
    readonly tagsInput: Locator;
    readonly imageUrlButton: Locator;
    readonly imageUrlInput: Locator;
    readonly privateCheckbox: Locator;
    readonly addItemButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('[data-testid="outfit-name-input"]');
        this.descriptionTextarea = page.locator('[data-testid="outfit-description-textarea"]');
        this.tagsInput = page.locator('[data-testid="outfit-tags-input"]');
        this.imageUrlButton = page.locator('button:has-text("Image URL")');
        this.imageUrlInput = page.locator('input[id="imageUrl"]');
        this.privateCheckbox = page.locator('[data-testid="outfit-private-checkbox"]');
        this.addItemButton = page.locator('[data-testid="add-item-button"]');
        this.submitButton = page.locator('[data-testid="save-outfit-button"]');
    }

    async fillBasicInfo(name: string, description: string, tags: string) {
        await this.nameInput.fill(name);
        await this.descriptionTextarea.fill(description);
        await this.tagsInput.fill(tags);
    }

    async setImageUrl(imageUrl: string) {
        // Click the "Image URL" button to switch to URL mode
        await this.imageUrlButton.click();
        // Wait for the URL input field to appear and fill it
        await this.imageUrlInput.fill(imageUrl);
    }

    async setPrivate(isPrivate: boolean) {
        if (isPrivate) {
            await this.privateCheckbox.check();
        } else {
            await this.privateCheckbox.uncheck();
        }
    }

    async addItem(item: {
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }) {
        await this.addItemButton.click();

        // Wait for the item form to be visible and get the current item index
        await this.page.waitForSelector('[data-testid^="item-name-input-"]', { timeout: 10000 });
        const itemInputs = this.page.locator('[data-testid^="item-name-input-"]');
        const itemIndex = await itemInputs.count() - 1; // Get the index of the newly added item

        // Fill item name using data-testid
        const itemNameInput = this.page.locator(`[data-testid="item-name-input-${itemIndex}"]`);
        await itemNameInput.fill(item.name);

        // Select category using data-testid
        const categorySelect = this.page.locator(`[data-testid="item-category-select-${itemIndex}"]`);
        await categorySelect.click();
        await this.page.locator(`[data-testid="item-category-option-${item.category}-${itemIndex}"]`).click();

        // Fill optional description
        if (item.description) {
            const descriptionInput = this.page.locator(`[data-testid="item-description-input-${itemIndex}"]`);
            await descriptionInput.fill(item.description);
        }

        // Fill optional purchase URL
        if (item.purchaseUrl) {
            const purchaseUrlInput = this.page.locator(`[data-testid="item-purchase-url-input-${itemIndex}"]`);
            await purchaseUrlInput.fill(item.purchaseUrl);
        }
    }

    async submit() {
        await this.submitButton.click();
        await this.page.waitForURL('/my-outfits');
    }
}

export async function registerAndLogin(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    const formPage = new FormPage(page);

    // Register a new user
    await page.goto('/register');
    await formPage.fillName(testName);
    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    await formPage.submit();
    await formPage.waitForNavigation();

    return { testEmail, testPassword, testName };
}

export async function loginWithTestAccount(page: Page) {
    // Use environment variables for production testing, fallback to local test account
    const testEmail = process.env.PROD_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.PROD_TEST_PASSWORD || 'password123';
    const testName = process.env.PROD_TEST_NAME || 'Test User';

    const formPage = new FormPage(page);

    // Login with existing test account
    await page.goto('/login');
    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    await formPage.submit();
    await formPage.waitForNavigation();

    return { testEmail, testPassword, testName };
}

export async function createTestAccount(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    const formPage = new FormPage(page);

    // Register the test account
    await page.goto('/register');
    await formPage.fillName(testName);
    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    await formPage.submit();
    await formPage.waitForNavigation();

    return { testEmail, testPassword, testName };
}

export async function loginWithCredentials(page: Page, email: string, password: string) {
    const formPage = new FormPage(page);

    await page.goto('/login');
    await formPage.fillEmail(email);
    await formPage.fillPassword(password);
    await formPage.submit();
    await formPage.waitForNavigation();
}

// Helper function to wait for toast notifications
export async function waitForToastAndDismiss(page: Page) {
    try {
        // Wait for toast to appear (shadcn/ui toast)
        const toast = page.locator('[role="status"]');
        await expect(toast.first()).toBeVisible({ timeout: 5000 });

        // Wait for toast to disappear (auto-dismiss after 5 seconds)
        await expect(toast.first()).not.toBeVisible({ timeout: 6000 });
    } catch (error) {
        // If toast doesn't appear or disappear as expected, that's okay
        console.log('Toast notification check skipped:', error instanceof Error ? error.message : String(error));
    }
}

interface CreateOutfitOptions {
    name?: string;
    description?: string;
    tags?: string;
    isPrivate?: boolean;
    imageUrl?: string;
    items?: Array<{
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }>;
}

export async function createOutfit(page: Page, options: CreateOutfitOptions = {}) {
    const {
        name = `Outfit ${Date.now()}`,
        description = 'A test outfit',
        tags = 'test',
        isPrivate = false,
        imageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        items = [
            {
                name: 'Test Shirt',
                category: 'UPPERWEAR',
                description: 'A test shirt',
                purchaseUrl: 'https://example.com/shirt'
            },
            {
                name: 'Test Pants',
                category: 'LOWERWEAR',
                description: 'Test pants'
            }
        ]
    } = options;

    const outfitForm = new OutfitFormPage(page);

    // Navigate to add outfit page
    await page.goto('/outfits/new');
    await page.waitForLoadState('domcontentloaded');

    // Fill in basic outfit information
    await outfitForm.fillBasicInfo(name, description, tags);

    // Add image URL
    if (imageUrl) {
        await outfitForm.setImageUrl(imageUrl);
    }

    // Set private status if needed
    await outfitForm.setPrivate(isPrivate);

    // Add outfit items
    for (const item of items) {
        await outfitForm.addItem(item);
    }

    // Submit the form
    await outfitForm.submit();

    // Wait for any toast notifications to appear and disappear
    await waitForToastAndDismiss(page);

    return { name, isPrivate };
}

/**
 * Clean up test outfits created during testing
 * This is especially important for production testing
 */
export async function cleanupTestOutfits(page: Page, outfitNames: string[]) {
    console.log(`🧹 Cleaning up ${outfitNames.length} test outfits...`);

    for (const outfitName of outfitNames) {
        try {
            // Navigate to my outfits page
            await page.goto('/my-outfits');

            // Find and click delete button for the specific outfit
            const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
            const deleteButton = outfitCard.locator('button').filter({ hasText: 'Delete' });

            if (await deleteButton.isVisible()) {
                await deleteButton.click();

                // Confirm deletion
                await page.locator('[data-testid="confirm-dialog-confirm"]').click();

                // Wait for deletion to complete
                await page.waitForLoadState('networkidle');

                // Wait for toast notification
                await waitForToastAndDismiss(page);

                console.log(`✅ Deleted outfit: ${outfitName}`);
            } else {
                console.log(`⚠️  Outfit not found for deletion: ${outfitName}`);
            }
        } catch (error) {
            console.error(`❌ Failed to delete outfit ${outfitName}:`, error);
        }

        // Small delay to avoid overwhelming the server
        await page.waitForTimeout(1000);
    }

    console.log('✅ Cleanup completed');
} 