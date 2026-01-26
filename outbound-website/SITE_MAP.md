# Revelius Website Site Map

## Navigation Structure

```
HEADER
├─ Revelius (logo) → /
├─ Product → /product
├─ Solutions → /solutions
│  ├─ For Fintechs → /solutions/fintechs
│  └─ For Merchants → /solutions/merchants
├─ Network → /network
├─ Security → /security
├─ Docs → /docs
├─ Company → /company
└─ [Right Side]
   ├─ Sign in → /signin
   └─ Request access → /request-access
```

## Complete Page Hierarchy

### 🏠 Home (/)
**Purpose:** Main landing page  
**Sections:**
- Hero: "The intelligence layer between merchants and money"
- What's broken: Context missing in payments
- What Revelius does: Business reality → payment intelligence
- Three audiences: Fintechs / Merchants / Network
- How it works: 4-step flow (Discover, Understand, Route, Prove)
- Platform: Spectra, DeepScope, Pillar
- CTA: Request access / Join network

### 🔧 Product (/product)
**Purpose:** Product details and platform layers  
**Sections:**
- Hero: "The Revelius Intelligence Layer"
- What it is: Business understanding → outcomes
- Components: Spectra / DeepScope / Pillar (3 cards)
- Outputs: Evidence-first decisioning
- Integration: Middleware approach
- CTA: Request access / Join network

### 🎯 Solutions Hub (/solutions)
**Purpose:** Central hub for audience-specific pages  
**Sections:**
- Hero: "One system. Three entry points."
- Three solution cards:
  - For Fintechs → /solutions/fintechs
  - For Merchants → /solutions/merchants
  - For PSP Partners → /network
- Why this works: Aligned incentives
- CTA: Request access / Sign in

### 🏦 Solutions: Fintechs (/solutions/fintechs)
**Purpose:** Fintechs and PSPs solution page  
**Sections:**
- Hero: "For fintechs and PSPs"
- Problems: Beyond static rules
- What Revelius enables: Smarter routing
- Outcomes: Better approvals, lower exposure
- CTA: Request access / Talk to us

### 🏪 Solutions: Merchants (/solutions/merchants)
**Purpose:** Merchants solution page  
**Sections:**
- Hero: "For merchants"
- Problems: Lost revenue from declines
- How it works: Get understood correctly
- Outcomes: Higher approval rates
- CTA: "Improve my authorization rate" / Sign in

### 🌐 Network (/network)
**Purpose:** PSP network information  
**Sections:**
- Hero: "Join the Revelius Network"
- What it is: Not a marketplace
- Why join: Increase approvals
- How partners connect: Lightweight integration
- CTA: Join network / Security overview

### 🔒 Security (/security)
**Purpose:** Security and compliance features  
**Sections:**
- Hero: "Enterprise security and auditability"
- Access control: RBAC and audit trails
- Data handling: Secure storage
- Evidence integrity: Time-stamped artifacts
- CTA: Request security docs / Sign in

### 📚 Docs (/docs)
**Purpose:** Documentation hub (placeholder)  
**Sections:**
- Hero: "Documentation"
- Public docs: Limited access
- Doc links: API basics, Scanning, Evidence, SSO (all placeholders)
- CTA: Sign in / Request access

### 🏢 Company (/company)
**Purpose:** About and contact  
**Sections:**
- Hero: "About Revelius"
- Mission: Turn context into intelligence
- Contact form (4 fields with local state)
  - Anchor: #contact
- CTA: Request access / Join network

### 🔐 Sign In (/signin)
**Purpose:** Authentication page  
**Features:**
- Google SSO button (ready for integration)
- Link to request access
- Terms acceptance note

### 📝 Request Access (/request-access)
**Purpose:** Lead capture with dynamic messaging  
**Features:**
- User type dropdown (Merchant/Fintech/Partner/Other)
- Conditional description based on type
- 7 fields: Type, Email, Company, Role, Volume, Regions, Notes
- Success state with confirmation

### ⚖️ Privacy (/legal/privacy)
**Purpose:** Privacy policy summary  
**Sections:**
- What we collect
- How we use it
- Data retention
- Contact
- Note: Enterprise DPA available on request

### 📄 Terms (/legal/terms)
**Purpose:** Terms of service  
**Sections:**
- Website use
- No warranties
- Limitation of liability
- Contact
- Note: Enterprise agreements govern product use

## Footer Structure

