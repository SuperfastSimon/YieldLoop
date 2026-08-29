# YieldLoop — overdracht (zero context)

Laatst bijgewerkt: 2026-08-29. Werkende Grok Build-demo. Auth uit. Geen Neon.
Kernel = TypeScript in `src/lib/yieldloop/`. UI = TanStack Start-routes.
Persist = Zustand `yieldloop-v1` (localStorage).

**Nieuw gesprek?** Plak eerst `attachments/YIELDLOOP_NIEUW_GESPREK.md`.
Upload daarna `artifacts/YieldLoop-overdracht.zip`.

---

## Wat het is

Affiliate-besturingssysteem, geen chatbot met tips. Een **station** is een cel
die de lus draait: ontdekken → kiezen → produceren → toetsen → publiceren
(gated) → meten → leren → uitbreiden. Stations **klonen zichzelf** (celdeling):
copy-on-write skills, beleid mag alleen strakker, kind start altijd op
`T1_DRAFT`, budget-slice van de ouder, zonder ApprovalToken = proposal.

Niet: merchant, payment-processor, cloaking, cookie-stuffing, verzonnen
reviews, ads zonder spend-cap, Live-badge zonder `PublishRecord`.

## Eerste commando’s (in deze sandbox)

```
node --experimental-strip-types --test src/lib/yieldloop/engine.test.ts
```

UI-demo (10 min): Demo-cyclus → Content (blocked golden) → Kloon station
(zonder token = voorstel) → keuren op Commando → Golden set op Compliance
→ kill-switch in de sidebar.

## Waar de waarheid leeft

| Wat | Bestand |
| --- | --- |
| Types / enums | `src/lib/yieldloop/contracts.ts` |
| Gates INV-1…6, honest Live | `src/lib/yieldloop/compliance.ts` |
| Clone, cycle, budget, kill | `src/lib/yieldloop/engine.ts` |
| Seed + golden bodies | `src/lib/yieldloop/fixtures.ts` |
| Zustand persist | `src/lib/yieldloop/store.ts` |
| Pinning tests (21) | `src/lib/yieldloop/engine.test.ts` |
| Golden cases | `evals/golden/` |
| Invariants file:line | `docs/SAFETY.md` |
| Named-claims review | `docs/REVIEW.md` |
| Design tokens | `src/styles.css` |
| Merk | `public/favicon.svg`, `public/og.jpg`, `public/x-banner.jpg` |

## Clone (INV-9) — niet onderhandelbaar

`evaluateClone` weigert of keurt. `executeClone` maakt kind óf schrijft
proposal. Kind: `T1_DRAFT`, `generation+1`, tightened `nicheAllowlist`,
transferred budget, copied `skillIds`. Idempotent op `idempotencyKey`.
T4-ouder mag auto-clonen; anders ApprovalToken. Kill-switch, freeze,
allowlist, max generation/stations, parent-reserve = harde weigering.

## Autonomy

| Tier | Mag |
| --- | --- |
| T0_OBSERVE | Alleen lezen |
| T1_DRAFT | Artefacten, nooit publiceren (verse install / elk kind) |
| T2_GATED_ACT | Publiceren/klonen mét ApprovalToken |
| T3_BOUNDED_AUTO | Auto binnen PolicyEnvelope; promo vereist token |
| T4_EXPAND | Nieuwe niche/kanaal/kloon — altijd gated, nooit stil |

## Compliance (INV-1…9)

1. Disclosure vóór eerste affiliate-link (NL + EN strings in contracts).
2. Geen verzonnen bewijs (`FABRICATED_PATTERNS`).
3. Prijzen gedateerd / peildatum.
4. Geen `document.cookie` / pixel pre-consent.
5. Alleen allowlisted program-domains + `click_id`.
6. Verboden verticals default-off.
7. Spend cap (`debitBudget` weigert over cap).
8. Human override (`setRunState` STOP).
9. Clone-gates hierboven.

`isLive` / `publicLabel` in compliance.ts — nooit “Live” zonder actieve
PublishRecord.

## UI-routes

| Pad | Scherm |
| --- | --- |
| `/` | Commando: KPI’s, lineage, demo-cyclus, golden, clone-voorstellen |
| `/stations` | Stationlijst |
| `/stations/$stationId` | Detail + kloon-dialog + freeze/tier |
| `/loop` | Cyclus / StrategyMemo / jobs |
| `/content` | Artefacten + honest state-badges + publish/rollback |
| `/compliance` | Golden set + invariants |
| `/learn` | Skills + learner-patches (compliance-freeze) |
| `/ledger` | Budget, events, CSV-ingest |

Navigatie: `src/components/layout/AppShell.tsx`. Mark = twee overlapping
rounded rects (celdeling), teal `#3d9a86` op ink `#090c0b`.

## Design (niet cyberpunk)

- Ink `#090c0b` / surface `#111614` / elevated `#181e1c`
- Ivory `#e6eee9` / muted `#8a968e`
- Teal accent `#3d9a86`
- Fonts: Instrument Sans + IBM Plex Mono
- 8px grid, 150ms, 1px hairlines. Geen neon, geen matrix, geen paars.

## Seed (demo)

- Root: **NL Thuiswerk** (`stn_thuiswerk`, T2, niche thuiswerk)
- Kind: **NL Monitorarmen** (gen 1, T1)
- Kind: **NL Bureaus** (gen 1, T1)
- Programma’s: Bol, Awin, TradeTracker, generic CSV (fixtures, geen live API)
- Budget cap €2000, spent €540
- Golden negatives in fixtures: disclosure_missing, fabricated_claim,
  stale_price, allowlist_violation — moeten BLOCKED blijven

## Engine-API (pure functies, YieldState in → YieldState uit)

`evaluateClone` `proposeClone` `executeClone` `approveProposal` `rejectProposal`
`runCycle` `publishArtefact` `rollbackPublish` `verifyArtefact` `runGolden`
`setRunState` `freezeStation` `setStationTier` `debitBudget` `mergePatch`
`ingestCsv` `doctor` `resetDemo` `issueToken` `scoreOffer` `expectedNetWeek`

Store-actions: `applyClone` `applyCycle` `applyPublish` `applyRollback`
`applyApprove` `applyReject` `applyMerge` `applyKill` `applyFreeze`
`applyTier` `applyGolden` `applyCsv` `applyReset`.

## Wat expres niet gebouwd is (brief → sandbox)

Oorspronkelijke brief pinne Python 3.12 + SQLite + CLI + FastAPI/Next.
Grok Build-preview eist TanStack Start. Kernel is getransponeerd naar TS;
contracten en gates zijn identiek. Geen Python-CLI, geen echte netwerk-adapters,
geen scheduler, geen WordPress/social-publisher, geen Redis-queue.
`docs/HARD_RULES.md` is nooit aangemaakt (YieldLoop-regels leven hier + SAFETY).

## Niet doen

- Compliance-skills unfreezen via learner (`touchesCompliance` → REJECTED)
- Live-badge zonder PublishRecord
- Silent T3-promotie of silent clone
- PolicyEnvelope verruimen bij clone (alleen strakker)
- Kind T3/T4 laten erven
- Hacker-esthetiek / neon / matrix
- Auth aanzetten zonder dat de gebruiker accounts vraagt

## Vervolg (voor het volgende gesprek)

1. Echte program-adapters achter de bestaande `Program.network` union.
2. Filesystem/markdown publisher (brief: site EERST).
3. CLI-pariteit: doctor / run / status / approve / rollback / learn / expand.
4. Scheduler + idempotente cycle-jobs.
5. Persist naar SQLite/Neon alleen als accounts/sync gevraagd worden.
