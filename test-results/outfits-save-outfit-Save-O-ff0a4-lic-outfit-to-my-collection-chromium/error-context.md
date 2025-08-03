# Page snapshot

```yaml
- banner:
  - navigation:
    - link "OUTFIT SAVE":
      - /url: /
    - link "Browse":
      - /url: /outfits
    - link "Sign In":
      - /url: /login
    - link "📚 Docs":
      - /url: /docs
- main:
  - text: Sign in to your account Enter your email and password to access your account Email address
  - textbox "Email address": test@example.coml
  - text: Password
  - textbox "Password": password123
  - text: Invalid credentials
  - button "Sign in"
  - text: Or continue with
  - button "Sign in with Google":
    - img
    - text: Sign in with Google
  - link "No account? Register.":
    - /url: /register
- contentinfo:
  - link "OUTFIT SAVE":
    - /url: /
  - paragraph: © 2025 OutfitSave. All rights reserved.
  - text: Made with ❤️ for fashion lovers
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
- alert
```