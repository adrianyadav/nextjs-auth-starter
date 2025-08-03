# Production Testing Guide

This guide explains how to run tests against the production site at https://www.outfitsave.com/ using the existing test infrastructure.

## Overview

Instead of creating separate production tests, we reuse our existing test suite and simply change the base URL. This approach:

- ✅ **Maintains consistency** between local and production tests
- ✅ **Reduces maintenance** - only one set of tests to maintain
- ✅ **Ensures coverage** - same test scenarios run in both environments
- ✅ **Automatic cleanup** - tests clean up after themselves

## Setup

### 1. Environment Variables

Create a `.env.prod.test` file (or add to your existing `.env`) with production test credentials:

```env
# Production test account credentials
PROD_TEST_EMAIL=your-test-email@example.com
PROD_TEST_PASSWORD=your-test-password
PROD_TEST_NAME=Your Test Name
```

**Important**: Use a dedicated test account, not your personal account.

### 2. Test Account Setup

1. Create a test account on https://www.outfitsave.com/
2. Use this account exclusively for testing
3. Never use your personal account for automated tests

## Running Production Tests

### Basic Production Test
```bash
npm run test:prod
```

### With UI Mode
```bash
npm run test:prod:ui
```

### Specific Test File
```bash
npx playwright test --config=playwright.config.prod.ts tests/outfits/add-outfit.spec.ts
```

### Specific Test
```bash
npx playwright test --config=playwright.config.prod.ts -g "should create a new outfit successfully"
```

## How It Works

### Configuration
- `playwright.config.prod.ts` - Production configuration with `baseURL: 'https://www.outfitsave.com'`
- Uses the same test files as local development
- Environment variables control which credentials to use

### Test Flow
1. **Login** - Uses `PROD_TEST_EMAIL` and `PROD_TEST_PASSWORD` from environment
2. **Execute** - Runs the same test scenarios as local development
3. **Cleanup** - Automatically deletes any outfits created during testing

### Cleanup Process
- Tests track created outfits in a `createdOutfits` array
- `afterEach` hook runs cleanup after each test
- Uses the existing `cleanupTestOutfits` utility function
- Includes delays to avoid overwhelming the production server

## Test Structure

```typescript
test.describe('Add Outfit', () => {
    let createdOutfits: string[] = [];

    test.beforeEach(async ({ page }) => {
        await loginWithTestAccount(page); // Uses env vars for production
    });

    test.afterEach(async ({ page }) => {
        if (createdOutfits.length > 0) {
            await cleanupTestOutfits(page, createdOutfits);
            createdOutfits = [];
        }
    });

    test('should create a new outfit', async ({ page }) => {
        const { name } = await createOutfit(page, outfitData);
        createdOutfits.push(name); // Track for cleanup
        // ... test assertions
    });
});
```

## Best Practices

### 1. Test Data
- Use unique timestamps in test data names
- Include "PROD_TEST" prefix for easy identification
- Keep test data minimal and focused

### 2. Cleanup
- Always track created resources
- Use `afterEach` hooks for cleanup
- Include error handling in cleanup functions

### 3. Credentials
- Never commit test credentials to version control
- Use environment variables for all sensitive data
- Rotate test account passwords regularly

### 4. Rate Limiting
- Include delays between operations
- Don't run too many tests simultaneously
- Be respectful of production resources

## Troubleshooting

### Common Issues

1. **Login Failures**
   - Verify test account credentials
   - Check if account is locked or disabled
   - Ensure account has proper permissions

2. **Cleanup Failures**
   - Check if outfit was actually created
   - Verify delete permissions
   - Look for network errors in logs

3. **Test Failures**
   - Compare with local test results
   - Check for production-specific UI differences
   - Verify data-testid attributes exist in production

### Debug Mode
```bash
npx playwright test --config=playwright.config.prod.ts --debug
```

## Security Considerations

1. **Test Account Isolation**
   - Use dedicated test accounts only
   - Never test with production user data
   - Regularly audit test account permissions

2. **Data Protection**
   - Tests should not access real user data
   - Clean up all test data after runs
   - Use minimal test data sets

3. **Rate Limiting**
   - Respect production rate limits
   - Include appropriate delays
   - Monitor for abuse warnings

## CI/CD Integration

For automated production testing in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run Production Tests
  env:
    PROD_TEST_EMAIL: ${{ secrets.PROD_TEST_EMAIL }}
    PROD_TEST_PASSWORD: ${{ secrets.PROD_TEST_PASSWORD }}
  run: npm run test:prod
```

## Monitoring

- Monitor test execution times
- Track cleanup success rates
- Alert on repeated failures
- Review test logs regularly 