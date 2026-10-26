# Zaya Luxe — Development Phases & Gates

**Version:** 1.0 (draft) · **Date:** 2026-10-26
**Status:** Phase 0 not started — awaiting client workshop
**Related:** [`prd.md`](./prd.md) · [`architecture.md`](./architecture.md) · [`rules.md`](./rules.md)

---

## Standing rules

1. **No phase starts before the previous gate passes with evidence.** "It works on my
   machine" is not evidence; a staging URL, test output, screenshot, or signed checklist is.
2. **Content and payment KYC are the critical path.** If product photos/copy are not in
   by end of week 3, the launch date moves — the quality bar does not.
3. **Qatar-only launch; future markets deferred.** Do not activate India/GCC until Qatar
   has proven unit economics and the entity, tax, and logistics for that market are real.
4. **Every phase updates `memory.md`** with decisions, blockers, and lessons.
5. **Production deploys require explicit human approval.** Staging is automatic on `main`.
6. **One vertical slice at a time.** Build browse → PDP → cart → checkout → order before
   adding secondary features.
7. **Definition of Done applies to every task** (see `rules.md`), not just phase gates.

---

## Timeline at a glance

| Week | Phase | Focus | Client dependency |
|---|---|---|---|
| 0–1 | 0 | Discovery, decisions, access, KYC start | High |
| 1–2 | 1 | Foundation, staging, CI/CD, design tokens | Medium |
| 2–4 | 2 | Catalog, PDP/PLP, search, cart, en/ar | Content starts |
| 4–6 | 3 | Checkout, payments, tax, shipping, orders | Payment KYC, shipping |
| 6–7 | 4 | Content, SEO, analytics, policies | Content freeze, Arabic review |
| 7–8 | 5 | QA, a11y, performance, security, DR | UAT availability |
| 9 | 6 | UAT, training, launch, hypercare | Sign-off |
| — | 7 | Future markets (deferred) | Separate business decision |
| 10+ | 8 | Operate and evolve | Monthly review |

**Launch target:** end of week 9, assuming Phase 0 signs in week 0 and content arrives by
week 3. Add one week of buffer for payment KYC or Arabic review delays.

---

## Phase 0 — Discovery and decisions

**Status:** `PENDING` · **Weeks:** 0–1 · **Owner:** us + client

### Tasks
- [ ] 0.1 Kick-off workshop (60–90 min): business model, assortment, price positioning,
      launch date, campaign date, success metrics, decision-makers.
- [ ] 0.2 Confirm scope: categories at launch, 20–30 SKUs, **Qatar only**, en/ar, online + COD.
- [ ] 0.3 Legal/entity: Qatar CR/trade licence, tax status, data residency, privacy counsel;
      confirm the registered company can complete gateway KYC.
- [ ] 0.4 Online gateway selection (client): present `payments.md` (Tap, MyFatoorah, PayTabs,
      QNB QPay). Client names a **provisional primary + fallback by end of week 1** and
      finalises by **week 3**; collect the KYC pack and **start the application** on the
      primary (2–4 week lead time). Define COD caps/fee/courier in parallel.
- [ ] 0.5 Shipping model: Qatar warehouse/3PL, local courier, rates, delivery promise,
      COD remittance, returns logistics.
- [ ] 0.6 Domain and DNS: registrar access, move `zayaluxe.co` to Cloudflare, decide on a
      defensive `zayaluxe.qa` registration.
- [ ] 0.7 Business email: Google Workspace or Zoho; SPF, DKIM, DMARC; `support@`,
      `orders@`, `returns@`.
- [ ] 0.8 Accounts: AWS, Cloudflare, R2, Resend, Sentry, GA4, Meta, TikTok, Snapchat,
      Google Merchant Center, WhatsApp Business.
- [ ] 0.9 Content audit: product list, photos (count/quality/rights), copy, Arabic
      translations, size charts, care labels, policy drafts.
- [ ] 0.10 Analytics plan: events, conversions, consent, attribution, dashboards.
- [ ] 0.11 Risk register + RACI + communication cadence (weekly demo, async updates).
- [ ] 0.12 Confirm stack and hosting decisions D1–D13 from `README.md`.

