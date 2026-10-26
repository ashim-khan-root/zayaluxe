# Zaya Luxe — Product Requirements Document (PRD)

**Version:** 1.0 (draft) · **Date:** 2026-10-26
**Status:** Awaiting Phase 0 sign-off
**Related:** [`architecture.md`](./architecture.md) · [`phases.md`](./phases.md) · [`design.md`](./design.md)

---

## 1. Overview

Zaya Luxe is a premium, direct-to-consumer commerce brand launching on
`zayaluxe.co`. The launch assortment is clothing and garments, but the platform
must support **any physical category** the brand adds later — accessories,
jewellery, fragrance, beauty, homeware, kids — without a replatform.

The business operates from Qatar. **Qatar is the only launch market.** Additional
markets (India, GCC) are deferred until Qatar is proven. The storefront is bilingual
(Arabic + English), mobile-first, and built to feel editorial and quiet-luxury rather
than discount-driven.

**One-line product statement:**
> A bilingual, multi-market-ready, category-agnostic luxury storefront with a Medusa v2
> commerce backend and a Next.js 16 frontend, operable by a non-technical team.

---

## 2. Goals and non-goals

### Goals (launch)

| # | Goal | Measure |
|---|---|---|
| G1 | Sell physical products online in Qatar | First 50 paid orders in 30 days |
| G2 | Serve Arabic and English shoppers equally well | Full parity: navigation, product, checkout, email, policies |
| G3 | Launch a catalog that can grow beyond garments | New category live with zero schema migration |
| G4 | Give the client operational independence | Admin can add product, price for Qatar, fulfil, refund |
| G5 | Be fast and discoverable | LCP ≤ 2.5s p75 mobile; Lighthouse SEO ≥ 95 |
| G6 | Be trustworthy with payments and data | PCI SAQ A; no card data on our servers; WCAG 2.2 AA |
| G7 | Prove the Qatar model before adding markets | Positive contribution margin in Qatar for 90 days before a second-market decision |

### Non-goals (explicitly not in v1)

- Multi-vendor marketplace or seller onboarding.
- Native iOS/Android apps.
- ERP/accounting integration (export CSV instead; integrate later).
- Subscription/recurring commerce.
- B2B/wholesale pricing, quotes, or customer-specific catalogs.
- Loyalty points, referrals, or gamification.
- A full CMS/page-builder. Editorial pages are MDX until self-serve is proven necessary.
- Additional markets, languages, or currencies beyond Qatar/QAR and English/Arabic.
- Same-day delivery guarantees (offer it only if the courier can honour it).

---

## 3. Users and personas

### P1 — Qatar shopper (primary)
Bilingual, mobile-first, 25–45, discovers via Instagram/TikTok/Snapchat/WhatsApp.
Expects Apple Pay, fast delivery, easy returns, and Arabic support. Price-tolerant
but sensitive to trust signals (real photography, clear delivery dates, WhatsApp
contact). Often guest checkout.

### P2 — Future-market shopper (deferred, not v1)
Mobile-first, price-competitive, expects local payment methods (e.g. UPI in India),
COD, low-cost delivery, and a domestic return address. Not served in v1; the persona
is kept so the architecture does not foreclose it.

### P3 — Store operator (client staff)
Non-technical. Adds products, adjusts prices per market, processes orders,
prints labels or enters tracking, handles returns/refunds, updates banners.

### P4 — Content editor / marketer
Publishes lookbooks, journal posts, campaign landing pages, discount codes,
newsletter campaigns, and tracks performance.

### P5 — Developer / maintainer (us)
Needs reproducible environments, typed APIs, clear module boundaries, tests,
observability, and a rollback path.

---

## 4. User stories

### Shopping
- As a shopper, I want to browse by category, collection, and editorial story so I
  can discover products the way the brand presents them.
- As a shopper, I want to filter by size, colour, price, and category-specific
  attributes (fabric, fit, material, volume, skin type, etc.) so I can narrow quickly.
