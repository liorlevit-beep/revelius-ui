# Payment Provider Logos

This directory contains SVG logos for payment providers displayed in the Payment Providers page.

## File Naming Convention

Logo files must be named exactly as the provider key with `.svg` extension:

```
{provider_key}.svg
```

### Examples:
- `stripe.svg` - for provider key "stripe"
- `adyen.svg` - for provider key "adyen"
- `stripe_us.svg` - for provider key "stripe_us"
- `paypal.svg` - for provider key "paypal"

## File Format

- **Format**: SVG only
- **Recommended size**: 128x128px or larger (vectorized)
- **Background**: Transparent or white
- **Color**: Provider brand colors preferred

## Fallback Behavior

If a logo SVG is not found for a provider:
1. ✅ An initials avatar will be displayed automatically
2. ⚠️  A console warning will appear in dev mode
3. 🔍 Debug info shows the resolved path in development

## How to Add a New Logo

1. Get the provider's official SVG logo
2. Name it as `{provider_key}.svg`
3. Place it in this directory (`/public/provider-logos/`)
4. Refresh the Payment Providers page

The app will automatically detect and load the new logo!

## Current Providers

Check the console in dev mode to see which providers are missing logos.
The system will log:
- ✅ `Found logo for "provider-key"` - Logo loaded successfully
- ⚠️  `Missing logo for "provider-key"` - Using initials fallback

## Technical Notes

- Logos are fetched from `/provider-logos/{key}.svg`
- Caching is handled automatically
- No external hotlinking is used
- All logos are served locally for performance and reliability
