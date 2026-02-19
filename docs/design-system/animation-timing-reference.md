# Animation Timing Reference

Central source: `lib/landing/animations.ts`

## Core Timings
- Counter animations: `counterMs`
- Price counter: `priceCounterMs`
- Analytics chart tick: `analyticsTickMs`
- Report progress tick: `reportProgressTickMs`
- Hero dashboard view cycle: `dashboardViewCycleMs`
- Testimonial progress tick: `testimonialProgressTickMs`

## Motion Principles
- Use transform/opacity-based animation where possible.
- Avoid layout-thrashing animation (`top/left/width/height`) for moving elements.
- Respect `prefers-reduced-motion` in component logic and CSS overrides.
