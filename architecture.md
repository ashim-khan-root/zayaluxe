# Zaya Luxe — System Architecture

**Version:** 1.0 (draft) · **Date:** 2026-10-26
**Related:** [`prd.md`](./prd.md) · [`phases.md`](./phases.md) · [`rules.md`](./rules.md)

---

## 1. Architecture principles

1. **Category-agnostic, not garment-shaped.** No hardcoded size/colour/fabric columns.
   Categories own attribute sets; the storefront renders them dynamically.
2. **One catalog, many markets.** Products exist once; regions/currencies/prices,
   shipping options, and payment providers are market configuration.
3. **Boring, proven infrastructure.** Docker Compose, Postgres, Redis, Caddy,
   Cloudflare. No Kubernetes, no serverless database gymnastics for v1.
4. **Hosted payments.** Redirect/hosted page keeps card data off our servers (SAQ A).
5. **Provider isolation.** Payment and fulfilment gateways implement Medusa provider
   interfaces so a gateway can be swapped without touching checkout logic.
6. **Server-first frontend.** React Server Components by default; client components only
   where interaction demands it.
7. **Evidence over assumption.** Every phase gate is proven on staging, not asserted.

---

## 2. Stack

| Layer | Choice | Version at planning | Why |
|---|---|---|---|
| Commerce backend | Medusa v2 | 2.18.x | Open source, modules/workflows, regions, provider interfaces |
| Runtime | Node.js | 22 LTS | Medusa + Next.js support; LTS until 2027 |
| Language | TypeScript (strict) | 5.x | Shared types across backend/storefront |
| Storefront | Next.js App Router | 16.x | SSR/ISR, RSC, SEO, image optimisation |
| UI | React 19 + Tailwind CSS 4 + `@storefront-ui/react` | current | User-standard ecommerce UI kit; copy-paste components |
| Database | PostgreSQL | 16 | Medusa requirement; reliable, boring |
| Cache/events | Redis | 7 | Medusa caching, event bus, workflow engine, locking |
| Search | Meilisearch | current | Arabic support, facets, typo tolerance, self-hosted |
| Media | Cloudflare R2 | — | Cheap object storage, CDN, S3-compatible |
| Email | Resend + React Email | — | Bilingual transactional templates, good DX |
| Payments | Client-selected Qatar gateway (Tap / MyFatoorah / PayTabs / QNB QPay) | — | Hosted page, Apple Pay, QAR settlement; see `payments.md` |
| COD | Custom Medusa provider (`pp_cod_cod`) | — | Cash on delivery with verification + reconciliation |
| Shipping | Manual → Aramex/local courier (Qatar) | — | Avoid launch blocked on carrier APIs |
| Future payments | Razorpay/UPI and other local methods | — | Deferred with future markets |
| CDN/WAF/DNS | Cloudflare | — | DNS, TLS, WAF, bot protection, Turnstile, Access |
| Hosting | AWS EC2 `me-south-1` (Bahrain) | — | GCC latency + simpler Qatar data posture |
| Containers | Docker + Docker Compose | — | Reproducible, one-host v1 |
| Reverse proxy | Caddy | 2.x | Automatic TLS, simple config |
| CI/CD | GitHub Actions + GHCR | — | Build, test, deploy, rollback |
| Errors | Sentry | — | Backend + storefront, release tagging |
| Uptime/logs | Better Stack (or Grafana Cloud free) | — | Alerts + structured logs |
| Analytics | GA4, Meta CAPI, TikTok, Snapchat | — | Qatar acquisition channels |
| Consent | CookieYes or custom | — | Qatar PDPPL (future-market laws when added) |
| Testing | Vitest, Playwright, axe, k6 | — | Unit, E2E, a11y, load |

> Versions are pinned in `package.json` and the lockfile at Phase 1. Medusa moves
> fast; re-check the v2 docs for breaking changes before each upgrade.

---

## 3. Repository layout