- As a shopper, I want a product page with rich imagery, variant availability,
  size guide, materials/care, delivery estimate, and returns policy so I can buy
  with confidence.
- As an Arabic shopper, I want the entire experience in Arabic with correct RTL
  layout so it feels native, not translated.
- As a shopper, I want to add to cart, apply a discount, and check out as a guest
  in under 2 minutes on mobile.
- As a shopper, I want to pay with my preferred method: card, Apple Pay, QPay/NAPS,
  or cash on delivery in Qatar.
- As a shopper, I want a clear delivery date and final price (including any COD fee)
  before I pay.
- As a shopper, I want bilingual order confirmation and tracking updates.
- As a shopper, I want to request a return/exchange without emailing support.

### Operating
- As an operator, I want to create a product with variants, media, category,
  attributes, and QAR prices (multi-market ready) in one flow.
- As an operator, I want to see paid orders, fulfil them, add tracking, and refund
  or partially refund without a developer.
- As an operator, I want low-stock and oversell alerts.
- As an operator, I want to create discount codes with limits and expiry.
- As an operator, I want to know which market an order came from and its tax treatment.

### Marketing
- As a marketer, I want campaign landing pages that reuse product components.
- As a marketer, I want GA4 + Meta/TikTok/Snapchat events with correct currency and
  value, including server-side purchase events.
- As a marketer, I want abandoned-cart and welcome flows in both languages.
- As a marketer, I want product feeds for Google Merchant Center.

### Maintaining
- As a developer, I want one command to boot the stack locally and one pipeline to
  deploy staging.
- As a developer, I want payment and shipping providers isolated behind Medusa
  provider interfaces so a gateway swap is a module change, not a rewrite.
- As a developer, I want a tested restore and rollback path.

---

## 5. Functional requirements

Requirements use MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (v1).

### 5.1 Catalog (category-agnostic)

| ID | Requirement | Priority |
|---|---|---|
| CAT-01 | Products support multiple categories, collections, tags, and product types | M |
| CAT-02 | Products support arbitrary options and variants (size, colour, material, volume, etc.) | M |
| CAT-03 | Each category defines an **attribute set** (key, label en/ar, type, unit, filterable, required, display order) | M |
| CAT-04 | Product attribute values are validated against the category's attribute set | M |
| CAT-05 | PDP renders a spec table dynamically from the attribute set; no per-category code branch | M |
| CAT-06 | Category-specific size guides, care instructions, and shipping profiles are supported | M |
| CAT-07 | Media supports multiple images, alt text en/ar, focal point, and video | S |
| CAT-08 | Products can be scoped to markets/sales channels (future markets) | S |
| CAT-09 | Bundle/kit products | C |
| CAT-10 | Product reviews with verified-purchase badge | C (phase 2) |

**Launch taxonomy (content, not code):** Women, Men, Accessories, New In, Edit,
Sale. Under each, category-specific attributes:
- Apparel: size, colour, fabric, fit, care, origin, model measurements.
- Accessories: material, dimensions, hardware, lining.
- Future beauty: skin type, volume, ingredients, usage.
- Future home: material, dimensions, care, room.

### 5.2 Discovery

| ID | Requirement | Priority |
|---|---|---|
| DIS-01 | Collection and category listing pages with SEO copy | M |
| DIS-02 | Faceted filters generated from category attributes + price + availability | M |
| DIS-03 | Sort by featured, newest, price, best-selling | M |
| DIS-04 | Search with typo tolerance, Arabic normalization, synonyms, and zero-result recovery | M |
| DIS-05 | Search/filter state survives back navigation and is shareable via URL | S |
| DIS-06 | Related products / "complete the look" | S |
| DIS-07 | Recently viewed | C |
| DIS-08 | Wishlist | C (phase 2) |

### 5.3 Cart and checkout

