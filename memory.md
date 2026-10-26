# Zaya Luxe — Project Memory

**Last updated:** 2026-10-26 (v1.2 — gateway timing)
**Current phase:** Phase 0 — Discovery and decisions (`PENDING`)
**Next action:** Client names a provisional primary + fallback gateway; final choice by
week 3. Run the Phase 0 workshop.

> Session start rule: read this file first, then `phases.md`, then resume from the
> current phase. Do not re-plan work that is already decided here.

---

## 1. Project state

| Item | Value |
|---|---|
| Client project | Zaya Luxe |
| Domain | `zayaluxe.co` (registered; GoDaddy nameservers at planning time) |
| Launch market | **Qatar only** (QAR, Arabic + English) |
| Future markets | India, GCC, others — **deferred** until Qatar is proven |
| Payments | Online gateway (**client selects**) + **COD** |
| Platform | Medusa v2 + Next.js 16 |
| Repo location | `projects/zayaluxe/` (docs); app code created in Phase 1 |
| Launch target | End of week 9 after Phase 0 sign-off |
| Status | Plan v1.1 drafted; no code started; no infrastructure provisioned |

---

## 2. Decisions made

| Date | Decision | Rationale | Status |
|---|---|---|---|
| 2026-10-26 | **Qatar-only launch; India/GCC deferred** | Entity, GST, customs, returns would double launch risk; prove Qatar first | **Decided** |
| 2026-10-26 | **Online payments + COD at launch** | Both are market expectations; COD needs controls and reconciliation | **Decided** |
| 2026-10-26 | **Client selects the online gateway** | Client owns the banking relationship; we integrate behind a provider module | **Provisional week 1; final week 3** |
| 2026-10-26 | Client has a registered Qatar company | KYC can proceed once a gateway is chosen | **Confirmed by client** |
| 2026-10-26 | Medusa v2 + Next.js 16 | No per-sale platform tax; multi-region primitives; full control | Proposed |
| 2026-10-26 | Category-agnostic catalog via attribute sets | "Not limited to garments"; new categories without migrations | Proposed |
| 2026-10-26 | One catalog, explicit price sets; no duplicate products | Multi-market-ready without content drift | Proposed |
| 2026-10-26 | Hosted payment pages (SAQ A) | Keeps card data off our servers; fastest compliance path | Proposed |
| 2026-10-26 | AWS Bahrain + Cloudflare | GCC latency; simpler Qatar data-transfer posture | Proposed |
| 2026-10-26 | Manual fulfilment at launch | Carrier API onboarding must not block launch | Proposed |
| 2026-10-26 | COD as a Medusa payment provider | One order lifecycle, one report, one refund path | Proposed |
| 2026-10-26 | Metadata attribute sets for v1 (no custom PIM) | Smallest thing that proves the model; graduate later if needed | Proposed |
| 2026-10-26 | MDX editorial, no CMS at launch | Avoids a second system before self-serve is proven | Proposed |
| 2026-10-26 | English slugs + Arabic titles | Lower maintenance; revisit after SEO testing | Proposed |

**"Proposed" means not signed. Do not build against it until Phase 0 is signed.**

---

## 3. Open decisions

| # | Question | Why it matters | Owner | Needed by |
|---|---|---|---|---|
| Q1 | **Which online gateway?** (Tap / MyFatoorah / PayTabs / QNB QPay) | KYC 2–4 weeks; determines the provider module | Client | **Provisional week 1; final week 3** |
| Q2 | Is any gateway already approved or under application? | Avoids duplicate KYC | Client | Week 1 |
| Q3 | Qatar warehouse: client-operated or 3PL? | Fulfilment UX, stock location, COD reconciliation | Client | Week 1 |
| Q4 | COD caps, fee, eligibility, courier, remittance owner? | Fraud/loss control and reconciliation | Client | Week 2 |
| Q5 | Who owns Arabic translation and final approval? | Quality gate; schedule risk | Client | Week 2 |
| Q6 | Launch date and any non-negotiable campaign date? | Drives content freeze and buffer | Client | Week 0 |
| Q7 | Launch assortment and AOV target? | Taxonomy, pricing, photography volume | Client | Week 1 |
| Q8 | Existing brand guidelines or define from scratch? | `design.md` provisional until answered | Client | Week 1 |
| Q9 | Qatar VAT status / tax registration? | Price display, invoicing, tax config | Client + accountant | Week 2 |
| Q10 | Data residency requirement / legal counsel? | Hosting region and transfer basis | Client | Week 2 |
| Q11 | Existing site to redirect from? | SEO redirect map | Client | Week 2 |
| Q12 | Defensive `zayaluxe.qa` registration? | Brand protection | Client | Week 1 |
| Q13 | Medusa translation module vs metadata i18n? | Implementation detail; spike in Phase 1 | Us | Week 2 |
| Q14 | Meilisearch Arabic relevance acceptable? | Search quality; possible Algolia fallback | Us | Week 3 |
| Q15 | Which future market first, and when? | Only after Qatar proves unit economics | Client | 90 days post-launch |

---

## 4. What's done

- [x] 2026-10-26 — Read project brain rules, `HOT.md`, dev-lifecycle, deploy checklist.
- [x] 2026-10-26 — Verified current Medusa docs: v2.18.x; production requires Redis
      caching/event-bus/workflow/locking modules; Next.js starter is a monorepo since
      v2.14; custom payment providers extend `AbstractPaymentProvider`.
- [x] 2026-10-26 — Checked `zayaluxe.co` DNS: live, GoDaddy nameservers, A records present.
- [x] 2026-10-26 — Drafted the project docs: `README.md`, `prd.md`, `architecture.md`,
      `phases.md`, `rules.md`, `design.md`, `memory.md`.
