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
    }

    // Navigation methods
    async gotoMyOutfits() {
        await this.page.goto('/my-outfits');
        await this.page.waitForLoadState('networkidle');
    }

    async gotoOutfits() {
        await this.page.goto('/outfits');
        await this.page.waitForLoadState('networkidle');
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

    // Visibility checks
    async expectOutfitVisible(outfitName: string) {
        await expect(this.getOutfitCard(outfitName)).toBeVisible();
    }

    async expectOutfitNotVisible(outfitName: string) {
        await expect(this.getOutfitCard(outfitName)).not.toBeVisible();
    }

    async expectDeleteButtonVisible(outfitName: string) {
        await expect(this.getOutfitDeleteButton(outfitName)).toBeVisible();
    }

    async expectDeleteButtonNotVisible(outfitName: string) {
        await expect(this.getOutfitDeleteButton(outfitName)).not.toBeVisible();
    }

    async expectSaveButtonVisible() {
        await expect(this.saveButtons.first()).toBeVisible();
    }

    async expectSaveButtonNotVisible() {
        await expect(this.saveButtons.first()).not.toBeVisible();
    }

    // Delete methods
    async deleteOutfit(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);
        await deleteButton.click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible();
        await expect(this.confirmDialogMessage).toContainText(outfitName);

        // Confirm deletion
        await this.confirmButton.click();

        // Wait for deletion to complete
        await this.page.waitForLoadState('networkidle');
    }

    async deleteOutfitFromDetailPage() {
        // Click delete button on detail page
        await this.page.locator('[data-testid="delete-outfit-button"]').click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible();

        // Confirm deletion
        await this.confirmButton.click();

        // Wait for redirect to my-outfits page
        await this.page.waitForURL(/.*\/my-outfits/);
    }

    async cancelDeleteOutfit(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);
        await deleteButton.click();

        // Wait for confirmation dialog
        await expect(this.confirmDialogTitle).toBeVisible();

        // Click cancel
        await this.cancelButton.click();

        // Verify dialog is closed
        await expect(this.confirmDialogTitle).not.toBeVisible();
    }

    // Loading state checks
    async expectDeletingState(outfitName: string) {
        const deleteButton = this.getOutfitDeleteButton(outfitName);
        // Check for either "Deleting..." or "Delete" text since the state might change quickly
        try {
            await expect(deleteButton.filter({ hasText: 'Deleting...' })).toBeVisible({ timeout: 1000 });
        } catch {
            // If "Deleting..." is not visible, check if the button is disabled (which indicates loading)
            await expect(deleteButton).toBeDisabled();
        }
    }

    async expectSharingState(outfitName: string) {
        const shareButton = this.getOutfitShareButton(outfitName);
        await expect(shareButton.filter({ hasText: 'Sharing...' })).toBeVisible();
    }

    // URL checks
    async expectOnMyOutfitsPage() {
        await expect(this.page).toHaveURL(/.*\/my-outfits/);
    }

    async expectOnOutfitsPage() {
        await expect(this.page).toHaveURL(/.*\/outfits/);
    }

    // Utility methods
    async waitForOutfitsToLoad() {
        await this.page.waitForLoadState('networkidle');
        // Wait a bit more for any dynamic content
        await this.page.waitForTimeout(1000);
    }

    getOutfitCount(): Promise<number> {
        return this.outfitCards.count();
    }
} 