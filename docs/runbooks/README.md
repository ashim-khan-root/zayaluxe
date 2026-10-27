# Runbooks

Operational procedures written to be followed at 2am by someone who did not build the
system. Phase 1 creates the skeleton (phases.md 1.11); Phase 5 requires each one to be
reviewed and drilled (phases.md 5.9).

| Runbook | Trigger | Status |
|---|---|---|
| [`deploy.md`](./deploy.md) | Shipping a release to staging or production | TODO — Phase 1.11 |
| [`rollback.md`](./rollback.md) | Error rate > 1%, checkout failure > 2%, p95 doubled | TODO — Phase 1.11 |
| [`restore.md`](./restore.md) | Data loss, corruption, failed migration | TODO — Phase 1.11 |
| `payment-outage.md` | Gateway down or success rate < 95% | TODO — Phase 3 |
| `stuck-orders.md` | Paid but unfulfilled > 24h; payment pending > 30 min | TODO — Phase 3 |
| `carrier-outage.md` | Courier API/collection disruption | TODO — Phase 3 |
| `certificate-dns.md` | TLS expiry, DNS misconfiguration | TODO — Phase 1.6 |
| `incident-response.md` | Sev-1/Sev-2, suspected breach or PII exposure | TODO — Phase 5 |
| `secrets.md` | Rotation on staff change or suspected leak | TODO — Phase 1.4 |

## Rules for every runbook

1. **Copy-pasteable commands**, with the environment variable names spelled out.
2. **A verification step** that proves the action worked — not just that the command exited 0.
3. **A rollback step** for the runbook itself.
4. **No secrets in the text.** Reference the secret manager path.
5. Timings recorded from the last drill (RTO ≤ 4h target, architecture.md §13).

## Escalation

Client owns business operations and first-line support; we own the platform during
hypercare. Named on-call owner and channel are agreed at the Phase 6 gate.
