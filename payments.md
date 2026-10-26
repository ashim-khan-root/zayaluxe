# Zaya Luxe — Payment Gateway Selection & COD Design

**Version:** 1.0 · **Date:** 2026-10-26
**Status:** Provisional primary required — **end of week 1**; final choice — **end of week 3**
**Related:** [`architecture.md`](./architecture.md) · [`phases.md`](./phases.md) · [`prd.md`](./prd.md)

---

## 1. Why this document exists

The client has a registered Qatar company and will offer **online payments and cash on
delivery (COD)**. The client selects the online gateway; we integrate it.

This brief gives the client a shortlist, the questions to ask, the documents KYC will
require, and the COD operating model. It is written so the decision can be made in one
meeting without a technical background.

**Decision deadline: provisional primary by end of week 1; final choice by end of
week 3.** Gateway KYC typically takes 2–4 weeks; integration and testing take another
1–2 weeks. Past week 4, every week of delay moves the launch by roughly a week.

---

## 2. Must-have requirements

Any gateway we integrate must support all of these:

| # | Requirement | Why |
|---|---|---|
| P1 | Accepts a **Qatar-registered company** with the client's licence activity | Eligibility is non-negotiable |
| P2 | Settles in **QAR** to a Qatar bank account | Avoids FX leakage and reconciliation pain |
| P3 | Visa + Mastercard, **3-D Secure** | Baseline card acceptance |
| P4 | **Apple Pay** and **Google Pay** | Mobile conversion in Qatar |
| P5 | **NAPS/QPay domestic debit** (directly or via a partner) | Many Qatari shoppers use local debit |
| P6 | **Hosted payment page** or iframe | Keeps us in PCI **SAQ A** |
| P7 | **Refunds and partial refunds** via API | Returns are part of fashion commerce |
| P8 | **Signed webhooks** with retries and idempotency | Reliable order completion |
| P9 | **Sandbox** with test cards and 3DS simulation | We cannot test live |
| P10 | Reasonable **settlement time** (T+1 to T+3) and no punitive hold | Cash flow |
| P11 | Clear fees: setup, annual, per-transaction, refund, chargeback, FX | Total cost, not headline rate |
| P12 | API documentation and support responsive during integration | Launch schedule |

**Nice to have:** tokenisation/saved cards, payment links, subscriptions, split payments,
Arabic checkout page, WhatsApp payment links, direct Medusa plugin (unlikely; we build one).

---

## 2.5 Can the gateway choice be deferred?

**Yes — the commercial choice can wait. The integration decision cannot.**

Medusa isolates payments behind a provider interface, so checkout can be built against a
stub provider while the client evaluates commercials. What cannot wait is the **KYC clock**
(2–4 weeks) and the **sandbox integration** (1–2 weeks).

| Timing | What happens | Launch impact |
|---|---|---|
| Provisional primary week 1, KYC week 1, final choice week 3 | Safe | Launch week 9 holds |
| Final choice week 3, KYC starts week 3 | Tight | Launch week 9 with no buffer |
| Final choice after week 4 | KYC + integration compress | Launch moves roughly week-for-week |

**What can be built before the final choice**
- Catalog, cart, checkout shell, addresses, shipping options, tax display
- COD provider and order lifecycle
- Emails, admin fulfilment, refunds flow, analytics events
- A stub payment provider that simulates success, decline, timeout, and refund

**What needs the real provider**
- Hosted page/3DS/Apple Pay/NAPS behaviour, webhook signatures, refund/partial refund,
  settlement reporting, and sandbox certification.

**Cost of switching provider**
- **Before launch:** ~3–7 developer days to swap the provider module and re-run the test
  matrix. The expensive part is restarting KYC (2–4 weeks).
- **After launch:** high — tokenised cards, refunds, reconciliation, customer
  communication. Do not plan to switch after go-live.

**Recommendation:** name a **provisional primary + fallback** in week 1, start KYC on the
primary, and lock the final choice by **week 3**. If the client has not decided by then,
we proceed with the provisional primary and record the launch risk in writing.

---

## 3. Shortlist

| Provider | Profile | Strengths | Watch-outs |
|---|---|---|---|
| **Tap Payments** | GCC-focused PSP (Kuwait HQ), broad Qatar coverage | Strong API/docs, hosted checkout, Apple/Google Pay, cards, regional methods, good developer experience | Confirm NAPS/QPay support and Qatar settlement terms in writing |
| **MyFatoorah** | Kuwait-based, SME-friendly, active in Qatar | Fast onboarding, Arabic support, payment links/invoices, cards + wallets, multi-currency | Confirm hosted-page PCI scope, refund API, webhook signatures, settlement SLA |
| **PayTabs** | Saudi-based regional PSP, Qatar merchants | Hosted page, cards/wallets, invoicing, regional coverage, established | Confirm Qatar entity eligibility, NAPS support, support SLA |
| **QNB QPay** | Qatar domestic acquirer/gateway | Local trust, NAPS debit, direct bank relationship | API/developer experience varies; may need QNB merchant account; slower integration |
| **SkipCash** | Qatari fintech | Local, simple onboarding, cards/Apple Pay, payment links/QR | Smaller provider; confirm scale, refunds, webhooks, settlement |
| **Amazon Payment Services (PayFort)** | Enterprise regional PSP | Cards, instalments, GCC coverage | Heavier onboarding; confirm Qatar fit and fees |