| ID | Requirement | Priority |
|---|---|---|
| CHK-01 | Persistent cart across devices for logged-in customers; cookie cart for guests | M |
| CHK-02 | Stock validation at add-to-cart and at checkout | M |
| CHK-03 | Guest checkout | M |
| CHK-04 | Account creation optional; password reset; order history | M |
| CHK-05 | Address form with country-aware fields and phone validation | M |
| CHK-06 | Shipping options by region with price and ETA | M |
| CHK-07 | Discount codes with usage limits, expiry, and minimum spend | M |
| CHK-08 | Tax-inclusive display prices in Qatar | M |
| CHK-09 | Cross-border duties/taxes shown before payment (DDP) | M |
| CHK-10 | Payment via hosted/redirect page (card data never touches our servers) | M |
| CHK-11 | Idempotent order creation; no duplicate charges on retry | M |
| CHK-12 | Bilingual confirmation email within 60 seconds | M |
| CHK-13 | Abandoned-cart recovery email/WhatsApp | S |
| CHK-14 | Apple Pay / Google Pay | M (Qatar) |
| CHK-15 | Cash on delivery with OTP/verification and COD reconciliation | M (Qatar) |
| CHK-16 | Gift cards | C |
| CHK-17 | One-page checkout | S |

### 5.4 Payments

| ID | Requirement | Priority |
|---|---|---|
| PAY-01 | Qatar: cards (Visa/Mastercard), Apple Pay, QPay/NAPS; 3DS | M |
| PAY-02 | Future-market methods (UPI, netbanking, local wallets) | W (deferred) |
| PAY-03 | Authorise, capture, void, refund, partial refund | M |
| PAY-04 | Signed webhooks with replay protection and idempotency | M |
| PAY-05 | Payment failure messaging that tells the customer what to do next | M |
| PAY-06 | Refunds reconciled to the original payment method | M |
| PAY-07 | Multi-currency plumbing retained; QAR at launch, no runtime FX | M |
| PAY-08 | Saved cards / tokenised wallets | C (phase 2) |

### 5.5 Fulfilment and returns

| ID | Requirement | Priority |
|---|---|---|
| FUL-01 | Stock location for the Qatar warehouse; future locations deferred | M |
| FUL-02 | Manual fulfilment with tracking number entry at launch | M |
| FUL-03 | Carrier automation (Aramex/local courier in Qatar) | S (phase 2) |
| FUL-04 | Shipping profiles per category (e.g. fragile homeware) | S |
| FUL-05 | Return/exchange request flow with reason and photo | S |
| FUL-06 | Drop-off or pickup returns in Qatar | S |
| FUL-07 | Refund to original method; store credit option | M |
| FUL-08 | Partial fulfilment and split shipments | C |

### 5.6 Content and localization

| ID | Requirement | Priority |
|---|---|---|
| CNT-01 | Home, category, product, lookbook, journal, about, contact pages | M |
| CNT-02 | Bilingual UI strings, product content, emails, and policies | M |
| CNT-03 | RTL layout with logical CSS properties; Arabic typography | M |
| CNT-04 | Per-locale SEO metadata, canonicals, hreflang, sitemaps | M |
| CNT-05 | Bilingual alt text and image captions | S |
| CNT-06 | Self-serve page builder | W (v1) |
| CNT-07 | Blog/journal with MDX and scheduled publishing | S |
| CNT-08 | Campaign landing pages reusing product components | S |

### 5.7 Admin and operations

| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Medusa Admin for products, orders, customers, discounts, inventory | M |
| ADM-02 | QAR price editing; multi-currency structure ready for future markets | M |
| ADM-03 | Role separation: owner, operations, content (least privilege) | S |
| ADM-04 | Admin behind Cloudflare Access + 2FA | M |
| ADM-05 | Audit log for refunds, cancellations, price changes | S |
| ADM-06 | Low-stock and failed-payment alerts | M |
| ADM-07 | CSV export of orders for accounting | M |
| ADM-08 | Custom admin widget: market availability + attribute completeness | C |

### 5.8 Marketing, analytics, consent

