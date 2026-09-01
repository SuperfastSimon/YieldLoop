# SAFETY — invariant → file:line

| INV | Titel | Handhaving |
| --- | --- | --- |
| INV-1 | Disclosure | `src/lib/yieldloop/compliance.ts` `verifyArtefact` |
| INV-2 | No fabricated proof | `src/lib/yieldloop/compliance.ts` `FABRICATED_PATTERNS` |
| INV-3 | Prices are dated | `src/lib/yieldloop/compliance.ts` `verifyArtefact` |
| INV-4 | Consent boundary | `src/lib/yieldloop/compliance.ts` `verifyArtefact` |
| INV-5 | Allowlist only | `src/lib/yieldloop/compliance.ts` `isAllowlistedUrl` + `/go` |
| INV-6 | Prohibited verticals | `src/lib/yieldloop/compliance.ts` `PROHIBITED_CLAIM_PATTERNS` |
| INV-7 | Spend cap | `src/lib/yieldloop/engine.ts` `debitBudget` |
| INV-8 | Human override | `src/lib/yieldloop/engine.ts` `setRunState` |
| INV-9 | Station clone gates | `src/lib/yieldloop/engine.ts` `evaluateClone` |

Honest UI: `isLive` / `publicLabel` in `compliance.ts` — nooit “Live” zonder
actieve `PublishRecord`.

Inkomen: `savePartner` / `goLive` / `recordClick` in `engine.ts`. Tagging in
`links.ts`. Zonder partner-IDs geen commissie en geen operator-live.

Golden set: `evals/golden/*` + `GOLDEN_BODIES` in `fixtures.ts`.
