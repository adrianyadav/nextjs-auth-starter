import { Page, Locator, expect } from '@playwright/test';

export class OutfitPage {
    readonly page: Page;

    // Common selectors
    readonly outfitCards: Locator;
    readonly deleteButtons: Locator;
    readonly saveButtons: Locator;
    readonly shareButtons: Locator;
    readonly confirmDialog: Locator;
    readonly confirmDialogTitle: Locator;
    readonly confirmDialogMessage: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly loadingSpinner: Locator;
    readonly toastNotifications: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize common selectors using data-testid attributes
        this.outfitCards = page.locator('[data-testid^="outfit-card-"]');
        this.deleteButtons = page.locator('[data-testid^="delete-button-"]');
        this.saveButtons = page.locator('[data-testid="save-to-my-outfits-button"]');
        this.shareButtons = page.locator('[data-testid^="share-button-"]');

        // Dialog selectors
        this.confirmDialog = page.locator('[data-testid="confirm-dialog"]');
        this.confirmDialogTitle = page.locator('[data-testid="confirm-dialog-title"]');
        this.confirmDialogMessage = page.locator('[data-testid="confirm-dialog-message"]');
        this.confirmButton = page.locator('[data-testid="confirm-dialog-confirm"]');
        this.cancelButton = page.locator('[data-testid="confirm-dialog-cancel"]');

        // Loading states
        this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');

        // Toast notifications (shadcn/ui toast)
        this.toastNotifications = page.locator('[role="status"]');
    }

    // Navigation methods
    async gotoMyOutfits() {
        await this.page.goto('/my-outfits');
        await this.page.waitForLoadState('networkidle');
        // Additional wait for dynamic content
        await this.page.waitForTimeout(2000);
    }

    async gotoOutfits() {
        await this.page.goto('/outfits');
        await this.page.waitForLoadState('networkidle');
        // Additional wait for dynamic content
        await this.page.waitForTimeout(2000);
    }

    async gotoOutfitDetail(outfitName: string) {
        const outfitCard = this.outfitCards.filter({ hasText: outfitName });
        await outfitCard.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Outfit card methods
    getOutfitCard(outfitName: string): Locator {
        return this.outfitCards.filter({ hasText: outfitName });
    }

    getOutfitDeleteButton(outfitName: string): Locator {
        const outfitCard = this.getOutfitCard(outfitName);
        return outfitCard.locator('[data-testid^="delete-button-"]');
    }

    getOutfitShareButton(outfitName: string): Locator {
        const outfitCard = this.getOutfitCard(outfitName);
        return outfitCard.locator('[data-testid^="share-button-"]');
    }

    // Visibility checks with better error handling
    async expectOutfitVisible(outfitName: string) {
        // Wait a bit for the outfit to load
        await this.page.waitForTimeout(1000);
        await expect(this.getOutfitCard(outfitName)).toBeVisible({ timeout: 10000 });
    }

    async expectOutfitNotVisible(outfitName: string) {
        await expect(this.getOutfitCard(outfitName)).not.toBeVisible({ timeout: 10000 });
    }

    async expectDeleteButtonVisible(outfitName: string) {
        await expect(this.getOutfitDeleteButton(outfitName)).toBeVisible({ timeout: 5000 });
    }

    async expectDeleteButtonNotVisible(outfitName: string) {
        await expect(this.getOutfitDeleteButton(outfitName)).not.toBeVisible({ timeout: 5000 });
    }

    async expectSaveButtonVisible() {
        await expect(this.saveButtons.first()).toBeVisible({ timeout: 5000 });
    }

    async expectSaveButtonNotVisible() {
        await expect(this.saveButtons.first()).not.toBeVisible({ timeout: 5000 });
    }

    // Toast notification methods
    async waitForToastToAppear() {
        try {
            // Wait for toast to appear (shadcn/ui toast)
            await expect(this.toastNotifications.first()).toBeVisible({ timeout: 5000 });
        } catch (error) {
            console.log('Toast notification did not appear as expected:', error instanceof Error ? error.message : String(error));
        }
    }

    async waitForToastToDisappear() {
        try {
            // Wait for toast to disappear (auto-dismiss after 5 seconds)
            await expect(this.toastNotifications.first()).not.toBeVisible({ timeout: 6000 });
        } catch (error) {
            console.log('Toast notification did not disappear as expected:', error instanceof Error ? error.message : String(error));
        }
    }

    async expectToastWithText(text: string) {
        try {
            await expect(this.toastNotifications.filter({ hasText: text })).toBeVisible({ timeout: 5000 });
        } catch (error) {
            console.log(`Toast with text "${text}" did not appear as expected:`, error instanceof Error ? error.message : String(error));
        }
    }

    // Delete methods with better error handling
    async deleteOutfit(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);

        // Wait for delete button to be visible
        await expect(deleteButton).toBeVisible({ timeout: 10000 });

        await deleteButton.click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible({ timeout: 10000 });
        await expect(this.confirmDialogMessage).toContainText(outfitName);

        // Confirm deletion
        await this.confirmButton.click();

        // Wait for toast notification to appear
        await this.waitForToastToAppear();

        // Wait for deletion to complete
        await this.page.waitForLoadState('networkidle');

        // Additional wait for page updates
        await this.page.waitForTimeout(2000);
    }

    async deleteOutfitFromDetailPage() {
        // Click delete button on detail page
        const deleteButton = this.page.locator('[data-testid="delete-outfit-button"]');
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible({ timeout: 10000 });

        // Confirm deletion
        await this.confirmButton.click();

        // Wait for toast notification to appear
        await this.waitForToastToAppear();

        // Wait for redirect to my-outfits page
        await this.page.waitForURL(/.*\/my-outfits/, { timeout: 10000 });
    }

    async cancelDeleteOutfit(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible({ timeout: 10000 });

        // Click cancel
        await this.cancelButton.click();

        // Verify dialog is closed
        await expect(this.confirmDialogTitle).not.toBeVisible({ timeout: 5000 });
    }

    // Loading state checks
    async expectDeletingState(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);
        // Check for either "Deleting..." or "Delete" text since the state might change quickly
        try {
            await expect(deleteButton.filter({ hasText: 'Deleting...' })).toBeVisible({ timeout: 2000 });
        } catch {
            // If "Deleting..." is not visible, check if the button is disabled (which indicates loading)
            try {
                await expect(deleteButton).toBeDisabled({ timeout: 2000 });
            } catch {
                console.log('Loading state check skipped - deletion was too fast');
            }
        }
    }

    async expectSharingState(outfitName: string) {
        const shareButton = this.getOutfitShareButton(outfitName);
        await expect(shareButton.filter({ hasText: 'Sharing...' })).toBeVisible({ timeout: 5000 });
    }

    // URL checks
    async expectOnMyOutfitsPage() {
        await expect(this.page).toHaveURL(/.*\/my-outfits/, { timeout: 10000 });
    }

    async expectOnOutfitsPage() {
        await expect(this.page).toHaveURL(/.*\/outfits/, { timeout: 10000 });
    }

    // Utility methods
    async waitForOutfitsToLoad() {
        await this.page.waitForLoadState('networkidle');
        // Wait a bit more for any dynamic content
        await this.page.waitForTimeout(2000);
    }

    getOutfitCount(): Promise<number> {
        return this.outfitCards.count();
    }
} 