| ID | Requirement | Priority |
|---|---|---|
| MKT-01 | GA4 ecommerce events with correct currency/value | M |
| MKT-02 | Meta Pixel + Conversions API, TikTok, Snapchat pixels | M |
| MKT-03 | Google Merchant Center product feed | S |
| MKT-04 | Cookie/consent banner respecting Qatar PDPPL (India DPDP when added) | M |
| MKT-05 | Newsletter capture + double opt-in | S |
| MKT-06 | WhatsApp click-to-chat and order updates | S |
| MKT-07 | UTM capture persisted to order | S |
| MKT-08 | Server-side purchase event (ad-block resilient) | S |

---

## 6. Non-functional requirements

### Performance
- LCP ≤ 2.5s (p75 mobile, 4G), INP ≤ 200ms, CLS ≤ 0.1, TTFB ≤ 800ms.
- Initial JS ≤ 200KB gzip on PLP/PDP; images AVIF/WebP with explicit dimensions.
- Arabic fonts subset; no render-blocking third-party scripts.
- Search response ≤ 150ms p95; add-to-cart ≤ 300ms p95.

### Availability and reliability
- 99.9% monthly uptime target for storefront and checkout.
- Graceful degradation: if search is down, PLP still renders from Medusa; if email
  provider is down, order succeeds and email retries.
- RPO ≤ 24h (v1), RTO ≤ 4h; monthly restore test.
- Zero-downtime deploys for the storefront; backend restart window acceptable with
  a maintenance page if migrations require it.

### Security and privacy
- PCI DSS **SAQ A** via hosted payment pages; no PAN/CVV stored, logged, or proxied.
- OWASP ASVS L2 checklist for auth, session, input validation, and access control.
- All inputs validated (Zod); all webhooks signature-verified; all admin routes gated.
- Secrets in a secret manager, never in git; least-privilege DB and cloud roles.
- PII minimisation; data export/deletion process; retention policy.
- Qatar PDPPL compliance review before launch; documented cross-border
  transfer basis for hosting and processors.
- Security headers: HSTS, CSP, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, frame-ancestors.

### Accessibility
- WCAG 2.2 AA: keyboard operability, visible focus, 4.5:1 text contrast, 24×24px
  targets, form labels and error identification, reduced-motion support, RTL parity.
- Screen-reader pass on browse → PDP → cart → checkout in English and Arabic.

### SEO
- Server-rendered content, clean URLs, canonical tags, hreflang for `en-QA`, `ar-QA`,
  structured data (Product, Offer, BreadcrumbList, Organization, WebSite),
  XML sitemaps per locale, robots rules, OG images, 301 map for any legacy URLs.
- Arabic content is genuinely translated and indexable, not machine-translated filler.

### Compatibility
- Last 2 versions of iOS Safari, Chrome Android, Chrome, Safari, Firefox, Edge.
- 320px minimum viewport; 360px and 390px are primary mobile targets.
- Works with JavaScript disabled for browse and product pages (progressive enhancement
  where practical); checkout requires JS.

### Operability
- One-command local boot; one-command staging deploy; one-command rollback.
- Structured logs with request IDs; Sentry for errors; uptime checks on 4 critical paths.
- Runbooks for deploy, rollback, restore, payment outage, stuck orders, carrier outage.

---

## 7. Market requirements

| Concern | Qatar (launch) | Future markets (deferred) |
|---|---|---|
| Currency | QAR | Added per market; no runtime FX |
| Tax | Prices tax-inclusive; confirm current VAT status with accountant | GST/HSN and local tax when added |
| Payment | Online gateway (client selects) + COD; Apple Pay/Google Pay; NAPS/QPay if supported | UPI/netbanking/local wallets when added |
| Fulfilment | Doha warehouse; local courier; 1–3 days | Local 3PL or DDP when added |
| Returns | Local pickup/drop-off; 14 days | Local reverse logistics when added |
| Language | Arabic + English | English/Hindi/others when added |
| Legal | Qatar consumer protection, PDPPL | Local consumer/tax/privacy law when added |
| Pricing | QAR price set | Deliberate local price set, not auto-converted |
| Catalog | Full launch assortment | Curated subset when added |