```
FOOTER
├─ Brand
│  └─ Revelius + tagline
├─ Product
│  ├─ Platform → /product
│  ├─ Security → /security
│  └─ Docs → /docs
├─ Solutions
│  ├─ For Fintechs → /solutions/fintechs
│  ├─ For Merchants → /solutions/merchants
│  └─ Network → /network
└─ Company & Legal
   ├─ About → /company
   ├─ Contact → /company#contact
   ├─ Privacy → /legal/privacy
   └─ Terms → /legal/terms
```

## User Journeys

### Journey 1: Fintech/PSP
1. Land on Home (/)
2. See "Decisioning & compliance infrastructure" card
3. Click "Explore for Fintechs" → /solutions/fintechs
4. Read about reducing false declines
5. Click "Request access" → /request-access
6. Select "Fintech / PSP" from dropdown
7. Fill form and submit

### Journey 2: Merchant
1. Land on Home (/)
2. See "Increase authorization rates" card
3. Click "Improve my authorization rate" → /solutions/merchants
4. Read about misclassification problems
5. Click "Improve my authorization rate" → /request-access
6. Select "Merchant" from dropdown
7. Fill form and submit

### Journey 3: PSP Partner
1. Land on Home (/)
2. See "Shared intelligence layer" card
3. Click "Join the Revelius Network" → /network
4. Read about network benefits
5. Click "Join the network" → /request-access
6. Select "PSP Partner" from dropdown
7. Fill form and submit

### Journey 4: Learning
1. Land on Home (/)
2. Click "Product" in nav → /product
3. Read about platform layers
4. Click "Security" in nav → /security
5. Read about compliance features
6. Click "Request security documentation" → /request-access
7. Fill form

### Journey 5: Contact
1. Land on any page
2. Click "Company" in nav → /company
3. Scroll to contact form (#contact)
4. Fill 4-field form
5. Submit and see success message

## Page Relationships

```
                    Home (/)
                       |
        ┌──────────────┼──────────────┐
        │              │              │
    Product      Solutions        Network
    /product     /solutions        /network
        │              │
        │      ┌───────┴───────┐
        │      │               │
        │   Fintechs      Merchants
        │   /solutions/  /solutions/
        │   fintechs     merchants
        │
    Security
    /security
        │
    ┌───┴───┐
  Docs   Company
  /docs  /company
            │
            └─ Contact Form (#contact)

Auth/Forms:
- Sign In (/signin)
- Request Access (/request-access)

Legal:
- Privacy (/legal/privacy)
- Terms (/legal/terms)
```

## CTA Mapping

Every page has clear CTAs:

| Page | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| Home | Request access | Join the network |
| Product | Request access | Join the network |
| Solutions | Request access | Sign in |
| Solutions/Fintechs | Request access | Talk to us |
| Solutions/Merchants | Improve my auth rate | Sign in |
| Network | Join the network | Security overview |
| Security | Request security docs | Sign in |
| Docs | Sign in | Request access |
| Company | Request access | Join the network |

## Active States

Navigation highlights active route:
- Exact match: `/product` highlights "Product"
- Prefix match: `/solutions/*` highlights "Solutions"
- Dropdown: Solutions dropdown shows fintechs/merchants

## Mobile Considerations

**Current Status:** Desktop-first approach
- Navigation visible on `md:` breakpoint and up
- Mobile hamburger menu: Not yet implemented
- All content responsive via Tailwind breakpoints

**Recommended Addition:** Mobile hamburger menu for Header navigation

## SEO Structure

Each page has:
- Unique document title via PageTitle component
- Semantic HTML (h1, h2, section, nav, footer)
- Clear heading hierarchy
- Meta description in index.html (global)

**Recommended:** Add per-page meta descriptions for SEO

## Form Validation

### Request Access Form
- Required: User type, Email, Company, Role
- Optional: Volume, Regions, Notes
- Validation: HTML5 (type="email", required attributes)

### Company Contact Form
- Required: Name, Email, Company, Message
- Validation: HTML5

**Recommended:** Add custom validation messages and error states

## Summary

- **Total Pages:** 13
- **Total Routes:** 13
- **Reusable Components:** 12
- **Forms:** 2 (Request Access, Contact)
- **Navigation Levels:** 2 (main + dropdown)
- **Legal Pages:** 2
- **Audience-Specific Pages:** 3 (Fintechs, Merchants, Network)

All pages follow consistent design patterns with PageLayout, PageHero, Section, and CTAInline components.