**Not reliable for this launch:** Stripe (generally unavailable to Qatar-incorporated
businesses without an invite), PayPal (low share of Qatar checkout), and any provider that
cannot settle QAR to a Qatar bank.

> Capabilities change. Verify every line in the RFP, not from this table.

---

## 4. Evaluation matrix

Score each provider 1–5 against the client's priorities. Suggested weights:

| Criterion | Weight | Notes |
|---|---|---|
| Qatar eligibility + QAR settlement | 20% | Hard gate — fail = disqualify |
| Payment methods (cards, Apple/Google Pay, NAPS) | 20% | Conversion |
| Fees + settlement speed + hold policy | 15% | Total cost of ownership |
| Hosted page + PCI scope | 10% | Compliance effort |
| Refunds/partial refunds + webhooks | 10% | Operations |
| Sandbox + API/docs + support | 10% | Integration speed |
| Contract flexibility + rate-change terms | 5% | Lock-in risk |
| Reputation + references in Qatar | 5% | Trust |
| COD reconciliation support (courier partnership) | 5% | Operational fit |

**Recommended approach:** shortlist **two** providers and apply to both in parallel.
Choose the one that clears KYC first with acceptable commercials; keep the other as a
fallback. Do not let a rate difference of a few basis points delay launch by a month.

**Our default recommendation if the client has no preference:** evaluate **Tap** and
**MyFatoorah** first (developer experience + SME onboarding), with **PayTabs** as the
third quote. If NAPS/local debit is a hard requirement, confirm it explicitly or add
**QNB QPay** as a secondary method.

---

## 5. Questions to send each provider

Copy this into the RFP email:

1. Are we eligible as a Qatar-registered company with [licence activity]? What documents
   do you require?
2. Can you settle in **QAR** to a Qatar bank account? What is the settlement cycle (T+?),
   and what reserves/holds apply to a new merchant?
3. Which methods are supported in Qatar: Visa, Mastercard, **NAPS/QPay debit**, **Apple
   Pay**, **Google Pay**, Himyan, others?
4. Do you offer a **hosted payment page** or iframe? Does that keep the merchant in
   **PCI DSS SAQ A**?
5. What are all fees: setup, annual/platform, per-transaction, 3DS, refunds, chargebacks,
   FX, settlement, minimum monthly?
6. Do you support **authorise/capture**, **void**, **full and partial refunds** via API?
7. Are webhooks **signed**, retried, and idempotent? Do you provide a replay mechanism?
8. Do you provide a **sandbox** with test cards and 3DS simulation? How fast is access?
9. Do you support tokenisation/saved cards? Any additional PCI obligations?
10. What is the contract term, notice period, and how are rate changes handled?
11. What support do we get during integration (Slack/email/phone, SLA, docs)?
12. Do you have experience with Medusa or headless storefronts? (Helpful, not required.)
13. Do you support **COD** or partner with couriers for COD reconciliation? If not, we
    handle COD separately — confirm no conflict.
14. Can you provide two Qatar merchant references?

---

## 6. KYC document pack (prepare once, reuse)

Typically required (confirm per provider):

- [ ] Qatar **Commercial Registration (CR)** / trade licence
- [ ] Trade name certificate
- [ ] Articles of association / ownership structure
- [ ] **Bank account letter** or IBAN confirmation for settlement
- [ ] Authorised signatory **QID/passport** + proof of address
- [ ] Beneficial ownership declaration
- [ ] Tax card / tax registration (if applicable)
- [ ] Company profile and business activity description
- [ ] **Website URL** (staging is usually acceptable; production preferred)
- [ ] Refund, shipping, and privacy policies (published)
- [ ] Expected monthly volume, average order value, product categories
- [ ] Board resolution / authorisation letter (some providers)
- [ ] Utility bill or tenancy contract (some providers)

**Owner:** client. **Deadline:** week 1. We can draft the policy pages and provide the
staging URL, but the corporate documents must come from the client.

---

## 7. COD design (cash on delivery)

COD is not a gateway feature; it is an **order and cash-handling process**. We implement it
as a Medusa payment provider so COD and online orders share one lifecycle.

### 7.1 Payment provider

- Provider ID: `pp_cod_cod` (custom module, `AbstractPaymentProvider`).
- `initiatePayment` → creates a pending COD payment session.
- `authorizePayment` → marks the order as **COD confirmed** after verification.
- Capture happens **on delivery** (admin action or courier remittance import), not at checkout.
- Refunds are manual (bank transfer or store credit) and recorded against the order.
- No card data, no gateway webhook; the "webhook" is the courier's delivery/remittance file.