```
zayaluxe/
├── apps/
│   ├── backend/                 # Medusa v2 application
│   │   ├── src/
│   │   │   ├── admin/           # custom admin widgets/routes
│   │   │   ├── api/             # custom API routes (webhooks, feeds)
│   │   │   ├── modules/         # payment, fulfilment, catalog-attributes
│   │   │   ├── subscribers/     # product events → search/revalidate
│   │   │   ├── workflows/       # order, returns, market sync
│   │   │   └── scripts/         # seed, reindex, import
│   │   ├── medusa-config.ts
│   │   └── package.json
│   └── storefront/              # Next.js 16 App Router
│       ├── src/
│       │   ├── app/[locale]/    # en/ar routes
│       │   ├── components/      # ui + commerce blocks
│       │   ├── lib/             # medusa client, analytics, seo
│       │   ├── messages/        # en.json, ar.json
│       │   └── styles/
│       ├── content/             # MDX lookbook/journal/policies
│       └── package.json
├── packages/
│   ├── ui/                      # shared primitives (if needed)
│   ├── config/                  # eslint, tsconfig, tailwind preset
│   └── types/                   # shared domain types
├── infra/
│   ├── docker-compose.yml       # local
│   ├── docker-compose.prod.yml  # production
│   ├── Caddyfile
│   └── scripts/                 # backup, restore, deploy, smoke
├── .github/workflows/
├── docs/                        # ADRs, runbooks
└── package.json                 # workspace root
```

**Repo strategy:** one monorepo, one deployable per app. The storefront can move to
Vercel later without changing the backend.

---

## 4. Runtime topology

```
Internet
   │
Cloudflare (DNS, TLS, CDN, WAF, rate limit, Turnstile, Access)
   │
   ├── zayaluxe.co / www ──────────► Caddy ──► Next.js storefront :3000
   │                                              │  SSR/ISR, image optimiser
   │                                              │
   ├── api.zayaluxe.co ───────────► Caddy ──► Medusa backend :9000
   │                                              │
   └── admin (Cloudflare Access) ─► Caddy ──► Medusa Admin /app
                                                  │
                        ┌─────────────────────────┼─────────────────────────┐
                        │                         │                         │
                   PostgreSQL 16              Redis 7                 Meilisearch
                   (primary data)       (cache/events/locks)      (product index)
                        │
                   R2 backups (nightly, encrypted)
```

- **Origin lockdown:** security group allows 443 only from Cloudflare IP ranges; SSH
  only from an admin IP or Cloudflare Tunnel. No public Postgres/Redis.
- **Admin:** `admin.zayaluxe.co` (or `/app` on the API host) behind Cloudflare Access
  with email OTP/SSO + 2FA. Never publicly reachable without Access.
- **Storefront ↔ backend:** server-side calls use the internal Docker network; browser
  calls use `api.zayaluxe.co` with CORS restricted to `zayaluxe.co`.

---

## 5. Catalog model (the "not just garments" core)

### 5.1 Medusa entities used

| Entity | Role |
|---|---|
| `Product` | One sellable product, market-independent |
| `ProductVariant` | SKU, price, inventory, options |
| `ProductOption` / `ProductOptionValue` | Size, colour, material, volume, etc. |
| `ProductCategory` | Taxonomy node (supports nesting) |
| `ProductCollection` | Merchandising group (e.g. "Ramadan Edit") |
| `ProductTag` | Cross-cutting labels |
| `PriceSet` / `MoneyAmount` | Per-currency and per-region prices |
| `SalesChannel` | Market/product availability scoping |
| `StockLocation` | Qatar warehouse; future locations deferred |
| `ShippingProfile` | Category-specific shipping rules |
| `Region` | QA (QAR) at launch; future regions deferred |

### 5.2 Category attribute sets

A product is not "a garment with size/colour". It is a product belonging to a category
that **declares** its attributes.

```ts
// Conceptual shape — stored as category metadata + validated with Zod at write time.
type AttributeDefinition = {
  key: string                 // "fabric", "volume", "skin_type"
  label: { en: string; ar: string }
  type: "text" | "number" | "enum" | "boolean" | "measurement"
  unit?: string               // "ml", "cm", "g"
  filterable: boolean         // drives PLP facets + Meilisearch filterable attrs
  required: boolean
  displayOrder: number
  options?: { value: string; label: { en: string; ar: string } }[]
}

type CategorySchema = {
  categoryId: string
  attributes: AttributeDefinition[]
  sizeGuideId?: string
  careTemplateId?: string
  shippingProfileId?: string
}
```

**v1 implementation (deliberately small):**
- Attribute definitions live in `category.metadata.attribute_schema` (JSON).
- Product values live in `product.metadata.attributes` (JSON), validated against the
  category schema by a shared Zod validator in `packages/types`.
- On product create/update, a subscriber flattens filterable attributes into the
  Meilisearch document.
