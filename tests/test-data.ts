// Centralized test data for outfit tests
// This serves as the single source of truth for all outfit-related test data
//
// IMPORTANT: All test outfits MUST include the "test" tag to ensure they are
// properly cleaned up by the delete-test-outfits.ts script. This prevents
// test data from accumulating and ensures seeded data is never accidentally deleted.

export interface TestOutfitItem {
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
}

export interface TestOutfitData {
    name: string;
    description: string;
    tags: string;
    isPrivate?: boolean;
    items: TestOutfitItem[];
}

// Default test outfit data
export const getDefaultOutfitData = (isPrivate = false): TestOutfitData => ({
    name: `${isPrivate ? 'Private ' : ''}Test Summer Casual Outfit ${Date.now()}`,
    description: 'A comfortable summer outfit for casual occasions',
    tags: 'test',
    isPrivate,
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

// Public outfit data for save tests
export const getPublicOutfitData = (): TestOutfitData => ({
    name: `Public Save Test Outfit ${Date.now()}`,
    description: 'A public outfit to test saving',
    tags: 'test, save, public',
    isPrivate: false,
    items: [
        {
            name: 'Public T-Shirt',
            category: 'UPPERWEAR',
            description: 'A public t-shirt for saving',
            purchaseUrl: 'https://example.com/public-tshirt'
        },
        {
            name: 'Public Jeans',
            category: 'LOWERWEAR',
            description: 'Public jeans for saving'
        }
    ]
});

// Minimal outfit data for quick tests
export const getMinimalOutfitData = (isPrivate = false): TestOutfitData => ({
    name: `${isPrivate ? 'Private ' : ''}Minimal Test Outfit ${Date.now()}`,
    description: 'A minimal test outfit',
    tags: 'test',
    isPrivate,
    items: [
        {
            name: 'Test Shirt',
            category: 'UPPERWEAR',
            description: 'A test shirt'
        }
    ]
});

// Winter outfit data for variety
export const getWinterOutfitData = (isPrivate = false): TestOutfitData => ({
    name: `${isPrivate ? 'Private ' : ''}Test Winter Formal Outfit ${Date.now()}`,
    description: 'A warm winter outfit for formal occasions',
    tags: 'test, winter, formal',
    isPrivate,
    items: [
        {
            name: 'Wool Sweater',
            category: 'UPPERWEAR',
            description: 'Warm wool sweater',
            purchaseUrl: 'https://example.com/sweater'
        },
        {
            name: 'Dress Pants',
            category: 'LOWERWEAR',
            description: 'Formal dress pants'
        }
    ]
}); 