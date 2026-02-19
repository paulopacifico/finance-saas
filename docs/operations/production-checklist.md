# Production Checklist

## Core
- [x] Build passes (`npm run build`)
- [x] Lint passes without errors (`npm run lint`)
- [x] 404 page (`app/not-found.tsx`)
- [x] App error boundary (`app/error.tsx`)

## Marketing / Conversion
- [x] CTA tracking hooks (`lib/analytics/tracking.ts`)
- [x] Pricing and nav CTA tracking connected
- [x] Newsletter validation + loading + success/error states

## Performance
- [x] Section reveal via IntersectionObserver (`components/landing/MicroInteractions.tsx`)
- [x] Reduced-motion support across interactive sections
- [x] Content visibility optimization for below-the-fold sections

## Metadata
- [x] Open Graph metadata configured (`app/layout.tsx`)
- [x] Twitter card metadata configured (`app/layout.tsx`)
- [x] Favicon in place (`app/favicon.ico`)

## Manual QA (run before release)
- [ ] Lighthouse in production build (`Performance`, `Accessibility`, `Best Practices`, `SEO`)
- [ ] Cross-browser QA (Chrome, Firefox, Safari, Edge)
- [ ] Device QA (iPhone, Android, iPad)
- [ ] Conversion events verified in analytics provider
