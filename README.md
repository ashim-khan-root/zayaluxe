# Zaya Luxe — Commerce Platform Plan

**Status:** DRAFT v1.2 — Qatar-only launch; gateway provisional by week 1, final by week 3
**Date:** 2026-10-26
**Domain:** `zayaluxe.co` (registered, currently on GoDaddy nameservers)
**Market:** Qatar (QAR) at launch · **Future markets:** deferred until Qatar is proven
**Stack:** Medusa v2 + Next.js 16 · **Languages:** English + Arabic (RTL)

---

## 1. What we are building

A headless, fashion-led commerce platform that is **not limited to garments**.

Launch assortment is clothing and accessories, but the catalog, navigation, filters,
product pages and admin are built around **category attribute sets**, not hardcoded
"size/colour/fabric" columns. Adding beauty, homeware, jewellery, fragrance or kids
later is a content + attribute exercise, not a replatform.

**Launch market: Qatar only.**

| Market | Status | Currency | Language | Fulfilment | Payments |
|---|---|---|---|---|---|
| Qatar | **Launch (v1)** | QAR | Arabic + English | Doha warehouse / local courier | Online gateway (client selects) **+ COD** |
| India, GCC, others | Deferred | — | — | — | — |

**Why Qatar-only first:** India adds an Indian entity, GST/HSN, customs, cross-border
duties, reverse logistics and Razorpay to an already payment-and-content-critical
launch. The architecture is multi-region from day one, but **only Qatar is activated**.
Additional markets are a separate decision after Qatar shows healthy unit economics.

**Payment scope:** both **online payments and cash on delivery (COD)** at launch. The
client selects the online gateway from a shortlist; we integrate it behind a Medusa
payment-provider module so it can be swapped without rewriting checkout. See
[`payments.md`](./payments.md).

---

## 2. The plan in one screen

| Phase | Weeks | Outcome | Gate |
|---|---|---|---|
| **0. Discovery & decisions** | 0–1 | Scope, gateway selection, KYC, shipping/COD, access, content audit | Signed scope + gateway chosen |
| **1. Foundation** | 1–2 | Monorepo, local/staging env, CI/CD, DB seed, design tokens | Staging boots; CI green; restore test #1 |
| **2. Catalog & discovery** | 2–4 | Taxonomy, admin, PDP, PLP, search, cart, en/ar shell | Browse → PDP → cart works in both locales |
| **3. Checkout, payments & COD** | 4–6 | Online gateway, COD, tax, shipping, emails, orders, returns | Sandbox online order + COD order + refunds |
| **4. Content, SEO, analytics** | 6–7 | Home, lookbook, policies, hreflang, pixels, consent | Content freeze + native Arabic sign-off |
| **5. Hardening** | 7–8 | QA, WCAG 2.2 AA, performance, security, load, DR drills | All launch blockers closed |
| **6. Launch** | 9 | UAT, training, DNS cutover, hypercare | Client sign-off + live order |
| **7. Future markets** | Deferred | India/GCC — separate decision, entity, tax, logistics | Qatar stable + unit economics proven |
| **8. Operate** | 10+ | Patching, upgrades, backup tests, roadmap | Monthly service review |

Full task breakdown and gates: [`phases.md`](./phases.md).

---

## 3. Architecture at a glance

```
                        Cloudflare (DNS, CDN, WAF, Turnstile, Access)
                                        |
                ┌───────────────────────┴───────────────────────┐
                │                                               │
        Next.js 16 storefront                          Medusa v2 backend
        (SSR/ISR, en/ar, RTL)                          (Node 22, TypeScript)
        apps/storefront                                apps/backend
                │                                               │
                │  Store API + webhooks                         ├── PostgreSQL 16
                └───────────────────────────────────────────────┤── Redis 7 (cache/events/workflows/locking)
                                                                ├── Meilisearch (catalog + Arabic search)
                                                                ├── Cloudflare R2 (media)
                                                                ├── Resend (transactional email)
                                                                └── Payment / fulfilment providers
                                                                     ├── Online gateway (client selects)
                                                                     ├── COD (custom provider)
                                                                     └── Aramex / local courier / manual
```