### Gate 0 — signed scope
- [ ] Scope, timeline, and launch assortment signed by the client.
- [ ] Decision log D1–D13 resolved or explicitly deferred with an owner/date.
- [ ] Access checklist C1–C13 has an owner and a date for every item.
- [ ] **Client has named a provisional primary + fallback** (evidence: written choice);
      final choice due end of week 3.
- [ ] Payment KYC application submitted for the provisional primary (evidence: reference number).
- [ ] COD caps, fee, courier, and reconciliation owner agreed.
- [ ] Launch date and content-freeze date agreed in writing.
- [ ] **User confirmation: "we're building this."**

---

## Phase 1 — Foundation

**Status:** `PENDING` · **Weeks:** 1–2 · **Depends on:** Gate 0

### Tasks
- [ ] 1.1 Scaffold monorepo with `npx create-medusa-app@latest --with-nextjs-starter`
      (Medusa v2 + Next.js starter); pin Node 22, package manager, lockfile.
- [ ] 1.2 Restructure to `apps/backend`, `apps/storefront`, `packages/*`, `infra/*`.
- [ ] 1.3 Local Docker Compose: Postgres 16, Redis 7, Meilisearch; seed script.
- [ ] 1.4 Environment matrix and `.env.example` for local/staging/prod; secrets in
      1Password/Doppler; document every variable and owner.
- [ ] 1.5 CI: install, lint, typecheck, unit tests, build, secret scan, dependency audit.
- [ ] 1.6 Staging infrastructure: EC2 (Bahrain), Docker, Caddy, Cloudflare DNS/TLS,
      `staging.zayaluxe.co`, basic auth/`noindex`, firewall to Cloudflare IPs.
- [ ] 1.7 Medusa baseline config: Postgres, Redis cache/event bus/workflow/locking,
      S3/R2 file storage, CORS, publishable key, admin user.
- [ ] 1.8 Seed the Qatar region (QA/QAR), tax region, stock location, shipping options,
      sales channel; keep the multi-currency structure but activate only QAR.
- [ ] 1.9 Design tokens + layout shell: header, nav, footer, container, typography,
      colours, RTL switch; `@storefront-ui/react` + Tailwind preset.
- [ ] 1.10 Backup job (nightly `pg_dump` → R2) + restore test #1 documented.
- [ ] 1.11 Runbooks skeleton: deploy, rollback, restore, secrets.
- [ ] 1.12 ADRs recorded for any deviation from `architecture.md`.

### Gate 1 — environment proven
- [ ] `docker compose up` boots the full stack locally from a clean clone.
- [ ] Staging URL serves storefront + API; admin reachable only through Access.
- [ ] CI green on `main`; staging deploy automatic; rollback tested once.
- [ ] Restore test #1 passes (restored DB serves a product on staging).
- [ ] Design tokens reviewed and approved (or explicitly provisional).
- [ ] **Evidence:** URLs, CI run links, restore log, screenshots.

---

## Phase 2 — Catalog and discovery (vertical slice)

**Status:** `PENDING` · **Weeks:** 2–4 · **Depends on:** Gate 1

### Tasks
- [ ] 2.1 Category taxonomy + launch attribute sets (apparel, accessories) with en/ar
      labels, filterable flags, required flags, display order.
- [ ] 2.2 Admin setup: categories, collections, product types, tags, options, variants,
      QAR price sets (multi-currency ready), inventory.
- [ ] 2.3 Import 20–30 real products with media, copy, attributes, size charts.
- [ ] 2.4 PDP: gallery (zoom, video), variant selector with availability, price,
      size guide, dynamic spec table, care, delivery estimate, returns summary, JSON-LD.
- [ ] 2.5 PLP: category/collection templates, facets from attributes, sort, pagination,
      SEO copy, empty/loading/error states.
- [ ] 2.6 Search: Meilisearch index, Arabic config, synonyms, typo tolerance, zero-result
      recovery, analytics events; nightly reindex.
- [ ] 2.7 Cart: drawer/page, persistence, quantity, promo code, stock validation,
      cross-sell, free-shipping threshold.
- [ ] 2.8 i18n scaffold: `next-intl`, `/en` + `/ar`, RTL shell, translated UI strings,
      locale switcher, `hreflang` basics.
