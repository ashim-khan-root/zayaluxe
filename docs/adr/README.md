# Architecture Decision Records

One file per decision that a future maintainer would otherwise have to re-litigate.
ADR-001…ADR-015 already exist as a table in [`../architecture.md`](../architecture.md#15-architecture-decision-records);
this directory is for **new** decisions and for promoting a table row into a full record
when it grows nuance.

## When to write one

- A choice that is expensive to reverse (stack, hosting region, payment model).
- A documented shortcut (e.g. metadata attribute sets instead of a PIM module).
- Any deviation from `architecture.md`. Phase 1 gate requires this: "ADRs recorded for
  any deviation" (phases.md 1.12).

## Naming

`NNNN-short-slug.md` — zero-padded, never renumbered. `0001-…` is the first new record;
existing ADR-001…015 keep their numbers.

## Status values

`Proposed` · `Accepted` · `Superseded by ADR-NNNN` · `Rejected`
