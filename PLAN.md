# YieldLoop — plan

Werknaam: YieldLoop. Contracten en mappen blijven leidend.

## Stack (sandbox-contract)

Grok Build preview eist TanStack Start + React. De Python/FastAPI/CLI-kernel uit de oorspronkelijke brief is **getransponeerd** naar een TypeScript-kernel die de dashboard-preview daadwerkelijk draait. Domain, gates en golden set zijn identiek.

Auth: UIT. Database: UIT (demo-kernel + localStorage). Geen accounts gevraagd. Partner-IDs reizen mee in de verdien-link zodat bezoekers op een ander apparaat nog getagd uitkomen.

## Extra opdracht

Ieder affiliate-station kan zichzelf klonen (celdeling):
- copy-on-write skills
- PolicyEnvelope mag alleen strakker
- autonomy kind = T1_DRAFT (nooit T3/T4 erven)
- budget-slice van de ouder, min-reserve gehandhaafd
- zonder ApprovalToken of T4-envelope → ExpansionProposal, geen silent station
- kill-switch, freeze, allowlist, max generation/stations = harde weigering

## Batches

| Batch | Scope | Files |
| --- | --- | --- |
| 0 | Bootstrap + golden | `evals/golden/*`, `src/lib/yieldloop/compliance.ts` |
| 1 | Domain + ledger + events | `contracts.ts`, `engine.ts` debitBudget |
| 2 | Scout + fixtures + scoring | `fixtures.ts`, `scoreOffer` |
| 3 | Strategist + PolicyEnvelope + AutonomyTier | `runCycle` STRATEGISE, `setStationTier` |
| 4–5 | Producer + verifier | `produceBody`, `verifyArtefact` |
| 6 | Publisher + rollback | `publishArtefact`, `rollbackPublish` |
| 7 | Tracker + CSV | `ingestCsv` |
| 8 | Learner + skills | `mergePatch` (compliance freeze) |
| 9 | Expander + **station clone** | `evaluateClone`, `executeClone` |
| 10 | Sentinel + kill-switch | `setRunState`, `freezeStation` |
| 11 | Dashboard honest states | `publicLabel` / `isLive` |
| 12 | Operator surface | routes + demo-cyclus |
| 13 | Program adapters | fixtures bol/awin/tradetracker/csv |
| 14 | REVIEW named claims | `docs/REVIEW.md` |
| 15 | HANDOVER + SAFETY file:line | `docs/*` |
| 16 | Income + ship-gate | `links.ts`, `goLive`, `/verdienen`, `/p/$slug`, `/go/$clickId`, TERMS, PRIVACY, UX_NOTES, mvp-ship-gate workflow |

## Gates

- A Demo: cycle schrijft memo + artefact, 0 unauthorized publishes
- B Golden negatives kunnen niet naar LIVE
- C Event log append-only; reset is expliciet
- D Learner patch raakt compliance niet
- E Clone zonder token = proposal
- F UI nooit Live zonder PublishRecord
- G BudgetLedger weigert over cap
- H Named claims in REVIEW.md
- I goLive zonder partner-IDs weigert
- J /go buiten allowlist stuurt nergens heen
