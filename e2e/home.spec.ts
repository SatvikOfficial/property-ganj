import { test, expect } from '@playwright/test';
import { ai } from '@zerostep/playwright';

test.describe('Property Ganj E2E', () => {
    test('Homepage loads and search functions', async ({ page }) => {
        await page.goto('/');

        // Verify Homepage
        const title = await page.title();
        expect(title).toContain('PropertyGanj');

        // AI Check
        await ai('Verify that the dynamic greeting is visible', { page, test });
        await ai('Verify that search tabs like "Buy", "Rent" are visible', { page, test });

        // Test Search
        await ai('Click on the "Rent" tab', { page, test });
        await ai('Type "Gomti Nagar" into the search bar', { page, test });
        await ai('Click the search button', { page, test });

        // Expect navigation
        await page.waitForURL(/\/search/);
        await ai('Verify that search results page is loaded', { page, test });
    });

    test('Backend API Health Check', async ({ request }) => {
        const properties = await request.get('/api/properties');
        expect(properties.ok()).toBeTruthy();

        const localities = await request.get('/api/localities/stats');
        expect(localities.ok()).toBeTruthy();

        const agents = await request.get('/api/agents');
        expect(agents.ok()).toBeTruthy();
    });
});
