# Landing Design System

## Token Sources
- CSS variables: `app/globals.css`
- JS constants: `lib/landing/constants.ts`

## Color Guidelines
- Primary action: `--accent` / `--accent-dim`
- Supporting surfaces: `--bg-card`, `--bg-elevated`
- Text hierarchy:
  - Primary: `--text-primary`
  - Secondary: `--text-secondary`
  - Muted/meta: `--text-muted`

## Typography
- Sans: `--font-dm-sans`
- Serif accent: `--font-playfair`
- Mono (data): UI monospace fallback stack in component styles

## Spacing
- Core section spacing uses `--section-padding`
- Container width uses `--container`

## Breakpoints
Defined in `lib/landing/constants.ts`:
- Mobile: `<= 639px`
- Tablet: `640px - 1023px`
- Desktop: `>= 1024px`
- Large: `>= 1536px`

## Interaction Rules
- `:focus-visible` is required for all interactive controls.
- Min tap target: `44px` on mobile.
- Reduced motion always respected (`prefers-reduced-motion`).
