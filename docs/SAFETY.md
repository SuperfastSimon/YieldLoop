# SAFETY — invariant → file:line

| INV | Titel | Handhaving |
| --- | --- | --- |
| INV-1 | Disclosure | `src/lib/yieldloop/compliance.ts:88` `verifyArtefact` |
| INV-2 | No fabricated proof | `src/lib/yieldloop/compliance.ts:15` `FABRICATED_PATTERNS` |
| INV-3 | Prices are dated | `src/lib/yieldloop/compliance.ts:88` `verifyArtefact` |
| INV-4 | Consent boundary | `src/lib/yieldloop/compliance.ts:88` `verifyArtefact` |
| INV-5 | Allowlist only | `src/lib/yieldloop/compliance.ts:76` `isAllowlistedUrl` |
| INV-6 | Prohibited verticals | `src/lib/yieldloop/compliance.ts` `PROHIBITED_CLAIM_PATTERNS` |
| INV-7 | Spend cap | `src/lib/yieldloop/engine.ts:70` `debitBudget` |
| INV-8 | Human override | `src/lib/yieldloop/engine.ts:107` `setRunState` |
| INV-9 | Station clone gates | `src/lib/yieldloop/engine.ts:248` `evaluateClone` |

Honest UI: `isLive` / `publicLabel` in `compliance.ts` — nooit “Live” zonder
actieve `PublishRecord`.

Golden set: `evals/golden/*` + `GOLDEN_BODIES` in `fixtures.ts`.