- PDP fetches the category schema and renders a spec table generically.
- PLP fetches facet definitions from the search response, not a hardcoded list.

**Why not a custom PIM module now?** It adds admin UI, migrations, and sync code before
the second category exists. The metadata approach is enough for dozens of attributes
and can graduate to a module when the client needs structured attribute management.
This is a deliberate, documented shortcut — not an oversight.

**Adding a new category later (the acceptance test):**
1. Create the category in admin.
2. Define its attribute set (JSON, via a small admin form or seed script).
3. Add products with those attributes.
4. PDP/PLP/search update automatically. No deploy, no migration.

### 5.3 Variants and options

- Apparel: `Size` × `Colour` → variants.
- Fragrance: `Volume` → variants.
- Homeware: `Size` / `Finish` → variants.
- Every variant has its own SKU, price (per currency), weight, and inventory levels.
- Variant option names are per-product, not global.

---

## 6. Market model (Qatar launch, multi-market ready)

### 6.1 Regions

| Region | Currency | Countries | Tax mode | Payment providers | Stock location |
|---|---|---|---|---|---|
| Qatar | QAR | QA | Tax-inclusive | Client-selected online gateway + `pp_cod_cod` | Doha warehouse |
| Future markets | deferred | — | — | — | — |

- **Price sets:** each product/variant has an explicit QAR price at launch. The
  multi-currency structure is retained so a future market adds a price set, not a new
  product. No FX auto-conversion at runtime.
- **Market scoping:** `SalesChannel` per region when future markets are added; only the
  Qatar sales channel is active at launch.
- **Tax:** Medusa tax regions + rates. Qatar currently has no general VAT at the time of
  planning — **verify with the client's accountant before launch**; the architecture
  supports either. Future-market tax (e.g. India GST/HSN) is configured when that market
  is activated.
- **Cross-border:** out of scope for launch. When a future market is added, landed cost
  (freight + duty + tax) must be shown before payment; prefer DDP.

### 6.2 Currency and rounding

- All money stored as integer minor units (Medusa convention). Never floats.
- Display with `Intl.NumberFormat(locale, { style: "currency", currency })`.
- QAR has 2 decimals; the money layer supports other currencies without code changes.
- FX is a pricing decision, not a runtime conversion.

### 6.3 Locale and market are independent

A shopper in Qatar can browse in English or Arabic. Locale is a URL segment (`/en`,
`/ar`); region/market is resolved from selection/geo and stored in a cookie. When a
future market is added, its currency and default locale are region configuration, not
a new storefront. Do not create duplicate indexable pages per currency.

---

## 7. Key flows

### 7.1 Browse → PDP → cart

```
Browser → Cloudflare → Next.js RSC
  → Medusa Store API (products, regions, prices)
  → Meilisearch (search/facets, via server-only key)
  → R2/CDN images (AVIF/WebP, responsive srcset)
Cart: Medusa cart ID in httpOnly cookie; server actions mutate via Store API.
```

- PLP/PDP are ISR with tag-based revalidation.
- Cart, checkout, account are always dynamic (`no-store`).
- Search keys: only the public search key reaches the browser, never the admin key.

### 7.2 Checkout and payment (hosted page)

```
1. Customer → checkout (address, shipping option, discount)
2. Storefront → Medusa: create/update cart, add shipping method
3. Storefront → Medusa: initiate payment session (provider = region's provider)
4. Medusa → provider: create hosted payment (amount, currency, reference, return URLs)
5. Browser → provider hosted page → 3DS → provider redirects back
6. Provider → Medusa webhook (signed): authorised/captured/failed
7. Medusa workflow: complete cart → create order → decrement stock → emit events
8. Subscribers: send email, push analytics purchase, update search stock, notify ops
9. Storefront: order confirmation page (poll/refresh if webhook is delayed)
```

**Rules:**
- The browser redirect is never trusted as proof of payment. Only a verified webhook
  or a server-side provider lookup completes the order.
- Every webhook is signature-verified, timestamp-checked, and idempotent.
- Retries create no duplicate orders or charges.
- If the webhook is delayed, the confirmation page polls the order status for up to
  60 seconds, then shows "payment processing" with a support link.
- Provider choice may be provisional: checkout is built against the provider interface
  with a stub provider until the final gateway is confirmed (deadline: week 3).

### 7.2b COD flow

