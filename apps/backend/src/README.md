# Backend source layout

Medusa v2 application. Custom code lives **only** here — never edit `node_modules` or
Medusa core (rules.md §1).

| Directory | Purpose | Populated in |
|---|---|---|
| `api/` | Custom API routes: payment webhooks, revalidation, product feed | Phase 2–3 |
| `admin/` | Admin widgets/routes (market availability, attribute completeness) | Phase 2 |
| `modules/` | Custom modules: `cod-payment` (ADR-014), catalog attributes | Phase 2–3 |
| `subscribers/` | Side effects: search indexing, ISR revalidation, email, analytics | Phase 2–3 |
| `workflows/` | Multi-step mutations: fulfilment, returns, COD capture, market sync | Phase 3 |
| `jobs/` | Scheduled work: nightly reindex, backup verification, stuck-order sweep | Phase 2–5 |
| `links/` | Module links when a custom module is introduced | Phase 2+ |
| `scripts/` | `seed.ts`, reindex, remittance import | Phase 1+ |

## Rules that apply here

- Multi-step mutations → a **workflow**, not a chain of module calls in an API route.
- Side effects → a **subscriber**, not a request handler.
- Every custom module ships with a migration and a rollback note.
- Payment and fulfilment providers implement Medusa's provider interfaces — no ad-hoc
  gateway calls inside checkout.

## Not yet built (deliberately)

Phase 0 has not passed Gate 0 (phases.md). Only the skeleton exists: no payment
provider, no webhooks, no custom modules. `medusa-config.ts` documents the production
module wiring rather than shipping unverified config.