Details, data model, ADRs and cost: [`architecture.md`](./architecture.md).

### Why this stack

- **Medusa v2** gives real commerce primitives (regions, currencies, price sets, stock
  locations, payment/fulfilment provider modules, workflows) without Shopify's
  transaction fees or theme ceiling.
- **Next.js 16 App Router** gives SSR/ISR for SEO, RSC for performance, and a clean
  path to Arabic RTL with `next-intl`.
- **Hosted payment pages** keep card data off our servers → PCI **SAQ A**, not SAQ D.
- **Category-agnostic catalog** is the direct answer to "not limited to garments".
- **COD as a Medusa payment provider** keeps one order lifecycle instead of a parallel
  manual process.

---

## 4. Decisions recommended (need client sign-off)

| # | Decision | Recommendation | Why | Status |
|---|---|---|---|---|
| D1 | Commerce platform | Medusa v2 + Next.js 16 | No per-sale platform tax, full control, multi-region native | Proposed |
| D2 | Hosting region | AWS Bahrain (`me-south-1`) + Cloudflare | Closest GCC latency, simpler Qatar data-transfer posture | Proposed |
| D3 | Online payment gateway | **Provisional primary by week 1; final choice by week 3** from Tap / MyFatoorah / PayTabs / QNB QPay | Integration starts on a provisional provider; the commercial choice stays open | **Client decision — provisional week 1, final week 3** |
| D4 | COD | **Enabled at launch** alongside online payments | Market expectation; needs fraud controls + reconciliation | Proposed |
| D5 | Shipping integration | Manual + tracking number for launch; Aramex/local courier automation later | Avoids blocking launch on carrier API onboarding | Proposed |
| D6 | Media | Cloudflare R2 + Next Image | Cheap, CDN-backed, no egress surprises | Proposed |
| D7 | Search | Self-hosted Meilisearch | Arabic support, zero licence cost, facets | Proposed |
| D8 | Email | Resend + React Email | Fast DX, bilingual templates, good deliverability | Proposed |
| D9 | Editorial content | MDX in repo for launch; Sanity only if client needs self-serve | Avoids a second CMS before it is proven necessary | Proposed |
| D10 | Market scope | **Qatar-only launch**; India/GCC deferred | Removes entity, GST, customs, Razorpay from critical path | **Decided** |
| D11 | Admin access | Medusa Admin behind Cloudflare Access + 2FA | Admin is the highest-value attack surface | Proposed |
| D12 | Gateway decision deadline | Provisional primary end of week 1; **final end of week 3** | KYC takes 2–4 weeks; past week 4 the launch date moves | Proposed |
| D13 | COD risk policy | OTP/verification, value caps, prepaid-only high-value items | COD fraud and failed delivery are real costs | Proposed |

Gateway comparison and KYC checklist: [`payments.md`](./payments.md).

---

## 5. What we need from the client (critical path)

These are **not** developer tasks. Every one of them can delay launch.

