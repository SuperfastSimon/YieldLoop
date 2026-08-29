# YIELDLOOP — plak dit als eerste bericht in een nieuw Grok-gesprek
# Upload daarna het zip-pakket (YieldLoop-overdracht.zip) of de bronmap `product/`.
# =============================================================================

Je neemt YieldLoop over. Zero prior context. Dit bericht + de bijlagen zijn de waarheid.

YieldLoop is een **affiliate-operating-system** (geen chatbot, geen game).
Een **station** is een cel. Stations **klonen zichzelf** (celdeling) onder harde gates.
De kernel is **TypeScript** (niet Python): Grok Build-preview draait TanStack Start.
Auth UIT. Database UIT. Zustand persist-key `yieldloop-v1`.

## Wat je moet bouwen / bewaren

Behoud het productcontract. Wijzig geen invariant zonder pinning-test.
Vraag de gebruiker wat de volgende stap is als dat niet in hun bericht staat.

### Stack (Grok Build)

- TanStack Start + React 19 + TypeScript + Tailwind v4 + Zustand
- Kernel: `src/lib/yieldloop/` (pure functies, `YieldState` in → uit)
- UI: `src/routes/` + `src/components/yieldloop/` + `AppShell`
- Tests: `src/lib/yieldloop/engine.test.ts` (21 cases, moeten groen blijven)
- Golden: `evals/golden/` + `GOLDEN_BODIES` in fixtures

### Design — professioneel, kalm, niet cyberpunk

- Ink `#090c0b` · surface `#111614` · elevated `#181e1c`
- Ivory `#e6eee9` · muted `#8a968e` · teal accent `#3d9a86`
- Fonts: Instrument Sans + IBM Plex Mono
- Mark: twee overlapping rounded rects (celdeling)
- Geen neon, geen matrix-regen, geen paars, geen hacker-cliché
- 8px grid, 150ms, 1px hairlines, 44px hit-targets

### Brand (al gemaakt, niet opnieuw tenzij gevraagd)

- `public/favicon.svg` — overlapping loops, teal op ink
- `public/og.jpg` — 1200×630 share-card, titel YieldLoop + tagline Affiliate OS
- `public/x-banner.jpg` — 1200×264, lockup links, scenery rechts
- `src/lib/og/site.json` — `{ "title": "YieldLoop", "card": "custom" }`
- Geen `"type": "x:game"` — dit is geen game

## Domain (closed enums)

AutonomyTier: T0_OBSERVE, T1_DRAFT, T2_GATED_ACT, T3_BOUNDED_AUTO, T4_EXPAND
ArtefactState: DRAFT, VERIFYING, BLOCKED, APPROVED, PUBLISHED, FAILED, ROLLED_BACK, FROZEN
Kind van een clone is ALTIJD T1_DRAFT. Verse install = T1. T3-promo = token.

INV-1 disclosure vóór eerste affiliate-link
INV-2 geen verzonnen bewijs
INV-3 prijzen gedateerd
INV-4 geen cookies vóór consent
INV-5 allowlist + click_id
INV-6 verboden verticals default-off
INV-7 spend cap
INV-8 human override / kill-switch
INV-9 clone-gates (zie hieronder)

NL-disclosure (exact):
«Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.»

## Clone-contract (INV-9) — niet onderhandelbaar

`evaluateClone` → Gate. Zonder ApprovalToken en zonder T4-ouder: code `NEEDS_APPROVAL`, schrijf ExpansionProposal, maak GEEN station.
`executeClone` met geldige token/T4:
- child.tier = T1_DRAFT (nooit T3/T4 erven)
- generation = parent.generation + 1
- policy mag alleen STRAKKER (nicheAllowlist ⊆ parent)
- budgetSlice van ouder, parent houdt minParentReserveEur
- skillIds copy-on-write
- idempotent op idempotencyKey
Harde weigering: kill-switch STOP, parent FROZEN, cloneEnabled=false, maxGeneration, maxStations, niche/language/channel off-allowlist, prohibited vertical, slice ≤ 0.