```
1. Customer selects COD at checkout (visible only for eligible orders/areas)
2. Medusa creates the order with a pending COD payment (no capture)
3. OTP/WhatsApp verification + risk rules confirm the order
4. Ops fulfils; courier collects cash/card on delivery
5. Delivery + remittance file imported → payment captured → order marked paid
6. Reconciliation report matches order, courier fee, and net remittance
```

- COD is a Medusa payment provider, not a side process; one order lifecycle, one report.
- Capture happens on delivery, never at checkout.
- Failed/refused deliveries follow the NDR/return workflow, not a refund webhook.
- Caps, OTP, prepaid-only rules, and reconciliation are defined in `payments.md`.

### 7.3 Fulfilment

**Launch (manual):**
1. Ops sees paid order in admin.
2. Picks/packs, buys label with courier, enters tracking number + carrier.
3. Medusa marks fulfilled → shipping email with tracking.
4. COD orders: courier remits; ops reconciles daily for the first month, then weekly.

**Phase 2 (automated):**
- Aramex/local courier provider module creates shipments and consumes tracking webhooks.
  Rate shopping is optional; negotiated rates are simpler.

### 7.4 Returns

1. Customer submits RMA (order, item, reason, photo optional).
2. Ops approves/declines within 48h.
3. Qatar: pickup or drop-off with the local courier.
4. Item received/inspected → refund to original method or store credit (COD returns are
   bank transfer or store credit, not cash).
5. Medusa restocks (if sellable) and records the refund.
6. Gateway refund webhook reconciles the ledger.

### 7.5 Search indexing

```
product.created/updated/deleted (Medusa subscriber)
  → build search document (title, description, category, tags, attributes, price, stock)
  → upsert/delete in Meilisearch
Nightly: full reindex + orphan cleanup + index stats alert.
```

Arabic: configure Meilisearch language `ar`, add synonyms (e.g. عباية/abaya), test
diacritic and alef/hamza normalisation. Keep a curated synonym list in version control.

### 7.6 Content and revalidation

- Product/category changes → Medusa subscriber calls storefront
  `POST /api/revalidate?tag=product:{id}` with `REVALIDATE_SECRET`.
- Editorial MDX changes → deploy or scheduled revalidation.
- Cloudflare caches static assets; HTML is ISR, not edge-cached indefinitely.

---

## 8. Localization

- `next-intl` with `en` and `ar`; locale prefix always present (`/en/...`, `/ar/...`).
- `dir="rtl"` at the `<html>` level for Arabic; Tailwind logical utilities
  (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) — no `ml/mr` in shared components.
- Arabic typography: a dedicated Arabic family (see `design.md`), larger line-height,
  no letter-spacing, correct numerals (Arabic-Indic optional per brand).
- Product content: Medusa product translations (verify module support in pinned v2
  version) or per-locale metadata fields with a documented fallback. Never ship
  machine translation without native review.
- Emails: React Email templates with locale-aware strings and RTL layout.
- SEO: `hreflang` pairs for `en-QA`, `ar-QA`; canonical per locale; sitemap per locale;
  Arabic slugs optional (recommend English slugs + Arabic titles to reduce maintenance,
  unless SEO testing says otherwise).

---

## 9. Security model

| Area | Control |
|---|---|
| Card data | Hosted payment page; SAQ A; no PAN/CVV in logs, DB, or browser |
| Customer auth | Medusa customer auth; httpOnly, Secure, SameSite=Lax cookies; rate-limited login |
| Admin | Cloudflare Access (SSO/OTP) + Medusa strong password + 2FA; IP allowlist optional |
| API | CORS allowlist; publishable key only in browser; server keys never exposed |
| Webhooks | HMAC signature verification, timestamp window, replay cache, idempotency |
| Input | Zod validation at every boundary; allowlist file types/sizes |
| Output | React escaping; no `dangerouslySetInnerHTML` without sanitisation |
| Headers | HSTS, CSP, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy |
| Rate limits | Cloudflare + app-level on auth, checkout, newsletter, search |
| Bot defence | Turnstile on login/newsletter/contact; WAF managed rules |
| Secrets | 1Password/Doppler → environment; `.env` never committed; rotation runbook |
| Dependencies | Dependabot + `npm audit` in CI; block critical vulns |
| Data | Encryption at rest (EBS/R2), TLS in transit, least-privilege DB user |
| Backups | Encrypted, access-controlled, restore-tested |
| Audit | Refunds, cancellations, price changes, admin logins retained 12 months |