**Market rules:**
- One product record, multiple price sets. Never duplicate products per market.
- Only Qatar is enabled at launch; future markets stay behind a feature flag.
- Qatar payment providers and shipping options are the only active configuration.
- COD orders follow the same lifecycle as online orders, with capture on delivery.
- Future-market prices are set deliberately, not auto-converted from QAR.

---

## 8. Success criteria

### Launch (day 1)
- [ ] Qatar shopper completes a real online paid order on production with a real card.
- [ ] Qatar shopper completes a real COD order end-to-end, including remittance reconciliation.
- [ ] Arabic and English storefronts have content parity on all launch pages.
- [ ] Admin can add a product, price it for QAR, and fulfil an order.
- [ ] Order confirmation, shipping, and refund emails arrive in the right language.
- [ ] WCAG 2.2 AA audit: zero critical/serious blockers.
- [ ] Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on mobile.
- [ ] Backup restore and rollback drills pass with evidence.
- [ ] Monitoring alerts fire to the agreed channel.

### 30 days
- [ ] ≥ 50 paid orders (or agreed baseline).
- [ ] Payment success rate ≥ 95% (excluding customer declines).
- [ ] Checkout abandonment ≤ 70%.
- [ ] Return rate ≤ 15% (fashion benchmark; investigate above).
- [ ] Zero Sev-1 incidents; any Sev-2 resolved within 24h.
- [ ] p95 API latency ≤ 500ms; uptime ≥ 99.9%.

### 90 days
- [ ] Second-market go/no-go only after 90 days of Qatar unit economics; default is no.
- [ ] Repeat purchase rate baseline established.
- [ ] CAC/LTV baseline by channel.
- [ ] At least one new category added without engineering work (proves CAT-01–05).

---

## 9. Assumptions and constraints

1. The client owns the brand, product, pricing, and fulfilment operations.
2. The client can supply a Qatar trade licence and bank account for payment KYC.
3. The client has a registered Qatar company and can complete the selected gateway's KYC.
4. Launch assortment is 20–30 SKUs; more is welcome but not a blocker.
5. Product photography meets a minimum spec (see `design.md`); otherwise launch slips.
6. No legacy ecommerce migration; redirects only if an old site exists.
7. One warehouse in Qatar at launch; additional fulfilment locations are a future-market decision.
8. Arabic copy is reviewed by a native speaker before launch.
9. The client accepts a 2-week hypercare window and names one operational owner.
10. COD is required at launch; the client owns the courier contract and cash reconciliation.
11. Hosting is cloud-based; no on-premise hardware.

---

## 10. Launch definition (acceptance)

The project is launch-ready only when **all** of the following are true:

- [ ] Phase 0–5 gates passed with recorded evidence.
- [ ] Real payment captured and refunded in production (small value).
- [ ] Real order fulfilled end-to-end and tracking delivered.
- [ ] Bilingual content signed off by the client and a native Arabic reviewer.
- [ ] Policies published: privacy, terms, shipping, returns, cookies.
- [ ] Security checklist complete; no secrets in git; admin gated.
- [ ] Backups running and a restore has been performed.
- [ ] Rollback rehearsed in staging and documented.
- [ ] Analytics purchase event verified in GA4 and at least one ad platform.
- [ ] Monitoring, alerts, and on-call ownership agreed.
- [ ] Client team trained; SOPs and runbooks handed over.
- [ ] Hypercare schedule agreed (daily check-in for 14 days).

---

## 11. Open questions

Tracked in [`memory.md`](./memory.md#open-decisions). The blocking ones:

1. Which online payment gateway does the client select, and by when?
2. Is any Qatar gateway already approved or under application?
3. Is the Qatar warehouse client-operated or 3PL?
4. Who owns Arabic translation and final copy approval?
5. What is the launch date and the non-negotiable campaign date?
6. What is the launch assortment and average order value target?
7. What are the COD caps, fee, courier, and remittance process?
8. Are there existing brand guidelines, or do we define the visual direction?