| # | Item | Owner | Needed by | Notes |
|---|---|---|---|---|
| C1 | Qatar CR / trade licence + bank account + signatory documents | Client | Week 1 | Gateway KYC needs these |
| C2 | **Name a provisional primary + fallback gateway** (final choice by week 3) | Client | **Week 1** | We start KYC and integration on the primary; see `payments.md` |
| C3 | Domain registrar access (`zayaluxe.co`) | Client | Week 1 | Move DNS to Cloudflare, keep registrar |
| C4 | Brand kit: logo, fonts, colours, tone, any guidelines | Client | Week 1 | Otherwise design.md stays provisional |
| C5 | Assortment list, **QAR prices**, cost, stock, SKUs | Client | Week 2 | Drives taxonomy, price sets, launch content |
| C6 | Product photography + copy + Arabic translations | Client | Week 3 | The #1 schedule risk; 20–30 SKUs for launch |
| C7 | Qatar courier account + COD remittance process | Client | Week 2 | Who collects cash, how it is reconciled |
| C8 | Legal policies: privacy, terms, returns, shipping, cookies | Client + counsel | Week 5 | Qatar PDPPL |
| C9 | Arabic-native reviewer for copy and RTL QA | Client | Week 5 | Machine translation is not acceptable for luxury |
| C10 | Analytics + ad accounts (GA4, Meta, TikTok, Snapchat, Google Merchant Center) | Client | Week 4 | Pixels and catalog feeds |
| C11 | WhatsApp Business number + provider decision | Client | Week 4 | Qatar's dominant support channel |
| C12 | Returns/refund/exchange policy and who operates it | Client | Week 4 | Must match gateway and courier reality |
| C13 | COD fraud rules: order caps, OTP, restricted items/areas | Client | Week 3 | We implement; client owns the policy |

---

## 6. Top risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gateway not selected by week 1 | High | Launch delay | Client decision deadline; two gateways in parallel; staging uses sandbox |
| Gateway KYC slips | High | Launch delay | Start week 1; complete document pack; follow up weekly |
| Product content/photos late | High | Launch delay | Content freeze week 7; placeholder plan agreed in writing |
| COD fraud / failed delivery | Medium | Revenue loss | OTP, value caps, prepaid-only high-value, courier reconciliation |
| Arabic quality/RTL bugs | Medium | Brand damage | Native reviewer + RTL regression checklist |
| Scope creep ("add category X") | Medium | Timeline | Category-agnostic build + fixed launch assortment |
| Data residency/legal | Medium | Compliance | GCC hosting + counsel review; documented transfer basis |
| Inventory oversell | Medium | Customer trust | Single stock source, buffers, oversell alerts |
| Heavy imagery hurts CWV | Medium | SEO/conversion | Image budgets, AVIF/WebP, CDN, Lighthouse CI |
| Admin compromise | Low | Severe | Cloudflare Access, 2FA, least privilege, audit logs |

---

## 7. Effort, cost, and what "done" means

**Build effort (estimate):** ~50–65 person-days for the Qatar launch including COD.
This assumes the client names a provisional gateway in week 1, finalises by week 3, and supplies content on time.

**Run cost (estimate):** $120–180/month infrastructure before payment/shipping fees:
EC2 + EBS, R2, Cloudflare, Resend, Sentry, uptime monitoring, domain/email. Payment
fees are typically 2.5–3.5% + fixed fee; COD adds courier remittance handling.

**Launch is done when:**
- A real customer in Qatar can browse in Arabic or English, pay online **or choose COD**,
  receive a bilingual confirmation, and track delivery.
- An admin can add a product, price it for QAR, fulfil an order, and refund it without
  developer help.
- COD orders have a clear status lifecycle and a reconciliation report.
- The site passes WCAG 2.2 AA, Core Web Vitals targets, and the security checklist.
- Backups restore and a rollback has been rehearsed — proven, not assumed.
- Monitoring alerts the team before a customer reports an outage.

---

## 8. Next step

1. **Client names a provisional primary + fallback this week** — use
   [`payments.md`](./payments.md); final choice by week 3. We can run parallel applications
   for the top two to reduce risk.
2. 60-minute Phase 0 workshop: confirm D1–D13, C1–C13, launch date, launch assortment.
3. Sign the scope and RACI in `phases.md`.
4. Start KYC and content production **immediately** — they are the long poles.
5. Phase 1 starts only after the Phase 0 gate is signed.

Read next: [`prd.md`](./prd.md) → [`architecture.md`](./architecture.md) →
[`phases.md`](./phases.md) → [`payments.md`](./payments.md) →
[`design.md`](./design.md) → [`rules.md`](./rules.md) → [`memory.md`](./memory.md).
# zayaluxe