**Data residency:** host in Bahrain (`me-south-1`) to keep primary data in the GCC.
Qatar PDPPL cross-border transfer still needs a documented basis (contracts, consent,
or safeguards). Future-market privacy law (e.g. India DPDP) is reviewed when that market
is added. This is a legal workstream, not a checkbox.

---

## 10. Environments

| Env | URL | Data | Payments | Indexing | Purpose |
|---|---|---|---|---|---|
| Local | `localhost:8000` / `:9000` | Seed | Sandbox | `noindex` | Development |
| Staging | `staging.zayaluxe.co` | Anonymised/seed | Sandbox | `noindex` + basic auth | QA, UAT |
| Production | `zayaluxe.co` | Real | Live | Indexed | Customers |

- Separate databases, R2 buckets, API keys, and analytics properties per environment.
- Staging is protected by Cloudflare Access or basic auth, `X-Robots-Tag: noindex`.
- Production data is never copied to local; use a scrubbed subset if debugging.
- Feature flags via environment variables for launch-sensitive features (COD, reviews,
  future markets). Default off until verified.

---

## 11. CI/CD

### Pull request
1. Install with lockfile (`npm ci`).
2. Lint + typecheck (ESLint, `tsc --noEmit`).
3. Unit + integration tests (Vitest).
4. Build backend and storefront.
5. Playwright smoke against a preview/ephemeral environment (browse, PDP, cart).
6. Lighthouse CI budgets on key pages (staging build).
7. Secret scan + dependency audit.

### Staging
- Merge to `main` → build images → push GHCR with git SHA tag → SSH deploy →
  `docker compose up -d` → run migrations → healthcheck → smoke test → notify.

### Production
- Tag `v*` → manual approval (GitHub Environments) → same pipeline → pre-deploy DB
  backup/snapshot → migrations → deploy → smoke test → watch 15 minutes.
- **Never** auto-deploy to production on merge.

### Migrations
- Generated with Medusa CLI, reviewed, committed.
- Additive first; destructive changes require a two-step deploy (expand → migrate →
  contract) and a written rollback plan.
- Migration runs only after a verified backup; failure halts the deploy.

### Rollback
- Image rollback: redeploy previous SHA tag (one command, < 2 minutes).
- Code + schema: if a migration is destructive, restore the pre-deploy snapshot
  (documented RTO 4h; in practice minutes for a small DB).
- Rollback drill in Phase 5; the command is pre-typed in the runbook.

---

## 12. Observability and operations

| Signal | Tool | Alert |
|---|---|---|
| Exceptions | Sentry (backend + storefront) | New issue or error rate > 1% |
| Uptime | Better Stack | 2 consecutive failures on home/PLP/API/checkout |
| Latency | Sentry performance + Caddy logs | p95 API > 500ms for 10 min |
| Infra | Netdata/CloudWatch | CPU > 80%, disk > 80%, memory > 85% |
| Postgres | `pg_stat_activity`, slow query log | Connections > 80%, query > 2s |
| Redis | `INFO` | Memory > 80%, evictions > 0 |
| Payments | Provider dashboard + internal ledger | Success rate < 95%, webhook lag > 5 min |
| Orders | Admin + daily digest | Paid but unfulfilled > 24h, stuck payment > 30 min |
| Backups | Cron + R2 listing | Missing or size anomaly |
| Security | Cloudflare + fail2ban | WAF spike, repeated admin login failures |

**Runbooks (in `docs/runbooks/`):** deploy, rollback, restore, payment outage, stuck
order, carrier outage, certificate/DNS, incident response, secret rotation.

**Ownership:** client owns business operations and first-line support; we own the
platform during hypercare and provide a monthly maintenance window thereafter.

---

## 13. Backup and disaster recovery

| Asset | Method | Frequency | Retention | Restore test |
|---|---|---|---|---|
| PostgreSQL | `pg_dump` compressed + encrypted → R2 | Nightly 02:00 Doha | 30 daily, 12 weekly, 12 monthly | Monthly |
| Media (R2) | Versioning + lifecycle | Continuous | 90 days versions | Quarterly sample |
| Config/secrets | 1Password vault export | On change | — | Quarterly |
| Code | GitHub + tagged releases | On merge/tag | Forever | — |
| Search index | Rebuildable from DB | Nightly full reindex | — | Quarterly |

**Targets:** RPO ≤ 24h (v1; move to WAL archiving/15 min if order volume justifies),
RTO ≤ 4h. A restore is not "done" until a staging checkout works against the restored
database.

