# Analytics Event Schema

Source utility: `lib/analytics/tracking.ts`

## Transport
`trackEvent(event, payload)` forwards to (when present):
- `window.gtag("event", event, payload)`
- `window.dataLayer.push({ event, ...payload })`
- `window.plausible(event, { props: payload })`
- custom browser event: `finflow:track`

## Event Catalog
| Event | Trigger | Payload fields |
|---|---|---|
| `cta_click` | Hero/Nav/Mobile menu/Bottom CTA clicks | `location` (`hero`,`nav`,`mobile_menu`,`bottom_cta`), `action` |
| `billing_toggle` | Pricing monthly/annual toggle | `cycle` (`monthly`,`annual`) |
| `pricing_comparison_toggle` | Show/hide pricing comparison table | `next_state` (boolean) |
| `pricing_cta_click` | Plan-level CTA click | `plan` (`starter`,`pro`,`enterprise`), `billing_cycle` |
| `interaction` | Scroll-to-top click | `action` (`scroll_to_top`) |
| `newsletter_submit_invalid` | Footer newsletter submit with invalid email | `location` (`footer`) |
| `newsletter_submit_failed` | Footer newsletter simulated submit failure | `location` (`footer`) |
| `newsletter_subscribed` | Footer newsletter successful submit | `location` (`footer`) |

## Recommended KPI Mapping
- **CTA CTR**: `cta_click` by `location` / page sessions
- **Pricing intent**:
  - Plan interest: `pricing_cta_click` by `plan`
  - Annual intent: `billing_toggle` where `cycle=annual`
- **Comparison usage**: share of sessions with `pricing_comparison_toggle`
- **Newsletter conversion**:
  - success rate: `newsletter_subscribed` / (`newsletter_subscribed` + `newsletter_submit_failed` + `newsletter_submit_invalid`)
  - invalid-entry rate: `newsletter_submit_invalid` / newsletter attempts
- **Engagement assist**: `interaction(action=scroll_to_top)` as deep-scroll proxy

## Naming/Versioning Rules
- Use snake_case event names.
- Keep payload keys stable; add new keys without renaming old ones.
- If breaking schema, append `_v2` to event name and dual-write during migration.

## QA Checklist (Analytics)
- Verify each event in browser DevTools via `window.addEventListener('finflow:track', console.log)`.
- Verify provider ingestion (GA/Plausible/GTM) in preview and production.
- Confirm no personally identifiable information is sent in payloads.
