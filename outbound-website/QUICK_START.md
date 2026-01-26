# Quick Start Guide

## Running the Development Server

1. Navigate to the project directory:
```bash
cd outbound-website
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## What's Built

### Pages
- **Home (/)** - Complete homepage with all sections:
  - Hero with primary CTAs
  - "What's Broken" section explaining the problem
  - "What Revelius Does" section
  - Three audience cards (Fintechs, Merchants, Network)
  - Flow diagram showing system steps
  - Platform section (Spectra, DeepScope, Pillar)
  - Final CTA section

- **Fintechs (/fintechs)** - Decisioning & compliance infrastructure for fintechs/PSPs
- **Merchants (/merchants)** - Authorization rate optimization for merchants
- **Network (/network)** - Shared intelligence layer information
- **Product (/product)** - Platform details and technical overview
- **Security (/security)** - Security features and compliance certifications
- **Sign In (/signin)** - Google SSO ready sign-in page
- **Request Access (/request-access)** - Fully functional access request form

### Components
All reusable components are in `/src/components`:
- Header with navigation
- Footer
- Hero section
- Audience blocks (3 cards)
- Flow diagram (4 steps)
- Platform section (3 products)
- CTA section

### Navigation
The header includes:
- Product, Solutions (dropdown), Network, Security, Docs, Company
- Sign in and Request access buttons
- Mobile responsive (dropdown for Solutions)

### Styling
- Clean, enterprise-grade design
- Neutral color palette (grays with blue accents)
- No gradients or excessive animations
- Focus on clarity and hierarchy
- Semantic HTML throughout
- Fully responsive

## Next Steps

### Integrating Google SSO

The sign-in page is prepared for Google SSO. To integrate:

1. Set up Google OAuth credentials in Google Cloud Console
2. Install a Google authentication library (e.g., `@react-oauth/google`)
3. Update the `handleGoogleSignIn` function in `/src/pages/SignIn.jsx`
4. Add authentication state management (React Context or state management library)
5. Protect routes that require authentication

### Form Submission

The Request Access form currently logs to console. To connect to a backend:

1. Create an API endpoint for form submissions
2. Update the `handleSubmit` function in `/src/pages/RequestAccess.jsx`
3. Add error handling and validation
4. Consider adding a service like Formspree, Basin, or your own backend

### Adding Analytics

Add Google Analytics, Mixpanel, or other analytics:

1. Install analytics library
2. Add tracking code to `index.html` or create an analytics service
3. Track page views and form submissions

### Deployment

Build for production:
```bash
npm run build
```

Deploy the `dist` folder to:
- Vercel (recommended for Vite projects)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## File Structure

```
/outbound-website
  /src
    /components      # Reusable components
    /pages          # Page components
    App.jsx         # Router setup
    main.jsx        # Entry point
    index.css       # Tailwind + global styles
  index.html        # HTML template
  tailwind.config.js
  package.json
```

## Customization

### Colors
Update colors in `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#0F172A',    // Dark slate
      secondary: '#334155',  // Slate
      accent: '#3B82F6',     // Blue
    }
  }
}
```

### Fonts
The site uses Inter font from Google Fonts (loaded in `index.html`).
To change, update the font import and `tailwind.config.js`.

### Content
All content is directly in the component/page files. No CMS yet.
To edit content, modify the relevant `.jsx` files.

## Support

For questions or issues, refer to:
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