---

## 14. Cost estimate (monthly, USD)

| Item | Estimate |
|---|---|
| EC2 `t4g.large` (2 vCPU/8GB) + 80GB gp3 + EIP | $65–85 |
| Cloudflare (Free/Pro) | $0–25 |
| Cloudflare R2 (50GB + ops) | $3–8 |
| Resend (10k emails) | $0–20 |
| Sentry (Team/free) | $0–26 |
| Better Stack / logs | $0–10 |
| Domain + business email | $10–20 |
| **Total** | **~$80–195/mo** |

Excluded: payment processing (2.5–3.5% + fixed), shipping, 3PL storage/pick-pack,
ad spend, content production, legal/accounting. Scale-up path: move Postgres to RDS
or add a second app node behind the load balancer when CPU > 60% sustained.

---

## 15. Architecture decision records (ADRs)

| # | Decision | Alternatives considered | Rationale | Revisit when |
|---|---|---|---|---|
| ADR-001 | Medusa v2 over Shopify | Shopify, Saleor, custom | No per-sale tax, full control, multi-region primitives | Ops burden outweighs savings |
| ADR-002 | Next.js 16 App Router | Remix, Astro, SvelteKit | RSC, ISR, SEO ecosystem, team familiarity | Storefront becomes content-only |
| ADR-003 | AWS Bahrain over EU VPS | Hetzner EU, DigitalOcean | GCC latency + data residency posture | Cost pressure or latency proves irrelevant |
| ADR-004 | Hosted payment page | Embedded fields / direct API | PCI SAQ A, faster launch, fewer compliance obligations | Conversion loss proven vs embedded |
| ADR-005 | Metadata attribute sets (v1) | Custom PIM module now | Smallest thing that proves category-agnostic model | Client needs structured attribute admin |
| ADR-006 | Meilisearch over Algolia | Algolia, Typesense, Postgres FTS | Cost, Arabic, self-hosted, facets | Relevance or scale outgrows it |
| ADR-007 | Manual fulfilment at launch | Carrier API from day one | Carrier onboarding is slow; launch should not wait | > 20 orders/day or 2+ carriers |
| ADR-008 | MDX editorial over CMS | Sanity, Payload, Contentful | No second system until self-serve is proven | Client publishes weekly without dev help |
| ADR-009 | Qatar-only launch; future markets deferred | Launch Qatar + India together | Entity, GST, customs, and returns are long poles; Qatar must prove unit economics first | Qatar stable + a business case for the next market |
| ADR-010 | Single VPS, Docker Compose | Kubernetes, ECS | Operational simplicity for launch volume | Sustained CPU > 60% or multi-node need |
| ADR-011 | Cloudflare Access for admin | IP allowlist only, VPN | Identity-aware, MFA, audit trail | Enterprise SSO requirement |
| ADR-012 | Resend for email | Postmark, SES, SendGrid | DX, React Email, bilingual templates, price | Deliverability issues or volume pricing |
| ADR-013 | Client selects the Qatar gateway; we build a provider module | Single bundled PSP, direct bank integration | Client owns the banking relationship; provider isolation keeps checkout portable | Gateway cannot meet P1–P12 or KYC fails |
| ADR-015 | Provisional gateway first, final choice by week 3 | Wait for final choice before building | KYC and integration are the long poles; a stub provider unblocks development | Final choice slips past week 4 |
| ADR-014 | COD as a Medusa payment provider | Manual side-process, third-party COD app | One order lifecycle, one report, one refund path | Courier offers a first-class COD integration |

---

## 16. Open architecture questions

1. Does the pinned Medusa version include a stable translation module, or do we use
   per-locale metadata? **Resolve in Phase 1 spike.**
2. Does Meilisearch's Arabic support meet the relevance bar, or do we need a synonym
   layer / alternative? **Resolve in Phase 2 with 20 real queries.**
3. Is `.co` acceptable for Qatar brand trust, or should we also register
   `zayaluxe.qa` defensively? **Client decision.**
4. Do we need a Qatar phone number and WhatsApp Business API at launch? **Client decision.**
5. Is there an existing site to redirect from? **Client to confirm.**
6. Does the client's accounting system require a specific invoice format, and how should
   COD remittances be reported? **Client to confirm.**
7. Which gateway is the provisional primary and which is the fallback? Final choice by
   week 3. **Client decision.**