### 7.2 Order lifecycle

```
Placed (COD selected)
  → Verification (OTP via SMS/WhatsApp, address check, risk rules)
  → Confirmed
  → Fulfilled (handed to courier)
  → Delivered (customer pays cash/card to courier)
  → Remitted (courier pays merchant, minus fees)
  → Reconciled (order marked paid; cash matched)
```

Failure branches: `verification_failed`, `cancelled`, `refused_on_delivery`,
`returned_to_origin`, `lost_in_transit`. Each has an owner and an accounting treatment.

### 7.3 Fraud and loss controls

- **OTP verification** (SMS/WhatsApp) before dispatch for new customers or high-value orders.
- **Order value cap** for COD (client sets; e.g. QAR 500–1,000).
- **Prepaid-only** for high-value items, first orders above the cap, and restricted areas.
- **Address quality:** building/street/zone, landmark, phone; reject incomplete addresses.
- **Velocity limits:** per phone, per address, per IP; block known bad actors.
- **NDR workflow:** courier non-delivery reasons → retry, reschedule, or return.
- **Blacklist** shared between ops and support.

### 7.4 Reconciliation

- Courier provides a **remittance file/portal** (daily or weekly).
- Match: order ID, tracking, delivered date, COD amount, courier fee, net remittance.
- Import into a simple reconciliation sheet or admin report; flag mismatches.
- Accounting: cash-in-transit, courier fees, short payments, refunds.
- **Daily** review for the first month, then weekly if clean.
- COD fee (if charged to the customer) must be visible at checkout and on the invoice.

### 7.5 Customer experience

- COD shown as a payment option with any fee and the exact amount to prepare.
- Clear delivery window and "ID may be required" note.
- WhatsApp/SMS updates: confirmed, out for delivery, delivered.
- Refunds for COD returns: bank transfer or store credit — **not cash**, unless the client
  explicitly chooses otherwise and it is legally/operationally sound.

---

## 8. Integration plan (once the gateway is chosen)

| Step | Work | Owner | Output |
|---|---|---|---|
| 1 | Client selects gateway + submits KYC | Client | Application reference |
| 2 | Obtain sandbox credentials + docs | Us | Test account |
| 3 | Implement `AbstractPaymentProvider` module | Us | `src/modules/<gateway>` |
| 4 | Hosted payment session + return/cancel URLs | Us | Checkout redirect flow |
| 5 | Webhook route with signature verification + idempotency | Us | `/api/webhooks/<gateway>` |
| 6 | Capture, void, refund, partial refund | Us | Admin + API paths |
| 7 | Test matrix (below) | Us | Test report |
| 8 | Staging end-to-end order + refund | Us + client | Evidence |
| 9 | Production live keys + low-value real order | Us + client | Live proof |
| 10 | Monitor success rate, webhook lag, failures | Us | Dashboard/alerts |

### 8.1 Test matrix

- [ ] Successful card payment with 3DS challenge
- [ ] Successful Apple Pay (device/simulator)
- [ ] Declined card → clear customer message → retry
- [ ] 3DS failure / abandoned challenge
- [ ] Timeout at provider → no duplicate order
- [ ] Duplicate webhook replay → one order, one payment
- [ ] Invalid signature → rejected and logged
- [ ] Amount/currency mismatch → rejected
- [ ] Full refund → gateway + admin reconcile
- [ ] Partial refund → correct remaining balance
- [ ] Void before capture (if supported)
- [ ] Webhook delayed → confirmation page shows "processing", then resolves
- [ ] Provider outage → checkout degrades gracefully, COD remains available

### 8.2 Data we store

Only: gateway name, payment reference/session ID, status, amount, currency, timestamps,
and refund references. **Never** card number, CVV, expiry, or full gateway payloads
containing sensitive data. Logs are scrubbed.

---

## 9. Decision record (to fill at the workshop)

```
Provisional primary: __________________
Fallback: _____________________________
Final choice: _________________________
Fallback: _____________________________
KYC submitted: ________________________
Sandbox received: _____________________
Go-live target: _______________________
COD cap: QAR __________________________
COD fee: QAR __________________________
COD courier: __________________________
Reconciliation owner: _________________
```

---

## 10. Recommendation summary

1. **Name a provisional primary by end of week 1; finalise by week 3** — this is the
   single most schedule-sensitive decision after content.
2. **Apply to two providers in parallel** — Tap + MyFatoorah, or Tap + PayTabs.
3. **Prioritise eligibility, QAR settlement, NAPS support, and refunds** over a few basis
   points of rate.
4. **Keep COD as a Medusa payment provider**, not a manual side-process; it is the only way
   to keep reporting, refunds, and reconciliation sane.
5. **Set COD caps and OTP verification before launch** — fashion COD without controls
   becomes a returns and fraud problem.
