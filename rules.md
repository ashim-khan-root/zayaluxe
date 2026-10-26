# Zaya Luxe — Development Rules

**Version:** 1.0 (draft) · **Date:** 2026-10-26
**Applies to:** backend, storefront, infra, content, and every PR.
**Related:** [`architecture.md`](./architecture.md) · [`phases.md`](./phases.md)

---

## 1. Code style

- **TypeScript strict mode** in every package. No `any` without a comment explaining
  why; prefer `unknown` + narrowing.
- **ESLint flat config + Prettier.** CI fails on lint or format errors.
- **Naming:** `PascalCase` components/types, `camelCase` variables/functions,
  `kebab-case` files for routes, `snake_case` only for DB columns/API fields that Medusa
  already defines.
- **Imports:** absolute aliases (`@/`, `@repo/ui`), no deep relative chains (`../../../`).
- **Server Components by default.** Add `"use client"` only when state, effects, or
  browser APIs are required. Keep client bundles small.
- **No secrets, keys, or tokens in source.** Ever. `.env.example` documents names only.
- **No magic numbers** for money, tax, shipping, or timeouts — constants with names.
- **Comments explain *why*, not *what*.** Link to the ADR when a decision is non-obvious.

### Next.js / React
- App Router only. No Pages Router.
- Data fetching on the server unless it must be client-side.
- Use `next/image` for all content images; explicit dimensions or aspect ratio.
- Use `next/font` with `display: swap`; subset Arabic and Latin separately.
- Mutations via Server Actions or route handlers, validated with Zod.
- No `dangerouslySetInnerHTML` without DOMPurify and a written justification.

### Medusa
- Use **workflows** for multi-step mutations; do not call module services directly from
  API routes when a workflow exists.
- Side effects belong in **subscribers**, not in request handlers.
- Custom code lives in `src/modules`, `src/workflows`, `src/subscribers`, `src/api`,
  `src/admin`. **Never edit `node_modules` or Medusa core.**
- Every custom module ships with a migration and a rollback note.
- Provider modules implement the official interfaces (`AbstractPaymentProvider`,
  `AbstractFulfillmentProvider`) — no ad-hoc gateway calls inside checkout.

---

## 2. Testing

| Layer | Tool | Scope | Gate |
|---|---|---|---|
| Unit | Vitest | utils, pricing, tax, attribute validation, formatting | Must pass |
| Integration | Vitest + test DB | workflows, payment provider, webhooks, revalidation | Must pass |
| E2E | Playwright | browse → PDP → cart → checkout → order; admin fulfilment | Must pass on staging |
| Accessibility | axe + manual | key pages, keyboard, screen reader, RTL | No critical/serious |
| Performance | Lighthouse CI | home, PLP, PDP, cart, checkout | Budgets in CI |
| Load | k6 | browse + checkout concurrency | Phase 5 gate |
| Visual | Playwright screenshots (optional) | design regressions | Advisory |

**Rules**
- New feature → tests in the same PR. No "tests later".
- Bug fix → a failing test first, then the fix.
- Critical business logic (money, tax, shipping, discounts, refunds) → 80%+ coverage.
- Tests must be deterministic: no real network calls, no shared mutable state, no
  reliance on wall-clock time without injection.
- Payment/shipping integrations are tested against **sandbox** credentials only.
- E2E runs against staging with seeded data, not production.

---

## 3. Git workflow

- **Trunk-based:** short-lived branches (`feat/...`, `fix/...`, `chore/...`), merge to
  `main` within 1–2 days.
- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`,
  `perf:`, `ci:`.
- **PR requirements:** description with screenshots/recordings for UI, test evidence,
  risk/rollback note, linked issue, no unrelated changes.
- **Required checks:** lint, typecheck, unit, build, secret scan; E2E for checkout/
  payment changes.
- **Review:** at least one reviewer; the author does not merge their own production
  change without review.
- **Merge:** squash merge; delete branch.
- **Tags:** `vMAJOR.MINOR.PATCH` for production releases; annotated with changelog.
- **Never force-push `main`.** Never commit generated build output, `.env`, or secrets.

---

## 4. Definition of Done

A task is done only when:

- [ ] Acceptance criteria from `prd.md` are met.
- [ ] Code reviewed and merged to `main`.
- [ ] Unit/integration tests added or updated; CI green.
- [ ] E2E updated if a critical path changed.
- [ ] Works in **English and Arabic**, mobile and desktop.
- [ ] Keyboard and screen-reader check done for UI changes.
- [ ] Analytics event added/verified if the change affects the funnel.
- [ ] No new console errors, Sentry noise, or failing Lighthouse budget.
- [ ] Docs/runbook updated if behaviour or operations changed.
- [ ] No secrets, PII, or card data introduced.
- [ ] Feature flag defaults to **off** if user-visible and not fully verified.

---

## 5. Security rules

1. **Card data never touches our systems.** Hosted/redirect payment pages only.
2. **No PAN, CVV, full name+address, or tokens in logs.** Scrub Sentry events.
3. **Verify every webhook:** signature, timestamp, replay cache, idempotency key.
4. **Never trust the browser redirect** as payment proof; query the provider server-side.
5. **Validate every input** with Zod at API boundaries, including headers and query params.
6. **Authorise every request:** customer owns the cart/order; admin role checked server-side.
7. **Rate-limit** auth, checkout, search, newsletter, and contact endpoints.
8. **Hash passwords** with the framework's supported algorithm (bcrypt/argon2), never custom.
9. **Cookies:** `httpOnly`, `Secure`, `SameSite=Lax` (or Strict for admin), scoped paths.
10. **CSP:** default-src self; allow only required payment/analytics domains; no `unsafe-eval`.
11. **Secrets** live in the secret manager; rotate on staff change or suspected leak.
12. **Dependencies:** no critical vulnerabilities; Dependabot PRs reviewed weekly.
13. **Admin** behind Cloudflare Access + 2FA; no shared accounts; audit log retained.
14. **Backups** encrypted; access restricted; restore tested.
15. **Incident response:** contain → assess → notify (if PII) → fix → post-mortem.

---

## 6. Money, tax, and pricing rules

- Store money as **integer minor units**. Never use floats for money.
- Format with `Intl.NumberFormat` using the locale and currency; never hand-concatenate.
- Prices are **explicit per market**. Qatar/QAR is the only active market at launch; the
  data model stays multi-currency, but there is no runtime FX conversion.
- Tax-inclusive display for Qatar; show the tax breakdown where legally required.
- Discounts cannot stack unless explicitly designed; validate server-side, not in the UI.
- Refunds must reconcile to the gateway ledger; record gateway reference IDs.
- A price change is an admin action with an audit trail; bulk imports require a dry run.
- Never hardcode shipping thresholds or tax rates in components — config/DB only.
- **COD is not paid at checkout.** Capture happens on delivery/remittance; never mark a
  COD order paid before the courier remits. COD caps, OTP, and eligibility are config.
- Reconcile COD remittances against orders; short payments and courier fees are recorded,
  not silently absorbed.

---

## 7. Internationalization and RTL

- **No hardcoded user-facing strings.** All copy in `messages/en.json` / `ar.json`.
- Product/content translations come from the database, not JSON, and have a documented
  fallback (Arabic → English) with a visible "not translated" flag in admin.
- Use **logical CSS properties** (`margin-inline-start`, `padding-inline-end`, `inset-inline`)
  or Tailwind logical utilities. No `left/right` in shared components.
- Icons that imply direction (arrows, chevrons) must mirror in RTL; logos and media do not.
- Numbers, dates, and currency use locale-aware formatting; phone numbers use E.164.
- Arabic typography: no letter-spacing, increased line-height, correct font pairing.
- Every UI change is checked in `/ar` at 360px before merge.
- Arabic copy is reviewed by a native speaker; machine translation alone is rejected.

---

## 8. Performance budgets

| Metric | Budget |
|---|---|
| LCP (p75 mobile) | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| TTFB | ≤ 800ms |
| Initial JS (PLP/PDP) | ≤ 200KB gzip |
| Hero image | ≤ 250KB AVIF/WebP |
| Fonts | ≤ 2 families, subset, preloaded |
| Third-party scripts | ≤ 3 before consent; lazy-load the rest |
| API p95 | ≤ 500ms |
| Search p95 | ≤ 150ms |

**Rules:** no layout-shifting embeds; reserve space for images/iframes; defer chat/pixels;
measure on a throttled mobile profile, not desktop. A regression blocks the PR if it
breaches a budget.

---

## 9. Accessibility rules (WCAG 2.2 AA)

- Text contrast ≥ 4.5:1; large text ≥ 3:1; UI components ≥ 3:1.
- Visible focus indicator on every interactive element; never `outline: none` without a
  replacement.
- Target size ≥ 24×24px (prefer 44×44 on mobile).
- Every form field has a persistent label; errors are announced and linked to the field.
- Keyboard: no traps; logical order; skip link; modals restore focus.
- Images have meaningful alt text; decorative images are `alt=""`.
- Motion respects `prefers-reduced-motion`; no autoplay video with sound.
- RTL does not change reading order or focus order incorrectly.
- Test with keyboard + VoiceOver/NVDA on browse, PDP, cart, checkout.

---

## 10. Data and migration rules

- **Backup before any migration or destructive operation.** Verify the backup exists.
- Migrations are additive by default. Destructive changes use expand → migrate → contract.
- Never edit production data by hand without a written record and a backup.
- Never copy production PII to local/staging; use a scrubbed subset.
- Seed data is versioned and idempotent; no manual DB setup steps.
- Soft-delete where legal/audit requires it; hard-delete only per retention policy.
- Data export and deletion requests are handled within the legal window (Qatar PDPPL;
  future-market privacy law when that market is added).
- Analytics events contain no PII beyond a hashed/consented identifier.

---

## 11. Content rules

- Every product has: title, subtitle (optional), description, category, attributes,
  variants, price per market, media, alt text, care/material, size guide, SEO fields.
- Claims (fabric origin, certifications, delivery times) must have a source or be removed.
- Images: rights confirmed, no watermarks, consistent aspect ratio, colour-accurate.
- Arabic and English are written as peers, not translations of convenience.
- Policies are reviewed by counsel; the developer does not invent legal text.
- No placeholder text, lorem ipsum, or "coming soon" on a launch page.

---

## 12. Deploy rules

- Staging deploys automatically from `main`; production requires manual approval.
- Production deploy window: low-traffic hours (Doha), never before a campaign launch
  without a 24h soak.
- Pre-deploy: tests green, backup verified, migration reviewed, rollback command ready.
- Post-deploy: smoke test (home, PLP, PDP, cart, checkout sandbox/live small order),
  watch errors/latency for 15 minutes.
- Rollback if error rate > 1%, checkout failure > 2%, or p95 latency doubles.
- Log every deploy (version, time, approver) in `memory.md` and the ops channel.
- Never deploy on Friday afternoon or during a major campaign unless it is an emergency.

---

## 13. Anti-patterns (do not do)

- ❌ Hardcoding QAR prices, tax rates, or shipping thresholds in components.
- ❌ Treating a COD order as paid at checkout, or reconciling COD cash outside the system.
- ❌ Building garment-specific fields into the core product schema.
- ❌ Using the browser redirect as payment confirmation.
- ❌ Logging request bodies that may contain PII or payment data.
- ❌ `any` on API responses, or skipping validation "because it's internal".
- ❌ Duplicating products per market instead of using price sets.
- ❌ Client-side-only discount/stock validation.
- ❌ Adding a CMS, queue, microservice, or Kubernetes "for later" before it is needed.
- ❌ Merging UI without an Arabic/RTL check.
- ❌ Skipping the backup because "it's a small migration".
- ❌ Machine-translating launch copy and calling it done.
- ❌ Deploying to production on a Friday or without a rollback path.