- [x] 2026-10-26 — Added `payments.md`: gateway shortlist, RFP questions, KYC pack, COD
      operating model, integration and test plan.
- [x] 2026-10-26 — Scope updated at client direction: **Qatar-only launch**, **COD +
      online payments**, **client selects gateway**, client company is registered.
- [x] 2026-10-26 — Gateway timing relaxed: **provisional primary by week 1, final choice
      by week 3**; development can start on a stub provider.
- [ ] Phase 0 workshop — not scheduled.
- [ ] Gateway selected / KYC started — pending client.
- [ ] Any code or infrastructure — deliberately not started (lifecycle gate).

---

## 5. What's remaining (next 10 working days)

1. Client reads `payments.md` and **names a provisional primary + fallback by end of
   week 1**; start KYC. Final choice by week 3.
2. Schedule and run the Phase 0 workshop; fill Q1–Q12.
3. Move `zayaluxe.co` DNS to Cloudflare; set up business email + SPF/DKIM/DMARC.
4. Collect brand assets, product list, QAR prices, photography plan, Arabic reviewer.
5. Define COD caps, fee, courier, and remittance process.
6. Confirm hosting region and data-residency position with counsel.
7. Sign Gate 0; create the app repo; start Phase 1.

---

## 6. Blockers

| Blocker | Impact | Workaround | Owner |
|---|---|---|---|
| Provisional gateway not named | Live payments cannot start; Phase 3 integration blocked | Staging build proceeds with a stub/sandbox; client names primary week 1 | Client |
| No client workshop yet | All D/C items unconfirmed | Draft plan stands; no build | Us + client |
| COD operating rules undefined | Cannot implement verification/caps/reconciliation | Default policy proposed; client approves | Client |
| Brand assets absent | Design stays provisional | Use proposed direction for structure only | Client |
| Product content absent | Catalog/search QA blocked | Seed with 5 internal test products | Us |

---

## 7. Risks and mitigations (live)

| Risk | Trigger to escalate | Mitigation |
|---|---|---|
| Gateway selection late | No provisional primary by end of week 1, or no final choice by week 3 | Two providers in parallel; proceed on provisional primary; launch date moves after week 4 |
| Gateway KYC late | No approval by week 4 | Second gateway as fallback; staging sandbox |
| COD fraud / failed delivery | COD share > 40% or refusal rate > 15% | OTP, caps, prepaid-only high-value, NDR workflow |
| COD reconciliation gaps | Unmatched remittances > 2% | Daily reconciliation first month; courier file |
| Content late | No photos/copy by week 3 | Launch date moves; placeholder plan in writing |
| Arabic quality | Native review rejects copy | Reviewer engaged week 2; glossary built |
| Scope creep | New category/feature mid-build | Change request + timeline impact; category-agnostic path |
| Performance | CWV budget breached in Phase 5 | Image/font/JS budget enforcement from Phase 2 |
| Data residency | Counsel objects to Bahrain | Move to Qatar/UAE region; document transfer basis |

---

## 8. Lessons learned

- **2026-10-26 — Scope discipline beats architectural optionality.** The platform stays
  multi-market-ready, but only Qatar is activated. "We can add India later" is not a
  reason to build India now.
- **2026-10-26 — Payment KYC is a launch blocker, not a Phase 3 task.** Start it in
  week 1; the client must name a provisional primary before integration can start, and
  finalise by week 3.
- **2026-10-26 — COD is a payment provider, not a manual side-process.** Modelling it in
  Medusa keeps orders, refunds, and reconciliation in one system.
- **2026-10-26 — Plan the category-agnostic model before the catalog.** The client's
  "not just garments" requirement is an architecture constraint, not a content one.
- **2026-10-26 — Hosted payment pages are the cheapest compliance win.** SAQ A vs SAQ D
  is a large difference in audit scope and engineering time.

---

## 9. Session log

### 2026-10-26 — v1.2 gateway timing
- Client asked whether the gateway can be chosen later.
- Decision: **yes for the commercial choice, no for the integration decision.**
  Provisional primary + fallback by week 1; KYC starts immediately; final choice by
  week 3. Stub provider unblocks Phase 1–3 development.
- Updated `README.md`, `phases.md`, `payments.md`, `architecture.md`, `memory.md`.
- **Next:** client names provisional primary + fallback; final choice by week 3.

### 2026-10-26 — v1.1 scope update
- Client confirmed: Qatar only for now; deploy additional markets after Qatar succeeds.
- Client confirmed: registered company exists; **COD + online payments** both at launch.
- Online gateway is a **client selection**; added `payments.md` with shortlist, RFP,
  KYC pack, and COD design.
- Updated `README.md`, `prd.md`, `architecture.md`, `phases.md`, `rules.md`, `memory.md`
  to remove India from launch scope and add COD.
- No code, no infra, no client data touched.
- **Next:** gateway selection + Phase 0 workshop.

### 2026-10-26 — Initial plan drafted
- Created `projects/zayaluxe/` with the dev-lifecycle docs.
- Verified Medusa v2 facts via Context7 (v2.18.x, Redis production modules, monorepo
  starter, `AbstractPaymentProvider`).
- Verified domain DNS (GoDaddy nameservers; needs Cloudflare migration).
- Researched Qatar gateway landscape (Tap, MyFatoorah, PayTabs, QPay/NAPS, SkipCash).
- No code, no infra, no client data touched.

---

## 10. Change log

| Date | Change | By |
|---|---|---|
| 2026-10-26 | v1.0 — initial plan | Agent |
| 2026-10-26 | v1.1 — Qatar-only launch, COD + online, client selects gateway, `payments.md` added | Agent |
| 2026-10-26 | v1.2 — gateway timing: provisional primary week 1, final choice week 3 | Agent |