- [ ] 2.9 Revalidation webhook: product/category change → ISR tag invalidation.
- [ ] 2.10 Content QA: en/ar parity, image alt text, price display, variant matrix.

### Gate 2 — browse → PDP → cart works
- [ ] A shopper can land on home, browse a category, filter, open a PDP, switch variant,
      add to cart, and see the correct QAR total — in English and Arabic.
- [ ] RTL layout has no overflow, mirrored icons, or broken alignment at 360px.
- [ ] Search returns relevant results for 20 curated queries (including Arabic).
- [ ] Lighthouse on PDP: performance ≥ 85, SEO ≥ 95, accessibility ≥ 95 (lab).
- [ ] Adding a new test category with new attributes requires **no code deploy** —
      prove it on staging and record the steps.
- [ ] **Evidence:** staging URLs, Lighthouse report, screen recording of the new
      category flow.

---

## Phase 3 — Checkout, payments, and the Qatar market

**Status:** `PENDING` · **Weeks:** 4–6 · **Depends on:** Gate 2

### Tasks
- [ ] 3.1 Checkout: guest + account, address form, phone validation, shipping options,
      order summary, discount, tax-inclusive display.
- [ ] 3.2a **Final gateway choice confirmed** (hard deadline end of week 3). If the client
      has not chosen, proceed with the provisional primary and record the launch risk.
- [ ] 3.2 Client-selected gateway provider module (Qatar): hosted page, 3DS, Apple Pay,
      capture, void, refund/partial refund, signed webhooks, idempotency.
- [ ] 3.3 NAPS/QPay support via the gateway, or QNB QPay as a secondary method.
- [ ] 3.4 COD payment provider: pending session, OTP/WhatsApp verification, capture on
      delivery, cancellation/refusal, remittance import, reconciliation report.
- [ ] 3.5 Tax configuration: Qatar (confirm VAT status); tax-inclusive pricing; invoice
      data fields.
- [ ] 3.6 Shipping: Qatar rates (Doha next-day, rest 2–3 days, free threshold), COD
      eligibility by area/value, ETA display, tracking number entry.
- [ ] 3.7 Emails: order confirmation, payment failed, shipping, delivered, refund,
      password reset, welcome; en/ar + RTL; Resend + React Email.
- [ ] 3.8 Orders: admin fulfilment, cancellation, return/RMA, refund, partial refund,
      restock, CSV export.
- [ ] 3.9 Discounts: percentage/fixed, minimum spend, usage limit, expiry, market scope.
- [ ] 3.10 Analytics: view_item, add_to_cart, begin_checkout, add_payment_info, purchase
      (browser + server-side), correct currency/value.
- [ ] 3.11 Payment failure UX: retry, alternate method, support/WhatsApp link.
- [ ] 3.12 Fraud/abuse: rate limits, Turnstile on auth/newsletter, COD verification.

### Gate 3 — money moves correctly
- [ ] Sandbox order paid in Qatar (card + Apple Pay) → order created once → confirmation
      email received in en and ar.
- [ ] Refund and partial refund reconcile in gateway and admin.
- [ ] Webhook replay does not duplicate the order; invalid signature is rejected.
- [ ] COD order can be placed, verified, fulfilled, delivered, remitted, and reconciled.
- [ ] No card data appears in logs, DB, or browser network payloads.
- [ ] Analytics `purchase` event verified in GA4 debug view with correct value/currency.
- [ ] **Evidence:** order IDs, gateway dashboard screenshots, email screenshots, webhook
      logs, GA4 debug output.

---

## Phase 4 — Content, SEO, and launch polish

**Status:** `PENDING` · **Weeks:** 6–7 · **Depends on:** Gate 3

### Tasks
- [ ] 4.1 Home page: hero, category entry points, editorial blocks, best sellers, trust
      bar, newsletter/WhatsApp capture.
- [ ] 4.2 Editorial: lookbook, journal (MDX), about, contact, FAQ, size guide hub.
- [ ] 4.3 Policies: privacy, terms, shipping, returns/exchanges, cookies, payment.
- [ ] 4.4 Arabic translation of all UI, product copy, emails, policies; native review.
- [ ] 4.5 SEO: per-page metadata, canonicals, hreflang (`en-QA`, `ar-QA`), sitemaps,
      robots, OG images, structured data, Merchant Center feed.