## Engine-API (bestaan al — niet hernoemen)

evaluateClone, proposeClone, executeClone, approveProposal, rejectProposal,
runCycle, publishArtefact, rollbackPublish, verifyArtefact, runGolden,
setRunState, freezeStation, setStationTier, debitBudget, mergePatch,
ingestCsv, doctor, resetDemo, issueToken, scoreOffer, expectedNetWeek

Store-actions: applyClone, applyCycle, applyPublish, applyRollback,
applyApprove, applyReject, applyMerge, applyKill, applyFreeze, applyTier,
applyGolden, applyCsv, applyReset.

## Routes

/ Commando (KPI, lineage, Demo-cyclus, Golden set, clone-voorstellen, Reset demo)
/stations lijst
/stations/$stationId detail + kloon-dialog
/loop cyclus + memo
/content artefacten, honest Live-badge, publish/rollback
/compliance golden + invariants
/learn skills + patches (learner mag compliance-skills NIET unfreezen)
/ledger budget, events, CSV

## Seed

Stations: NL Thuiswerk (root, T2), NL Monitorarmen (gen1 T1), NL Bureaus (gen1 T1)
Programs: Bol Partner, Awin, TradeTracker, Generic CSV — **fixtures, geen live API**
Budget cap €2000. Doelmetric: expected net commission / week onder caps.

## Tests die groen moeten blijven

Golden verifier: disclosure_missing INV-1, fabricated_claim INV-2, stale_price INV-3, allowlist_violation INV-5
runGolden markeert alle vier als correct geblokkeerd
nooit LIVE zonder actieve PublishRecord
clone zonder token = proposal
clone mét token = T1 child, gen+1, tightened policy, budget transfer
idempotent op dezelfde key
kill-switch weigert clone/cycle
budget-slice mag parent-reserve niet uithongeren
niche off-allowlist geweigerd
approveProposal voert pending clone uit
T1 cycle: artefacten, 0 unauthorized publishes
blocked golden kan niet gepubliceerd
T2 token → LIVE; rollback haalt LIVE weg
freeze blokkeert cycles
learner rejects touchesCompliance
T3 promo zonder token geweigerd
doctor groen op seed + golden

## Wat NIET gebouwd is (niet als bug behandelen tenzij gevraagd)

Python/FastAPI/CLI-kernel, SQLite event-log, echte Bol/Awin/PAAPI-adapters,
scheduler, WordPress/social publishers, Redis-queue, accounts/auth, PWA-manifest.
HARD_RULES.md bestaat niet; regels staan in docs/HANDOVER.md + docs/SAFETY.md.

## Niet doen

- Compliance-skills unfreezen via learner
- Live-badge zonder PublishRecord
- Silent T3-promotie of silent clone
- Policy verruimen bij clone
- Auth/DB aanzetten zonder expliciete vraag
- Hacker-esthetiek
- De 21 engine-tests laten falen
- og.jpg / x-banner / favicon regenereren tenzij de gebruiker om nieuwe merkstukken vraagt

## Bestandskaart in het zip-pakket

```
LEES_MIJ.md
attachments/YIELDLOOP_NIEUW_GESPREK.md   ← dit bestand
attachments/YIELDLOOP_GROK_BUILD_PROMPT.md  ← oorspronkelijke brief
docs/          HANDOVER, SAFETY, COMPLIANCE, REVIEW, BRIEF_CORRECTIONS
PLAN.md README.md
product/src/lib/yieldloop/   kernel (contracts, compliance, engine, fixtures, store, tests)
product/src/routes/          alle schermen
product/src/components/yieldloop/  mark, lineage, clone-dialog, status
product/src/components/layout/AppShell.tsx
product/src/styles.css
product/src/lib/og/site.json
product/evals/golden/
brand/  favicon.svg og.jpg x-banner.jpg
```

Als de gebruiker geen volgende stap noemt: bevestig dat je YieldLoop hebt,
som de 10-min demo, en vraag of ze verder willen met adapters, publisher,
CLI, persist, of UI-uitbreiding.
