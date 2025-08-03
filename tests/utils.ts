import { Page } from '@playwright/test';

export async function registerAndLogin(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    // Register a new user
    await page.goto('/register');
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/', { timeout: 10000 });

    return { testEmail, testPassword, testName };
}

export async function loginWithTestAccount(page: Page) {
    // Use environment variables for production testing, fallback to local test account
    const testEmail = process.env.PROD_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.PROD_TEST_PASSWORD || 'password123';
    const testName = process.env.PROD_TEST_NAME || 'Test User';

    // Login with existing test account
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for the form submission to complete
    await page.waitForLoadState('networkidle');

    // Wait for navigation to complete - use a more reliable approach
    await page.waitForURL('/', { timeout: 30000 });

    // Additional wait to ensure the page is fully loaded
    await page.waitForLoadState('domcontentloaded');

    return { testEmail, testPassword, testName };
}

export async function createTestAccount(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    // Register the test account
    await page.goto('/register');
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/', { timeout: 10000 });

    return { testEmail, testPassword, testName };
}

export async function loginWithCredentials(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/', { timeout: 10000 });
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

    // Navigate to add outfit page
    await page.goto('/outfits/new');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Fill in basic outfit information
    await page.fill('input[name="name"]', name);
    await page.fill('textarea[name="description"]', description);
    await page.fill('input[name="tags"]', tags);

    // Add image URL - the new form has an ImageUpload component
    if (imageUrl) {
        // Wait for the ImageUpload component to be ready
        await page.waitForSelector('button:has-text("Image URL")', { timeout: 10000 });

        // First click the "Image URL" button to switch to URL mode
        await page.click('button:has-text("Image URL")');

        // Wait for the URL input field to appear
        await page.waitForSelector('input[id="imageUrl"]', { timeout: 10000 });

        // Then fill in the URL input field
        await page.fill('input[id="imageUrl"]', imageUrl);
    }

    // Set private status if needed
    if (isPrivate) {
        await page.click('button[role="checkbox"]');
    }

    // Add outfit items
    for (const item of items) {
        await page.click('button:has-text("Add Item")');

        // Fill in item details
        await page.fill('input[placeholder="e.g., Nike Air Max, Levi\'s 501 Jeans"]', item.name);
        await page.selectOption('select', item.category);

        if (item.description) {
            await page.fill('input[placeholder="Optional details about this item"]', item.description);
        }

        if (item.purchaseUrl) {
            await page.fill('input[placeholder="https://store.com/item"]', item.purchaseUrl);
        }
    }

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for redirect to my-outfits page
    await page.waitForURL('/my-outfits');

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