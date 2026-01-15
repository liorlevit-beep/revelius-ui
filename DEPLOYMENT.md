# GitHub Pages Deployment Guide

## Overview
This React + Vite application is configured to deploy to GitHub Pages at:
- **Repository**: `liorlevit-beep/revelius-ui`
- **Pages URL**: https://liorlevit-beep.github.io/revelius-ui/
- **Deployment Source**: `/docs` folder on `main` branch

## Configuration Changes

### 1. Vite Configuration (`vite.config.ts`)
- Set `base: '/revelius-ui/'` to ensure assets load correctly from the GitHub Pages subdirectory

### 2. Build Output (`package.json`)
- Modified build script to output to `docs` folder instead of `dist`:
  ```json
  "build": "tsc -b && vite build --outDir docs"
  ```

### 3. SPA Routing Support

#### 404.html Redirect Handler (`public/404.html`)
- GitHub Pages returns 404 for client-side routes
- Custom 404.html captures the route and stores it in sessionStorage
- Redirects to the base URL `/revelius-ui/`

#### Route Restoration (`src/main.tsx`)
- On app initialization, checks sessionStorage for redirected route
- Restores the original URL using `history.replaceState()`
- Ensures deep links work on hard refresh

### 4. API Configuration
- Backend API calls use `import.meta.env.VITE_REVELIUS_API_BASE_URL`
- API base URL is configurable via environment variables
- No changes needed - API calls will continue hitting the real backend

### 5. Jekyll Bypass (`.nojekyll`)
- Empty `.nojekyll` file in `public/` prevents GitHub Pages from processing with Jekyll
- Ensures files starting with `_` and other assets load correctly

## GitHub Pages Setup

1. **Enable GitHub Pages**:
   - Go to: `https://github.com/liorlevit-beep/revelius-ui/settings/pages`
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/docs`
   - Click Save

2. **Build and Deploy**:
   ```bash
   npm run build
   git add docs/
   git commit -m "build: deploy to GitHub Pages"
   git push origin main
   ```

3. **Wait for Deployment**:
   - GitHub Actions will automatically deploy the site
   - Check deployment status in the "Actions" tab
   - Site will be live at: https://liorlevit-beep.github.io/revelius-ui/

## Testing Deep Links

After deployment, test the following:
- ✅ Root URL: https://liorlevit-beep.github.io/revelius-ui/
- ✅ Deep link: https://liorlevit-beep.github.io/revelius-ui/merchants
- ✅ Hard refresh on deep link (should not show 404)
- ✅ API calls still hit the configured backend
- ✅ Dark/light mode switching works

## Environment Variables

Create a `.env.local` file for local development:

```env
# Revelius API Base URL (required)
VITE_REVELIUS_API_BASE_URL=https://api.revelius.com

# Revelius API Credentials (optional - can be configured via UI)
VITE_REVELIUS_ACCESS_KEY=your_access_key_here
VITE_REVELIUS_SECRET_KEY=your_secret_key_here

# Mock Mode (optional)
VITE_REVELIUS_MOCK=0
```

For production deployment, set these in GitHub repository secrets if needed.

## Important Notes

1. **Base Path**: All routes and assets are prefixed with `/revelius-ui/`
2. **API Independence**: Frontend and backend are completely separate
3. **SPA Routing**: Client-side routing works via the 404.html redirect mechanism
4. **No Server**: GitHub Pages serves static files only
5. **Asset Paths**: Vite automatically handles asset paths based on the `base` config

## Troubleshooting

### White Page on Load
- Check browser console for 404 errors
- Verify `base` path in `vite.config.ts` matches repository name
- Ensure `docs/` folder is committed and pushed

### Deep Links Return 404
- Verify `404.html` exists in `docs/`
- Check that redirect restoration logic in `main.tsx` is present
- Clear browser cache and try again

### API Calls Fail
- Check `VITE_REVELIUS_API_BASE_URL` environment variable
- Verify CORS settings on backend API
- Check browser network tab for actual request URLs

### Assets Not Loading
- Verify `.nojekyll` file exists in `docs/`
- Check that asset paths in build are using `/revelius-ui/` prefix
- Look for console errors about MIME types

## Maintenance

### Updating the Deployment
```bash
# Make your changes
npm run build
git add docs/
git commit -m "update: description of changes"
git push origin main
```

### Reverting to Local Development
No changes needed - the app works identically in development mode:
```bash
npm run dev
```
The `base` path only affects production builds.
