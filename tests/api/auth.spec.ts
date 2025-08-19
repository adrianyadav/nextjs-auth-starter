import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
    test('should reject unauthenticated requests to protected endpoints', async ({ request }) => {
        // Test that protected endpoints require authentication
        const response = await request.post('/api/outfits', {
            data: {
                name: 'Test Outfit',
                description: 'A test outfit'
            }
        });

        // Should return 401 Unauthorized
        expect(response.status()).toBe(401);

        const errorData = await response.json();
        expect(errorData.error).toBe('Unauthorized');
    });

    test('should allow public access to public endpoints', async ({ request }) => {
        // Test that public endpoints are accessible without authentication
        const response = await request.get('/api/outfits');

        // Should return 200 OK
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.outfits).toBeDefined();
        expect(data.totalPages).toBeDefined();
        expect(data.currentPage).toBeDefined();
    });

    test('should validate required fields on protected endpoints', async ({ request }) => {
        // Test validation without authentication (should fail on auth first)
        const response = await request.post('/api/outfits', {
            data: {
                // Missing required 'name' field
                description: 'A test outfit without name'
            }
        });

        // Should return 401 Unauthorized (not 400 validation error)
        // because auth check happens before validation
        expect(response.status()).toBe(401);
    });

    test('should handle unsupported HTTP methods', async ({ request }) => {
        // Test that unsupported methods return appropriate errors
        const response = await request.put('/api/outfits');

        // Should return 405 Method Not Allowed
        expect(response.status()).toBe(405);
    });
});
