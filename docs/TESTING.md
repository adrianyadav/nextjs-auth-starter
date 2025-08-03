# Testing Guide

This project uses Playwright for end-to-end testing with a focus on reliable selectors using `data-testid` attributes.

## Test Selectors

Instead of relying on CSS classes or text content for test selectors, we use `data-testid` attributes for better reliability and maintainability.

### Key Test IDs

#### Outfit Cards
- `outfit-card-{id}` - Individual outfit card links
- `delete-button-{id}` - Delete button for specific outfit
- `share-button-{id}` - Share button for specific outfit

#### Dialog Components
- `confirm-dialog` - Confirmation dialog overlay
- `confirm-dialog-title` - Dialog title
- `confirm-dialog-message` - Dialog message content
- `confirm-dialog-confirm` - Confirm button
- `confirm-dialog-cancel` - Cancel button

#### Action Buttons
- `save-to-my-outfits-button` - Save outfit button on detail page
- `delete-outfit-button` - Delete outfit button on detail page

#### Authentication Elements
- `email-input` - Email input field
- `password-input` - Password input field
- `name-input` - Name input field (registration)
- `submit-button` - Form submit button
- `error-message` - Error message display
- `register-link` - Link to registration page
- `login-link` - Link to login page
- `logout-button` - Logout button (desktop)
- `logout-button-mobile` - Logout button (mobile)
- `google-signin-button` - Google OAuth sign-in button

#### Home Page Elements
- `save-new-outfit-button` - Save new outfit button (logged in)
- `view-my-outfits-button` - View my outfits button (logged in)
- `get-started-button` - Get started button (logged out)
- `sign-in-button` - Sign in button (logged out)

#### Loading States
- `loading-spinner` - Loading spinner component

### Benefits of Using data-testid

1. **Reliability**: Not affected by CSS class changes or styling updates
2. **Maintainability**: Clear intent and purpose for each selector
3. **Performance**: Faster than text-based selectors
4. **Clarity**: Makes test code more readable and self-documenting

### Example Usage

```typescript
// Instead of this (fragile):
page.locator('button').filter({ hasText: 'Delete' })

// Use this (reliable):
page.locator('[data-testid^="delete-button-"]')

// Instead of this (fragile):
page.locator('div[class*="fixed inset-0 bg-black/50"]')

// Use this (reliable):
page.locator('[data-testid="confirm-dialog"]')
```

### Adding New Test IDs

When adding new interactive elements, always include a `data-testid` attribute:

```tsx
<Button 
  data-testid="my-action-button"
  onClick={handleAction}
>
  Action
</Button>
```

### Test ID Naming Convention

- Use kebab-case for test IDs
- Be descriptive but concise
- Include context when needed (e.g., `delete-button-${id}`)
- Use prefixes for related elements (e.g., `confirm-dialog-*`)

This approach ensures our tests remain stable and maintainable as the application evolves. 