- [ ] 4.6 Analytics/consent: GA4, Meta Pixel + CAPI, TikTok, Snapchat, consent banner,
      UTM persistence.
- [ ] 4.7 Lifecycle: newsletter double opt-in, abandoned cart, welcome flow.
- [ ] 4.8 Trust: payment badges, delivery promise, WhatsApp contact, returns clarity,
      size help, real photography.
- [ ] 4.9 Error pages, empty states, loading skeletons, offline/retry behaviour.
- [ ] 4.10 Redirect map if a legacy site/domain exists.

### Gate 4 — content frozen and discoverable
- [ ] All launch pages have en/ar content and approved imagery.
- [ ] Native Arabic reviewer signs off (not machine translation).
- [ ] SEO audit: titles, descriptions, canonicals, hreflang, structured data, sitemap,
      no `noindex` on production, no broken links.
- [ ] Consent banner blocks non-essential scripts until consent.
- [ ] Merchant Center feed validates with zero errors.
- [ ] Policies approved by client/counsel.
- [ ] **Evidence:** content freeze sign-off, SEO crawl export, feed validation, policy
      approval email.

---

## Phase 5 — Hardening

**Status:** `PENDING` · **Weeks:** 7–8 · **Depends on:** Gate 4

### Tasks
- [ ] 5.1 Full regression matrix: iOS Safari, Chrome Android, Chrome, Safari, Firefox,
      Edge; 320/360/390/768/1024/1440; en/ar; Qatar region only.
- [ ] 5.2 Accessibility audit (WCAG 2.2 AA): keyboard, focus, contrast, targets, forms,
      screen reader, reduced motion, RTL; fix all critical/serious.
- [ ] 5.3 Performance: Lighthouse CI budgets, image/font optimisation, JS splitting,
      third-party script audit, Core Web Vitals lab + field baseline.
- [ ] 5.4 Security: headers, CSP, WAF rules, rate limits, auth/session tests, dependency
      scan, admin access review, secret scan, OWASP ASVS L2 checklist.
- [ ] 5.5 Load test (k6): 100 concurrent browsers, 20 concurrent checkouts, search burst;
      tune Postgres/Redis/Node; record p95.
- [ ] 5.6 DR drill: restore production-like backup to staging; rollback deploy; document
      timings.
- [ ] 5.7 Payment resilience: timeout, decline, webhook delay/replay, refund failure,
      provider outage; verify customer messaging.
- [ ] 5.8 Monitoring/alerts: Sentry, uptime checks, infra alerts, payment success alert,
      order-stuck alert; test each alert fires.
- [ ] 5.9 Runbooks complete and reviewed; on-call/support rota agreed.

### Gate 5 — launch-ready evidence
- [ ] Zero open Sev-1/Sev-2 bugs; Sev-3s have owners and dates.
- [ ] A11y: zero critical/serious issues; documented exceptions with rationale.
- [ ] CWV targets met on mobile (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).
- [ ] Load test passes at target concurrency with p95 ≤ 500ms API.
- [ ] Restore and rollback drills pass with timings recorded.
- [ ] Security checklist signed; no secrets in git; admin gated.
- [ ] Every alert fires in a test and reaches the agreed channel.
- [ ] **Evidence:** reports, test outputs, drill logs, alert screenshots.

---

## Phase 6 — Launch and hypercare

**Status:** `PENDING` · **Week 9** · **Depends on:** Gate 5

### Tasks
- [ ] 6.1 UAT with client: scripted scenarios (browse, buy, refund, return, admin tasks)
      in en/ar; written sign-off.
- [ ] 6.2 Training: admin product/order/refund/discount flows; SOPs; short videos.
- [ ] 6.3 DNS cutover: lower TTL 24h before, point `zayaluxe.co`/`www` to Cloudflare,
      verify TLS, HSTS, email auth (SPF/DKIM/DMARC).
- [ ] 6.4 Production seed: regions, shipping, taxes, payment live keys, products,
      content, policies, redirects.
- [ ] 6.5 Live smoke: real low-value online order + refund, plus a COD order through
      dispatch/remittance; verify emails, analytics, tracking.
