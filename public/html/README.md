# Payment Pages

This directory contains EJS templates for payment-related pages.

## Template

### `payment-status.ejs`

A single, dynamic EJS template that handles all payment statuses using injected variables.

**URLs:**

- `/api/subscription/success` - Payment success
- `/api/subscription/failure` - Payment failure
- `/api/subscription/error` - Payment error

**Template Variables:**

- `status`: 'success' | 'failure' | 'error'
- `title`: Page title
- `heading`: Main heading text
- `subtitle`: Subtitle text
- `icon`: Emoji icon
- `iconColor`: CSS color for icon
- `titleColor`: CSS color for title
- `backgroundGradient`: CSS gradient for background
- `borderColor`: CSS color for info section border
- `featureIconColor`: CSS color for feature icons
- `subscriptionId`: Subscription ID (optional)

## Features

- ✅ **Single Template**: One EJS file handles all payment statuses
- ✅ **Dynamic Content**: Content changes based on injected variables
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Clean, professional appearance with gradients and animations
- ✅ **User-Friendly**: Clear messaging and helpful action buttons
- ✅ **Accessible**: Proper contrast ratios and readable fonts
- ✅ **Consistent Branding**: WJBTI branding and color scheme

## Styling

The template uses:

- Modern CSS with flexbox and grid
- Responsive design with mobile-first approach
- Smooth transitions and hover effects
- Professional color scheme
- Clean typography using system fonts
- Dynamic colors based on payment status

## Usage

The template is automatically rendered by the `SubscriptionPaymentPagesController` when users are redirected from payment gateways. Each endpoint passes different variables to create the appropriate page.

## Customization

To customize the template:

1. Edit `payment-status.ejs`
2. Modify styles in the `<style>` section
3. Update content and messaging as needed
4. Add new variables to the controller methods
5. Test on different screen sizes

## Environment Variables

The following environment variables are used:

- `FRONTEND_URL`: Base URL for redirects (defaults to `http://localhost:3000`)
- `APP_URL`: Base URL for callback URLs (defaults to `http://localhost:3000`)

## NestJS Configuration

The view engine is configured using NestJS's proper API in `app.config.ts`:

- `setBaseViewsDir()`: Sets the directory for EJS templates
- `setViewEngine()`: Configures EJS as the view engine
- `useStaticAssets()`: Serves static assets from the public directory
