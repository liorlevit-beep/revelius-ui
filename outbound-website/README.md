# Revelius Outbound Website

The complete marketing and entry-point website for Revelius - the intelligence layer between merchants and money.

## Tech Stack

- **React 19.2** - UI library
- **Vite 7.3** - Build tool and dev server
- **Tailwind CSS 3.x** - Styling framework
- **React Router 7.13** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/outbound-website
  /src
    /components       # Reusable UI components
      Header.jsx      # Navigation with active route highlighting
      Footer.jsx      # Site footer with legal links
      Hero.jsx        # Homepage hero
      PageHero.jsx    # Reusable page hero
      PageLayout.jsx  # Page wrapper
      PageTitle.jsx   # Document title management
      Section.jsx     # Reusable content section
      CTAInline.jsx   # Two-button CTA component
      CTASection.jsx  # Homepage CTA section
      AudienceBlocks.jsx    # Three audience cards
      FlowDiagram.jsx       # Four-step process
      PlatformSection.jsx   # Platform components
    /pages           # Page components
      Home.jsx                # Homepage
      Product.jsx             # Product overview
      Solutions.jsx           # Solutions hub
      SolutionsFintechs.jsx   # Fintechs solution
      SolutionsMerchants.jsx  # Merchants solution
      NetworkPage.jsx         # Network information
      SecurityPage.jsx        # Security features
      Docs.jsx               # Documentation hub
      Company.jsx            # About & contact
      Privacy.jsx            # Privacy policy
      Terms.jsx              # Terms of service
      SignIn.jsx             # Sign in page
      RequestAccess.jsx      # Access request form
    App.jsx          # Main app with routing
    main.jsx         # Entry point
    index.css        # Tailwind imports and global styles
  index.html         # HTML template
  tailwind.config.js # Tailwind configuration
```

## Pages & Routes

### Main Pages
- **/** - Homepage with hero, value props, and platform overview
- **/product** - Product details and platform layers
- **/solutions** - Solutions hub (3 entry points)
- **/solutions/fintechs** - Solutions for fintechs and PSPs
- **/solutions/merchants** - Solutions for merchants
- **/network** - Revelius Network information
- **/security** - Security and compliance features
- **/docs** - Documentation hub (placeholder)
- **/company** - About page with contact form
- **/signin** - Sign in page (Google SSO ready)
- **/request-access** - Access request form with role dropdown

### Legal Pages
- **/legal/privacy** - Privacy policy
- **/legal/terms** - Terms of service

## Key Features

### Reusable Components
- **PageHero** - Consistent hero sections with eyebrow, title, subtitle
- **PageLayout** - Wrapper for all pages
- **Section** - Content sections with optional eyebrow, title, body
- **CTAInline** - Two-button CTA blocks
- **PageTitle** - Automatic document title management

### Navigation
- Active route highlighting
- Solutions dropdown menu
- Mobile responsive (future enhancement)
- Consistent header/footer across all pages

### Forms
- **Request Access** - Dynamic form with role-based messaging
  - Merchant: "Tell us about your payments and regions."
  - Fintech: "Tell us about your onboarding and routing needs."
  - PSP Partner: "Tell us about partnership and integration."
- **Company Contact** - Simple contact form with local state

### Design System
- Clean, enterprise-grade aesthetic
- Neutral color palette (gray scale with blue accent)
- No gradients
- Consistent spacing (py-16 for sections)
- Inter font from Google Fonts
- Semantic HTML throughout

## Content Strategy

The site presents Revelius in three ways:
1. **For Fintechs** - Decisioning & compliance layer
2. **For Merchants** - Authorization rate optimization
3. **For PSP Partners** - Shared intelligence network

All copy is production-ready with exact messaging from brand guidelines.

## Future Integrations

### Google SSO
The sign-in page is structured for Google OAuth integration:
1. Set up OAuth credentials in Google Cloud Console
2. Install authentication library
3. Update `SignIn.jsx` handleGoogleSignIn function
4. Add auth state management
5. Protect authenticated routes

### Form Backend
Request access and contact forms currently use local state:
1. Create API endpoints for form submissions
2. Update form submit handlers
3. Add server-side validation
4. Set up email notifications
5. Store submissions in database/CRM

### Analytics
Add tracking for:
- Page views
- Form submissions
- CTA click rates
- Navigation patterns

## Styling

### Colors
```js
primary: '#0F172A' // Dark slate
secondary: '#334155' // Slate
accent: '#3B82F6' // Blue
```

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold (700)
- Body: Regular (400)
- Links: Medium (500)

### Spacing
- Sections: `py-16` (64px vertical)
- Cards: `p-6` or `p-8`
- Buttons: `px-8 py-4`

## Build Output

Production build size:
- HTML: 0.95 kB (gzip: 0.52 kB)
- CSS: 13.16 kB (gzip: 3.17 kB)
- JS: 269.69 kB (gzip: 81.66 kB)

Total: ~284 kB (~85 kB gzipped)

## Browser Support

Modern browsers (ES6+):
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

Recommended platforms:
- **Vercel** - Optimal for Vite projects
- **Netlify** - Easy continuous deployment
- **Cloudflare Pages** - Fast CDN

Build command: `npm run build`  
Output directory: `dist/`

Configure redirects for client-side routing (SPA mode).

## Maintenance

### Update Content
Edit component/page files directly in `/src/pages` and `/src/components`.

### Add New Pages
1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Header.jsx` if needed
4. Add footer link in `Footer.jsx` if needed

### Modify Styles
Update Tailwind configuration in `tailwind.config.js` or use utility classes.

## License

Copyright © 2026 Revelius. All rights reserved.