- [ ] 6.6 Go-live checklist signed; rollback command pre-typed; war room channel open.
- [ ] 6.7 Hypercare 14 days: daily order/payment/error review, same-day Sev-2 fixes.
- [ ] 6.8 Post-launch review: metrics baseline, incident log, lessons learned.
- [ ] 6.9 Handover pack: credentials (via 1Password), runbooks, architecture, contacts.

### Gate 6 — live and supported
- [ ] Real customer order placed and fulfilled end-to-end.
- [ ] No Sev-1 incidents in the first 72 hours.
- [ ] Client signs off on admin operation and support process.
- [ ] Monitoring and alerts owned by a named person.
- [ ] Hypercare schedule complete; maintenance plan agreed.

---

## Phase 7 — Future markets (deferred)

**Status:** `DEFERRED` · **Trigger:** Qatar stable for 90 days + a written business case

India, GCC, or any other market is a **separate project**, not a continuation of launch.
Do not start it because the architecture supports it; start it because Qatar is working.

### Entry criteria
- [ ] Qatar has 90 days of trading with positive contribution margin.
- [ ] Payment success ≥ 95%, return rate within target, support load manageable.
- [ ] The target market's entity, tax registration, importer of record, and payment
      account are real (e.g. Indian entity + Razorpay for India).
- [ ] Local fulfilment/returns model is chosen and costed (3PL vs DDP).
- [ ] A written business case shows a path to positive unit economics.

### Tasks when triggered
- [ ] 7.1 Confirm entity, bank account, payment account, tax registration.
- [ ] 7.2 Choose fulfilment and returns; model landed cost and RTO.
- [ ] 7.3 Activate local payment methods and local price set.
- [ ] 7.4 Local shipping rates, ETA, reverse logistics, invoice format.
- [ ] 7.5 Local content, pricing, catalog subset, SEO.
- [ ] 7.6 Local analytics/marketing and support channel.
- [ ] 7.7 4-week pilot; track conversion, AOV, return rate, CAC, contribution margin.
- [ ] 7.8 Go/no-go review with unit economics.

### Gate 7 — pilot verdict
- [ ] ≥ 50 orders or 4 weeks of data (whichever is longer).
- [ ] Payment success ≥ 95%; return/RTO rate within agreed threshold.
- [ ] Contribution margin positive after shipping, duties, returns, and payment fees.
- [ ] Written go/no-go decision with next steps.

---

## Phase 8 — Operate and evolve

**Status:** `ONGOING` · **Week 10+**

- [ ] Monthly: patch dependencies, review Sentry/alerts, backup restore sample, cost review.
- [ ] Quarterly: Medusa minor upgrade, accessibility spot check, performance regression,
      security review, DR drill.
- [ ] Per new category: attribute set, size/care templates, shipping profile, content,
      QA; target zero engineering deploys (proves the category-agnostic design).
- [ ] Roadmap candidates: reviews, wishlist, loyalty, WhatsApp order updates, 3PL
      automation, ERP/accounting integration, Hindi, B2B.
- [ ] Retirement plan: data export, DNS/email transition, credential revocation.

---

## RACI

| Workstream | Client | Us | Payment provider | Courier/3PL |
|---|---|---|---|---|
| Brand, assortment, pricing | **A/R** | C | — | — |
| Product content/photos | **A/R** | C | — | — |
| Platform build | C | **A/R** | C | C |
| Payment KYC | **A/R** | C | C | — |
| Payment integration | I | **A/R** | C | — |
| Shipping setup | **A/R** | C | — | **R** |
| Tax/legal/policies | **A/R** | C | I | — |
| Arabic review | **A/R** | C | — | — |
| QA/UAT | C | **R** | — | — |
| Go-live approval | **A** | R | — | — |
| Hypercare | I | **R** | C | C |
| Ongoing operations | **A/R** | C | — | — |

**A** = accountable, **R** = responsible, **C** = consulted, **I** = informed.

---

## Decision log (gate approvals)

| Gate | Date | Approved by | Evidence link | Notes |
|---|---|---|---|---|
| 0 | — | — | — | Pending workshop |
| 1 | — | — | — | — |
| 2 | — | — | — | — |
| 3 | — | — | — | — |
| 4 | — | — | — | — |
| 5 | — | — | — | — |
| 6 | — | — | — | — |
| 7 | — | — | — | — |
