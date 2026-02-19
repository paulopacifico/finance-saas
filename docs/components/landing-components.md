# Landing Components

## Structure
- Organisms:
  - `components/landing/Hero.tsx`
  - `components/landing/Features.tsx`
  - `components/landing/Pricing.tsx`
  - `components/landing/Testimonials.tsx`
  - `components/landing/Footer.tsx`
- Global interaction layer:
  - `components/landing/MicroInteractions.tsx`
- Navigation:
  - `components/landing/Navbar.tsx`

## Shared Utilities
- Reduced motion hook: `lib/hooks/useReducedMotion.ts`
- Landing constants: `lib/landing/constants.ts`
- Landing animation constants: `lib/landing/animations.ts`
- Analytics tracking helper: `lib/analytics/tracking.ts`

## Usage Notes
- All major landing sections use `data-reveal` and are observed by `MicroInteractions`.
- Track high-value conversions through `trackEvent(...)` calls in CTA handlers.
- Keep new interactive components keyboard-accessible and focus-visible.
