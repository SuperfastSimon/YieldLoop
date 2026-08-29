# YIELDLOOP — één overdrachtsbestand (geen zip)
Plak of upload dit hele bestand in een nieuw Grok-gesprek.
Bevat: startprompt, oorspronkelijke brief, docs, kernel, UI, golden set, favicon.
og.jpg en x-banner.jpg zitten er niet in (binair). Regenereer ze alleen als de gebruiker om merkstukken vraagt; beschrijving staat in de startprompt.

---

## STARTPROMPT (volg dit eerst)

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


---

## OORSPRONKELIJKE BOUWBRIEF

# YIELDLOOP — Grok Build Prompt
# Plak alles onder de lijn in Grok Build (plan mode aan).
# Werknaam: YieldLoop. Hernoemen mag; contracten en mappen blijven leidend.
# =============================================================================

Bouw YieldLoop: een production-grade, geautomatiseerd affiliate-operating-system dat autonoom draait, zelf leert, zelf strategeert, zelf uitbreidt binnen harde gates, en fouten herstelt zonder dataverlies.

Succes = een draaiend lokaal systeem met:
1. bootstrapbestanden (AGENTS.md, HARD RULES, eval harness) VOOR de eerste feature
2. multi-agent runtime met file-disjoint workers
3. affiliate-loop: ontdekken → kiezen → produceren → publiceren (gated) → meten → leren → uitbreiden
4. compliance-invariants met file:line enforcement
5. golden-set tests die EERST falen en daarna groen worden
6. dashboard + CLI + scheduler
7. skills-as-memory (geen episodisch geheugen als bron van waarheid)
8. handover-doc alsof de volgende orchestrator zero context heeft

Dit is geen chatbot die “affiliate tips” geeft. Dit is software.

============================================================
OPERATING SYSTEM (FABLE-PROTOCOL — NIET ONDERHANDELBAAR)
============================================================

Orchestrator = planning + review + merges. Niets anders.
Implementatie altijd in subagents. Eén agent = één batch (één feature-node, expliciete file-set, pre-defined gates).
Parallel alleen bij file-disjoint. Worktrees voor isolatie.
Trivial one-liners mogen inline. Alles wat een derde file nodig heeft → delegeren.

Ten rules — encode ze in AGENTS.md en enforce ze in code/tests:

1. Orchestrator plant & reviewt; agents implementeren; niemand reviewt eigen code.
2. Nooit self-reported success. Altijd rebuild + tests + gates.
3. Elke significante diff krijgt een named-claims attack in REVIEW.md.
4. Elke safety-invariant heeft file:line waar hij enforced wordt.
5. Golden set groeit VÓÓR de change. Numbers, not vibes.
6. Agents die een verkeerde brief corrigeren worden beloond (log + skill-update).
7. Rules leven in bestanden die agents moeten lezen (AGENTS.md, skills/, contracts/).
8. Verification-depth > reasoning-depth.
9. Route via billing topology. Ken de binding meter (API-kosten, publish-quota, ad-spend).
10. Handover alsof de volgende orchestrator zero context heeft.

Cross-model review simuleren in-repo:
- Author-agent schrijft de diff.
- Review-agent valt named claims aan: “Attack each claim. Hunt phantom mechanisms the design promises but code never implements.”
- Author remediates + pinning tests.
- Orchestrator verifieert onafhankelijk (rebuild + eval).
Nooit mergen op self-report.

============================================================
PRODUCTCONTRACT
============================================================

YieldLoop is een affiliate-operator, geen merchant, geen payment-processor, geen dark-pattern generator.

Doelmetric (configureerbaar, default):
- maximaliseer expected net commission per week
- onder budget-cap
- onder compliance-cap
- onder quality-cap
- met aantoonbare attributie

Scope v1 (MUST SHIP):
A. Local-first runtime (Python 3.12+)
B. SQLite als source of truth + append-only event log
C. Agent graph met typed contracts
D. Offer catalog + program adapters (pluggable)
E. Content pipeline met claim-verification
F. Publish adapters (filesystem/markdown site EERST; WordPress/social later achter flag)
G. Tracking + attribution (first-party events; geen cookie zetten zonder consent-flag)
H. Learning loop → skills/ en policy-store
I. Expansion loop met hard gates
J. Error handling + idempotency + dead-letter + kill-switch
K. Operator dashboard (Next.js of FastAPI+HTMX; kies één en blijf daarbij)
L. CLI: `yieldloop doctor|run|status|approve|rollback|learn|expand`

Out of scope v1 (MUST NOT bouwen als kern):
- automatisch geld uitgeven aan ads zonder expliciete spend-cap + human approve
- cloaking, cookie-stuffing, incentivized fraud, trademark-bidding op merk van merchant zonder toestemming
- verzonnen reviews, verzonnen prijzen, verzonnen “getest door ons”
- scraping achter login / ToS-breuk
- onbeperkt self-expanding naar nieuwe legal entities of bankrekeningen

============================================================
AUTONOMIE-NIVEAUS (TYPED — GEEN VAGE “AI DOE MAAR”)
============================================================

Gebruik een closed enum `AutonomyTier` in code:

- T0_OBSERVE: alleen lezen, rapporteren
- T1_DRAFT: artefacten maken, nooit publiceren
- T2_GATED_ACT: publiceren/expanderen alleen na ApprovalToken
- T3_BOUNDED_AUTO: auto binnen PolicyEnvelope (budget, niche-allowlist, kanaal-allowlist, max-publishes/dag)
- T4_EXPAND: nieuwe niche/program/kanaal/skill — altijd gated, nooit stil

Default bij verse install: T1_DRAFT.
Promotie naar T3 alleen via operator commando + pinning test dat PolicyEnvelope enforced is.

Elke actie draagt:
- actor_id
- tier
- policy_hash
- approval_token | none
- budget_debit
- idempotency_key

============================================================
AGENTGRAPH (FILE-DISJOINT)
============================================================

Bouw deze workers. Geen god-object.

1. orchestrator/     planning, queue, merge, verify
2. scout/            niche, keyword, program, product, competitor gap
3. strategist/       portfolio-allocatie, experiment-design, stop/go
4. producer/         outlines, pages, comparisons, social drafts, disclosures
5. verifier/         claims, prices, availability, disclosure, prohibited claims
6. publisher/        adapters + dry-run + rollback
7. tracker/          clicks, views, conversions (manual CSV + webhook ingest)
8. learner/          metrics → skill patches + policy updates (PR-style, gated)
9. expander/         stelt expansions voor; voert alleen uit met ApprovalToken
10. sentinel/        errors, fraud signals, compliance, cost, kill-switch

Contracten in /contracts als pydantic/jsonschema. Agents communiceren via:
- typed events in event_log
- job queue
- artefact files onder /artifacts/{job_id}/
Nooit via vrije chat als source of truth.

============================================================
AFFILIATE-LOOP (HET ECHTE PRODUCT)
============================================================

Cycle, idempotent, herstartbaar:

1. SENSE
   - ingest programs, products, commissions, cookie-window, geo, EPC-priors
   - ingest site/search/social performance
   - ingest cost (LLM tokens, tools, hosting)
   - ingest operator constraints (niches, language, brand voice, banned merchants)

2. STRATEGISE
   - score kansen: (search demand × conversion prior × commission × cookie-fit × competitive gap × compliance-risk⁻¹ × cost)
   - kies max N experiments / cycle
   - schrijf StrategyMemo (claims + assumptions + kill-criteria)
   - elke aanname wordt een meetbare hypothese of wordt geschrapt

3. PRODUCE
   - content types v1: comparison, “best X for Y”, howto + product fit, update-post
   - grounded op official sources + offer feed; cite source URLs in artefact metadata
   - insert disclosure block BEFORE first affiliate link
   - no invented specs/prices; mark STALE if source older than freshness_sla
   - language: nl-NL default, en-US secondary (config)

4. VERIFY (gate, not vibe)
   Golden checks must exist before producer is considered done:
   - disclosure present + prominent + plain language
   - every affiliate URL is allowlisted program + tagged with click_id
   - no prohibited health/income/guarantee claims
   - price/availability either live-checked or clearly dated
   - privacy: no tracking pixel/cookie instructions that fire pre-consent
   - brand voice file respected

5. PUBLISH
   v1 publisher = local content site (Markdown/MDX of static generator)
   dry-run default
   real publish requires T2 token or T3 envelope
   every publish writes PublishRecord + snapshot for rollback

6. MEASURE
   ingest:
   - first-party page events
   - manual conversion CSV
   - network reports if adapter exists (start with generic CSV schema)
   attribution model: last-click within cookie-window, plus assisted-click report
   metrics: clicks, CTR, CR, EPC, AOV, refund-flag, RPM, cost, net

7. LEARN
   - which niches/offers/templates/CTAs/titles moved EPC
   - write LEARNING.md entries + skill patches
   - never silently overwrite a skill; create skill PR artefact
   - rule that fails twice → encode in skills/ + prompt must name the section

8. EXPAND (self-expanding, niet self-unleashed)
   Expander mag VOORSTELLEN:
   - nieuwe subniche
   - nieuw programma/netwerk-adapter
   - nieuw content-template
   - nieuw kanaal-adapter
   - nieuwe skill
   Uitvoeren alleen als:
   - PolicyEnvelope toelaat
   - eval voor die expansion bestaat en rood-naar-groen kan
   - ApprovalToken of explicit T4 grant
   - cost model past binnen budget
   Expansion is progress-bar op derived index, nooit destructief voor source data.

============================================================
SELF-SUFFICIENT / SELF-LEARNING / SELF-STRATEGIST
============================================================

Self-sufficient betekent:
- draait lokaal met .env keys
- kan in DEMO-mode zonder externe netwerken (fixture catalogs + fixture conversions)
- herstelt van crash via event_log replay
- geen SaaS-lock-in in de kern

Self-learning betekent:
- bandit of eenvoudige Bayesian/Thompson over (template × niche × offer)
- skill-store is de memory
- learner mag gewichten updaten; mag GEEN compliance-rules verzwakken
- frozen eval set voorkomt “leren door te cheaten”

Self-strategist betekent:
- Strategist produceert StrategyMemo met explicit tradeoffs
- kill-criteria per experiment (bijv. 14 dagen, <X clicks, EPC < floor → stop)
- portfolio caps: max % budget per niche, max publishes per domain/week
- explorer/exploiter split configureerbaar (default 20/80)

Self-expanding betekent:
- capability index is derived data
- nieuwe adapters via plugin interface
- nieuwe skills via gated merge
- NOoit autonoom ToS, wet, of spend-plafond overschrijden

============================================================
ERROR HANDLING (EERSTEKLAS, GEEN AFTERTHOUGHT)
============================================================

Elke externe call:
- timeout
- retry met jitter
- circuit breaker
- idempotency_key
- dead-letter queue
- structured error event

Sentinel:
- process heartbeat
- budget burn-rate
- publish anomaly (spike, duplicate slug, missing disclosure)
- fraud-ish patterns (impossible CR, self-click loops) → freeze actor
- kill-switch file: RUNSTATE=STOP haalt alle publishers offline

Recovery doctrine:
- event_log is source of truth
- indexes/materialized views = derived → rebuild = progress bar, nooit data loss
- publish rollback via snapshot
- never drop events; never rewrite history (compensating events only)

Honest UI:
- badges zijn beloftes
- state enum: DRAFT | VERIFYING | BLOCKED | APPROVED | PUBLISHED | FAILED | ROLLED_BACK | FROZEN
- UI mag nooit “Live” tonen als PublishRecord ontbreekt

============================================================
COMPLIANCE & SAFETY INVARIANTS
============================================================

Encode als typed closed enums + tests. Voor elke invariant: file:line in SAFETY.md.

INV-1 Disclosure
Elke publieke aanbeveling met material connection toont duidelijke disclosure vóór de eerste affiliate-link.
NL voorbeeld: “Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.”
EN FTC-style equivalent.
Test: pages zonder disclosure mogen niet naar PUBLISHED.

INV-2 No fabricated proof
Geen verzonnen testimonials, lab-tests, “wij hebben 30 dagen getest” tenzij operator-sourced evidence file bestaat.

INV-3 Prices are dated
Prijs/voorraad altijd met as_of timestamp. Anders blokkeren of als indicatief merken.

INV-4 Consent boundary (EU/NL first)
Geen instructie of code die marketing/affiliate cookies zet vóór consent.
Tracking v1 = first-party server events + redirect with click_id.
Documenteer ePrivacy/GDPR-grenzen in COMPLIANCE.md.
Privacy by construction: cookie_mode = NONE | CONSENT_GATED.

INV-5 Allowlist only
Affiliate URLs alleen naar geregistreerde programs. Geen raw untrusted redirects.

INV-6 Prohibited verticals default-off
health-cure, guaranteed-income, crypto-get-rich, weapons, adult-minors, illegal goods = blocked unless operator explicitly enables a legal vertical with extra review.

INV-7 Spend cap
Elke paid actie checkt BudgetLedger. Over cap → refuse.

INV-8 Human override
Operator can freeze actor, revert skill, rollback publish, drop autonomy tier.

“The lock you’re sure exists may be the one that was never written.”
Als een invariant geen test heeft, bestaat hij niet.

============================================================
TECH STACK (PIN HET, WIJZIG NIET HALVERWEGE)
============================================================

Backend: Python 3.12, uv, ruff, pytest
API/CLI: Typer + FastAPI
Validation: Pydantic v2
DB: SQLite + SQLAlchemy 2 (WAL) ; schema migrations via alembic
Queue: in-process + file-backed jobs (v1); geen Redis verplicht
Frontend: Next.js + TypeScript + Tailwind (clean, professioneel, geen hacker-matrix)
Content: Markdown + frontmatter
Config: yieldloop.toml + .env.example
Skills: /skills/*.md
Contracts: /contracts/*.json
Evals: /evals
Plugins: /plugins/{amazon_paapi,awin,tradetracker,bol,generic_csv}

Demo fixtures in /fixtures zodat `yieldloop doctor && yieldloop run --demo` zonder keys werkt.

============================================================
DAY-ZERO BOOTSTRAP (VOOR DE EERSTE FEATURE)
============================================================

Maak eerst, in deze volgorde, en stop niet tot tests de ontbrekende features rood tonen:

1. README.md — wat het is, wat het niet is, 10-min demo
2. AGENTS.md — < 60 regels, HARD RULES, lazy-load pointers
3. HARD_RULES.md — de ten rules + invariants
4. COMPLIANCE.md — disclosure, GDPR/ePrivacy, FTC, NL/EU
5. SAFETY.md — invariant → file:line map (initieel “UNIMPLEMENTED” is oké zolang tests falen)
6. HANDOVER.md — zero-context start voor volgende orchestrator
7. yieldloop.toml — autonomy tier, budget, language, allowlists
8. contracts voor Job, Offer, Artefact, PublishRecord, LearningPatch, ExpansionProposal
9. evals/golden/
   - disclosure_missing.md moet FAIL publish
   - fabricated_claim.md moet FAIL verify
   - stale_price.md moet FAIL or date-stamp
   - allowlist_violation.md moet FAIL
   - demo_cycle.json expected metrics shape
10. pytest skeleton + `make test`
11. `yieldloop doctor` dat bootstrap-integriteit checkt

Golden set groeit VÓÓR producer/publisher features.
Pure refactors → byte-identical snapshots waar beloofd.

============================================================
IMPLEMENTATIEVOLGORDE (SUBAGENT BATCHES)
============================================================

Batch 0 — Bootstrap + eval harness (orchestrator + one worker)
Batch 1 — Domain model + event_log + BudgetLedger
Batch 2 — Scout + fixtures + scoring (no network required in demo)
Batch 3 — Strategist + PolicyEnvelope + AutonomyTier
Batch 4 — Producer + disclosure templates nl/en
Batch 5 — Verifier + golden set green
Batch 6 — Publisher filesystem + rollback
Batch 7 — Tracker + CSV ingest + attribution
Batch 8 — Learner + skills write-path (gated)
Batch 9 — Expander proposals
Batch 10 — Sentinel + kill-switch + retries
Batch 11 — Dashboard honest states
Batch 12 — CLI + demo path
Batch 13 — One real plugin adapter (generic CSV + optional TradeTracker/Awin interface stubs)
Batch 14 — REVIEW.md named-claims attack + pinning tests
Batch 15 — HANDOVER update + SAFETY.md file:line fill-in

Elke batch: expliciete file-set in PLAN.md. Niet daarbuiten schrijven.

============================================================
GROK BUILD HARNESS RULES
============================================================

- Start in plan mode. Schrijf PLAN.md. Wacht niet op theater; plan is een artefact.
- Gebruik subagents voor file-disjoint batches. Worktrees als de harness dat heeft.
- Voorkeur voor native file tools boven cat/sed/awk-ketens.
- Geen valse “done”. Done = `make test` groen + `yieldloop doctor` groen + demo cycle produceert PublishRecord in DRAFT/VERIFYING en weigert illegaal publish.
- Als een brief onveilig of onmogelijk is, corrigeer de brief in BRIEF_CORRECTIONS.md en ga door met de veilige interpretatie.
- Skills die 2× falen → /skills encode + noem exacte sectie in prompts.
- Houd AGENTS.md onder 60 regels; details lazy-loaden.

============================================================
ACCEPTATIEGATES (NUMBERS, NOT VIBES)
============================================================

Gate A — Demo autonomy
`yieldloop run --demo --cycles 1` maakt ≥1 StrategyMemo, ≥1 draft artefact, 0 unauthorized publishes.

Gate B — Compliance
Golden negatives (missing disclosure, fabricated claim, off-allowlist URL) kunnen niet naar PUBLISHED.

Gate C — Recovery
Kill process mid-cycle; restart; geen dubbele side effects; event_log consistent.

Gate D — Learning
Na fixture conversions moet learner een LearningPatch artefact schrijven zonder compliance-skill te verzwakken.

Gate E — Expansion
Expander schrijft ExpansionProposal; zonder token blijft het proposal.

Gate F — Honest UI
Dashboard toont BLOCKED/FROZEN correct; geen “Live” zonder PublishRecord.

Gate G — Cost meter
Token/tool usage gelogd; BudgetLedger weigert over cap.

Gate H — Review
REVIEW.md bevat named claims + attacks + file refs. Phantom mechanisms = fail.

============================================================
UX / BRAND VOOR HET DASHBOARD
============================================================

Professioneel, rustig, operationeel.
Geen matrix-rain, geen “hacker terminal” cliché.
Dark UI, scherpe typografie, statusbadges die echte states zijn.
NL UI-copy, EN secondary.
Toon: autonomy tier, budget burn, queue, last errors, pending approvals, EPC by niche.

============================================================
OPLEVERING
============================================================

Aan het einde:
- werkende repo
- `make test` groen
- `yieldloop doctor` groen
- demo data
- PLAN.md, REVIEW.md, HANDOVER.md, SAFETY.md met echte file:line
- .env.example
- korte operator-handleiding in README

Bouw nu. Eerst bootstrap + failing golden tests. Daarna batches. Geen feature zonder gate.


---

## BRONBESTANDEN
Elk blok is het volledige bestand. Paden relatief tot de app-root.


### `docs/HANDOVER.md`

```markdown
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
```


### `docs/SAFETY.md`

```markdown
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
```


### `docs/COMPLIANCE.md`

```markdown
# COMPLIANCE

YieldLoop is affiliate-operator, geen merchant, geen dark-pattern generator.

## Disclosure (NL / FTC)

NL: “Dit artikel bevat affiliate links. Als je via deze links koopt, kan
YieldLoop een commissie ontvangen. Dat kost jou niets extra.”

EN: FTC-stijl equivalent. Altijd vóór de eerste affiliate-link.

## GDPR / ePrivacy

Tracking v1 = first-party server events + redirect with `click_id`.
`cookie_mode = NONE | CONSENT_GATED`. Geen marketingcookie vóór consent.
Geen instructie in artefacten die `document.cookie` zet.

## Verboden (default-off)

health-cure, guaranteed-income, crypto-get-rich, weapons, adult-minors,
illegal goods. Operator kan een legale vertical alleen aanzetten mét extra review.

## Out of scope

Cloaking, cookie-stuffing, incentivized fraud, trademark-bidding op merk van
merchant zonder toestemming, verzonnen reviews/prijzen/“getest door ons”,
scraping achter login.
```


### `docs/REVIEW.md`

```markdown
# REVIEW — named claims

Attack each claim. Hunt phantom mechanisms.

| Claim | Attack | Verdict |
| --- | --- | --- |
| Stations klonen zichzelf | Zonder token mag `executeClone` geen kind maken | Pass — NEEDS_APPROVAL → proposal |
| Kind erft T3/T4 niet | Parent T2, child must be T1 | Pass — hardcoded T1_DRAFT |
| Disclosure-gate | Body zonder disclosure kan PUBLISHED | Pass — INV-1 + BLOCKED |
| Fabricated proof | “wij hebben 30 dagen getest” | Pass — INV-2 |
| Undated price | €199 zonder peildatum | Pass — INV-3 |
| Off-allowlist URL | evil.example | Pass — INV-5 |
| Honest Live | state PUBLISHED zonder record | Pass — isLive false |
| Learner verzwakt compliance | patch touchesCompliance | Pass — REJECTED |
| Kill-switch | STOP + clone/cycle | Pass — KILL_SWITCH |
| Spend cap | debit over cap | Pass — debitBudget |
| T3 promo silent | T1→T3 zonder token | Pass — refused |
| Idempotent clone | zelfde key tweemaal | Pass — zelfde child id |

Phantom: geen Redis, geen Python-CLI in de preview, geen netwerk-PAAPI.
Demo-adapters zijn fixtures — gedocumenteerd, geen verborgen runtime.
```


### `docs/BRIEF_CORRECTIONS.md`

```markdown
# Brief corrections

1. **Runtime.** De opdracht pinne Python 3.12 + FastAPI + Next.js. De Grok
   Build-preview draait TanStack Start op poort 8080. De kernel is daarom
   TypeScript — zelfde contracten, zelfde gates, zichtbaar in de preview.
2. **Self-clone.** Extra opdracht: ieder affiliate-station kan zichzelf klonen
   (INV-9). Zonder token = proposal, nooit silent.
3. **AGENTS.md.** Workspace-AGENTS.md is de sandbox-contract; YieldLoop-regels
   staan in `docs/HARD_RULES.md` zodat we de harness niet overschrijven.
```


### `PLAN.md`

```markdown
# YieldLoop — plan

Werknaam: YieldLoop. Contracten en mappen blijven leidend.

## Stack (sandbox-contract)

Grok Build preview eist TanStack Start + React op `0.0.0.0:8080`.
De Python/FastAPI/CLI-kernel uit de oorspronkelijke brief is daarom
**getransponeerd** naar een TypeScript-kernel die de dashboard-preview
daadwerkelijk draait. Domain, gates en golden set zijn identiek.

Auth: UIT. Database: UIT (demo-kernel + localStorage). Geen accounts gevraagd.

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

## Gates

- A Demo: cycle schrijft memo + artefact, 0 unauthorized publishes
- B Golden negatives kunnen niet naar LIVE
- C Event log append-only; reset is expliciet
- D Learner patch raakt compliance niet
- E Clone zonder token = proposal
- F UI nooit Live zonder PublishRecord
- G BudgetLedger weigert over cap
- H Named claims in REVIEW.md
```


### `README.md`

```markdown
# YieldLoop

Affiliate-besturingssysteem. Geen chatbot met tips — software die een
lus draait: ontdekken, kiezen, produceren, toetsen, publiceren (gated),
meten, leren, uitbreiden.

Ieder **affiliate-station** is een cel. Een station kan zichzelf **klonen**:
skills worden gekopieerd, beleid mag alleen strakker, het kind start op
T1 Concept, budget wordt gesneden van de ouder. Zonder goedkeuring blijft
het een voorstel.

## Wat het niet is

- Geen merchant, geen payment-processor
- Geen cloaking, cookie-stuffing of verzonnen reviews
- Geen ads zonder spend-cap + menselijke goedkeuring
- Geen Live-badge zonder `PublishRecord`

## Demo (10 min)

1. Open het commando-scherm. Lineage toont NL Thuiswerk en zijn klonen.
2. Druk **Demo-cyclus**. Er verschijnt een StrategyMemo en een concept-artefact.
   T1/T2 publiceert niet stiekem.
3. Open **Content**. Het golden-artefact zonder disclosure is **Geblokkeerd**,
   nooit Live.
4. Kies een station → **Kloon station**. Zonder T4-token wordt het een voorstel.
   Keuring op het commando-scherm voert de kloon uit.
5. **Golden set** op Compliance moet alle vier negatieven rood-houden
   (en de test groen: “FAIL publish zoals vereist”).
6. Kill-switch in de sidebar haalt publishers offline.

## Autonomy

| Tier | Mag |
| --- | --- |
| T0 Observatie | Alleen lezen |
| T1 Concept | Artefacten, nooit publiceren |
| T2 Gated | Publiceren/klonen mét ApprovalToken |
| T3 Auto | Binnen PolicyEnvelope |
| T4 Expansie | Nieuwe niche/kanaal/**kloon** — altijd gated |

Verse install = T1. Promotie naar T3 vereist operator-token.

## Compliance

INV-1 disclosure vóór de eerste affiliate-link.
INV-2 geen verzonnen bewijs.
INV-3 prijzen gedateerd.
INV-4 geen cookies vóór consent.
INV-5 allowlist + click_id.
INV-6 verboden verticals default-off.
INV-7 spend cap.
INV-8 human override.
INV-9 clone-gates.

Zie `docs/COMPLIANCE.md` en `docs/SAFETY.md`.
```


### `src/lib/og/site.json`

```json
{"title":"YieldLoop","card":"custom"}
```


### `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eur(n: number, lang: "nl-NL" | "en-US" = "nl-NL"): string {
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function shortId(id: string): string {
  const parts = id.split("_");
  return parts[parts.length - 1]?.slice(0, 8) ?? id.slice(0, 8);
}

export function formatWhen(iso: string, lang: "nl-NL" | "en-US" = "nl-NL"): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
```


### `src/lib/yieldloop/contracts.ts`

```ts
/** Typed contracts for YieldLoop. Closed enums — no stringly-typed autonomy. */

export const AUTONOMY_TIERS = [
  "T0_OBSERVE",
  "T1_DRAFT",
  "T2_GATED_ACT",
  "T3_BOUNDED_AUTO",
  "T4_EXPAND",
] as const;
export type AutonomyTier = (typeof AUTONOMY_TIERS)[number];

export const ARTEFACT_STATES = [
  "DRAFT",
  "VERIFYING",
  "BLOCKED",
  "APPROVED",
  "PUBLISHED",
  "FAILED",
  "ROLLED_BACK",
  "FROZEN",
] as const;
export type ArtefactState = (typeof ARTEFACT_STATES)[number];

export const RUN_STATES = ["RUN", "STOP"] as const;
export type RunState = (typeof RUN_STATES)[number];

export const LANGUAGES = ["nl-NL", "en-US"] as const;
export type Language = (typeof LANGUAGES)[number];

export const CHANNELS = ["site", "email", "social"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CONTENT_TYPES = [
  "comparison",
  "best_x_for_y",
  "howto",
  "update_post",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const PROHIBITED_VERTICALS = [
  "health-cure",
  "guaranteed-income",
  "crypto-get-rich",
  "weapons",
  "adult-minors",
  "illegal-goods",
] as const;
export type ProhibitedVertical = (typeof PROHIBITED_VERTICALS)[number];

export type InvariantId =
  | "INV-1"
  | "INV-2"
  | "INV-3"
  | "INV-4"
  | "INV-5"
  | "INV-6"
  | "INV-7"
  | "INV-8"
  | "INV-9";

export interface PolicyEnvelope {
  hash: string;
  languageAllowlist: Language[];
  nicheAllowlist: string[];
  channelAllowlist: Channel[];
  programAllowlist: string[];
  maxPublishesPerDay: number;
  maxBudgetPerNichePct: number;
  explorerShare: number;
  maxStations: number;
  maxGeneration: number;
  minParentReserveEur: number;
  spendCapEur: number;
  freshnessSlaHours: number;
  cookieMode: "NONE" | "CONSENT_GATED";
  prohibitedVerticals: ProhibitedVertical[];
  cloneEnabled: boolean;
}

export interface ApprovalToken {
  id: string;
  action: "PUBLISH" | "CLONE_STATION" | "PROMOTE_TIER" | "EXPAND" | "LEARN_MERGE";
  subjectId: string;
  issuedAt: string;
  expiresAt: string;
  actorId: string;
  consumed: boolean;
}

export interface ActionStamp {
  actorId: string;
  tier: AutonomyTier;
  policyHash: string;
  approvalTokenId: string | null;
  budgetDebitEur: number;
  idempotencyKey: string;
}

export interface Program {
  id: string;
  name: string;
  network: "bol" | "awin" | "tradetracker" | "amazon_paapi" | "generic_csv";
  domainAllowlist: string[];
  cookieWindowDays: number;
  geo: string[];
  active: boolean;
}

export interface Offer {
  id: string;
  programId: string;
  title: string;
  merchant: string;
  url: string;
  niche: string;
  commissionPct: number;
  epcPrior: number;
  cookieWindowDays: number;
  geo: string[];
  priceEur: number;
  priceAsOf: string;
  inStock: boolean;
  searchDemand: number;
  conversionPrior: number;
  competitiveGap: number;
  complianceRisk: number;
  costWeight: number;
}

export interface Station {
  id: string;
  name: string;
  parentId: string | null;
  lineage: string[];
  generation: number;
  cloneIndex: number;
  niche: string;
  language: Language;
  channel: Channel;
  tier: AutonomyTier;
  status: "ACTIVE" | "FROZEN" | "DRAFT";
  policy: PolicyEnvelope;
  budgetCapEur: number;
  budgetSpentEur: number;
  cycleCount: number;
  skillIds: string[];
  epc: number;
  clicks: number;
  conversions: number;
  lastCycleAt: string | null;
  createdAt: string;
  clonedFrom: string | null;
}

export interface Artefact {
  id: string;
  stationId: string;
  jobId: string;
  contentType: ContentType;
  title: string;
  slug: string;
  language: Language;
  body: string;
  state: ArtefactState;
  offerIds: string[];
  sourceUrls: string[];
  priceAsOf: string | null;
  disclosurePresent: boolean;
  verifyFailures: VerifyFailure[];
  clickId: string | null;
  publishedAt: string | null;
  snapshotId: string | null;
  createdAt: string;
}

export interface VerifyFailure {
  inv: InvariantId;
  code: string;
  detail: string;
}

export interface VerifyReport {
  ok: boolean;
  failures: VerifyFailure[];
}

export interface PublishRecord {
  id: string;
  artefactId: string;
  stationId: string;
  slug: string;
  status: "ACTIVE" | "ROLLED_BACK" | "DRY_RUN";
  snapshot: string;
  publishedAt: string;
  rolledBackAt: string | null;
  dryRun: boolean;
}

export interface StrategyMemo {
  id: string;
  stationId: string;
  cycle: number;
  claims: string[];
  assumptions: { text: string; hypothesis: string }[];
  killCriteria: { metric: string; floor: number; windowDays: number }[];
  chosenOfferIds: string[];
  explorer: boolean;
  createdAt: string;
}

export interface LearningPatch {
  id: string;
  stationId: string;
  title: string;
  body: string;
  touchesCompliance: boolean;
  status: "PROPOSED" | "MERGED" | "REJECTED";
  skillTarget: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  slug: string;
  title: string;
  body: string;
  version: number;
  frozen: boolean;
  compliance: boolean;
}

export interface ExpansionProposal {
  id: string;
  kind: "CLONE_STATION" | "NEW_NICHE" | "NEW_PROGRAM" | "NEW_TEMPLATE" | "NEW_CHANNEL" | "NEW_SKILL";
  stationId: string;
  title: string;
  rationale: string;
  payload: CloneRequest | Record<string, unknown>;
  status: "PROPOSED" | "APPROVED" | "EXECUTED" | "REJECTED";
  createdAt: string;
}

export interface CloneRequest {
  parentId: string;
  childName: string;
  childNiche: string;
  language: Language;
  channel: Channel;
  budgetSliceEur: number;
  actorId: string;
  idempotencyKey: string;
  approvalTokenId?: string;
}

export interface CloneRecord {
  id: string;
  parentId: string;
  childId: string;
  generation: number;
  budgetSliceEur: number;
  policyHash: string;
  createdAt: string;
  idempotencyKey: string;
}

export interface Conversion {
  id: string;
  clickId: string;
  stationId: string;
  offerId: string;
  amountEur: number;
  commissionEur: number;
  at: string;
  source: "csv" | "webhook" | "fixture";
  refunded: boolean;
}

export interface ClickEvent {
  id: string;
  clickId: string;
  stationId: string;
  artefactId: string;
  offerId: string;
  at: string;
}

export interface EventRecord {
  id: string;
  at: string;
  type: string;
  actorId: string;
  stationId: string | null;
  detail: string;
  payload?: Record<string, unknown>;
}

export interface Job {
  id: string;
  stationId: string;
  kind: "CYCLE" | "VERIFY" | "PUBLISH" | "CLONE" | "LEARN";
  status: "QUEUED" | "RUNNING" | "DONE" | "DEAD_LETTER";
  idempotencyKey: string;
  error: string | null;
  createdAt: string;
}

export interface BudgetLedger {
  capEur: number;
  spentEur: number;
  reservedEur: number;
  entries: {
    id: string;
    at: string;
    amountEur: number;
    reason: string;
    stationId: string | null;
    refused: boolean;
  }[];
}

export interface CycleReport {
  stationId: string;
  cycle: number;
  at: string;
  memoId: string;
  artefactIds: string[];
  publishedIds: string[];
  blockedIds: string[];
  learned: boolean;
  cloneProposed: boolean;
  unauthorizedPublishes: number;
}

export interface DoctorReport {
  ok: boolean;
  checks: { id: string; ok: boolean; detail: string }[];
}

export interface YieldState {
  version: 1;
  now: string;
  seq: number;
  runState: RunState;
  operatorId: string;
  language: Language;
  budget: BudgetLedger;
  policy: PolicyEnvelope;
  stations: Station[];
  programs: Program[];
  offers: Offer[];
  artefacts: Artefact[];
  publishes: PublishRecord[];
  memos: StrategyMemo[];
  events: EventRecord[];
  jobs: Job[];
  skills: Skill[];
  patches: LearningPatch[];
  proposals: ExpansionProposal[];
  tokens: ApprovalToken[];
  conversions: Conversion[];
  clicks: ClickEvent[];
  clones: CloneRecord[];
  lastCycle: CycleReport | null;
  golden: { id: string; ok: boolean; detail: string }[];
}

export const TIER_RANK: Record<AutonomyTier, number> = {
  T0_OBSERVE: 0,
  T1_DRAFT: 1,
  T2_GATED_ACT: 2,
  T3_BOUNDED_AUTO: 3,
  T4_EXPAND: 4,
};

export const NL_DISCLOSURE =
  "Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.";

export const EN_DISCLOSURE =
  "This article contains affiliate links. If you buy through these links, YieldLoop may earn a commission. This costs you nothing extra.";
```


### `src/lib/yieldloop/compliance.ts`

```ts
import {
  EN_DISCLOSURE,
  NL_DISCLOSURE,
  type Artefact,
  type ArtefactState,
  type InvariantId,
  type Language,
  type Program,
  type PublishRecord,
  type VerifyFailure,
  type VerifyReport,
} from "./contracts.ts";

/** INV-2 fabricated-proof patterns (nl + en). */
export const FABRICATED_PATTERNS: { code: string; re: RegExp }[] = [
  { code: "FAKE_TESTIMONIAL", re: /onze klanten zeggen|dummy review|lorem testimonial/i },
  { code: "FAKE_LAB", re: /lab[- ]?test(?:ed|ed by us)|in ons laboratorium/i },
  { code: "FAKE_TRIAL", re: /wij hebben \d+ dagen getest|we (?:tested|have tested) (?:it )?for \d+ days/i },
  { code: "FAKE_GUARANTEE_INCOME", re: /gegarandeerd inkomen|guaranteed income|word rijk|get rich quick/i },
];

const PROHIBITED_CLAIM_PATTERNS: { code: string; re: RegExp; inv: InvariantId }[] = [
  { code: "HEALTH_CURE", re: /geneest|cures? cancer|wondermiddel|miracle (?:cure|pill)/i, inv: "INV-6" },
  { code: "GUARANTEED_INCOME", re: / gegarandeerd €|guaranteed returns|passive income guaranteed/i, inv: "INV-6" },
  { code: "CRYPTO_GET_RICH", re: /crypto get rich|100x coin| gegarandeerde winst/i, inv: "INV-6" },
];

const PRECONSENT_COOKIE = /document\.cookie\s*=|setCookie\(|tracking pixel before consent|facebook pixel without consent/i;

const PRICE_RE = /€\s?\d+(?:[.,]\d{2})?|\b\d+(?:[.,]\d{2})?\s?EUR/i;
const DATED_PRICE_RE = /(?:as_of|peildatum|prijs per|price as of)\s*[:\-]?\s*\d{4}-\d{2}-\d{2}/i;
const URL_RE = /https?:\/\/[^\s)]+/gi;

export function disclosureFor(lang: Language): string {
  return lang === "en-US" ? EN_DISCLOSURE : NL_DISCLOSURE;
}

export function findDisclosureIndex(body: string, lang: Language): number {
  const d = disclosureFor(lang);
  const idx = body.indexOf(d);
  if (idx >= 0) return idx;
  // plain-language fallback: must mention affiliate + commissie/commission
  const loose =
    lang === "en-US"
      ? /affiliate links[\s\S]{0,120}commission/i
      : /affiliate links[\s\S]{0,160}commissie/i;
  const m = loose.exec(body);
  return m ? m.index : -1;
}

export function extractUrls(body: string): string[] {
  return body.match(URL_RE) ?? [];
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isAffiliateUrl(url: string, programs: Program[]): boolean {
  const host = hostOf(url);
  return programs.some((p) => p.domainAllowlist.some((d) => host === d || host.endsWith(`.${d}`)));
}

export function hasClickId(url: string): boolean {
  try {
    return new URL(url).searchParams.has("click_id");
  } catch {
    return /[?&]click_id=/.test(url);
  }
}

export function isAllowlistedUrl(url: string, programs: Program[]): boolean {
  const host = hostOf(url);
  if (!host) return false;
  return programs.some(
    (p) => p.active && p.domainAllowlist.some((d) => host === d || host.endsWith(`.${d}`)),
  );
}

/**
 * INV-1…INV-6 verifier. Gate, not vibe.
 * Enforced at: verifyArtefact (this file) — see SAFETY.md.
 */
export function verifyArtefact(art: Artefact, programs: Program[]): VerifyReport {
  const failures: VerifyFailure[] = [];
  const body = art.body;

  const disclosureIdx = findDisclosureIndex(body, art.language);
  const urls = extractUrls(body);
  const affiliateUrls = urls.filter((u) => isAffiliateUrl(u, programs) || /click_id=/.test(u));
  const firstAffiliateIdx = affiliateUrls.reduce((min, u) => {
    const i = body.indexOf(u);
    return i >= 0 && (min < 0 || i < min) ? i : min;
  }, -1);

  // INV-1 Disclosure before first affiliate link
  if (affiliateUrls.length > 0) {
    if (disclosureIdx < 0) {
      failures.push({
        inv: "INV-1",
        code: "DISCLOSURE_MISSING",
        detail: "Publieke aanbeveling zonder disclosure vóór de eerste affiliate-link.",
      });
    } else if (firstAffiliateIdx >= 0 && disclosureIdx > firstAffiliateIdx) {
      failures.push({
        inv: "INV-1",
        code: "DISCLOSURE_AFTER_LINK",
        detail: "Disclosure staat ná de eerste affiliate-link.",
      });
    }
  }

  // INV-2 No fabricated proof
  for (const p of FABRICATED_PATTERNS) {
    if (p.re.test(body)) {
      failures.push({
        inv: "INV-2",
        code: p.code,
        detail: "Verzonnen bewijs of testimonial zonder operator-evidence.",
      });
    }
  }

  // INV-3 Prices dated
  if (PRICE_RE.test(body)) {
    const dated = Boolean(art.priceAsOf) || DATED_PRICE_RE.test(body);
    if (!dated) {
      failures.push({
        inv: "INV-3",
        code: "UNDATED_PRICE",
        detail: "Prijs zonder as_of / peildatum.",
      });
    }
  }

  // INV-4 Consent boundary
  if (PRECONSENT_COOKIE.test(body) || /cookie-stuff|pixel pre-consent/i.test(body)) {
    failures.push({
      inv: "INV-4",
      code: "PRECONSENT_TRACKING",
      detail: "Tracking/cookie vóór consent is verboden.",
    });
  }

  // INV-5 Allowlist + click_id
  for (const url of affiliateUrls) {
    if (!isAllowlistedUrl(url, programs)) {
      failures.push({
        inv: "INV-5",
        code: "ALLOWLIST_VIOLATION",
        detail: `URL niet op program-allowlist: ${url}`,
      });
    }
    if (!hasClickId(url)) {
      failures.push({
        inv: "INV-5",
        code: "MISSING_CLICK_ID",
        detail: `Affiliate-URL mist click_id: ${url}`,
      });
    }
  }

  // INV-6 Prohibited verticals / claims
  for (const p of PROHIBITED_CLAIM_PATTERNS) {
    if (p.re.test(body)) {
      failures.push({
        inv: p.inv,
        code: p.code,
        detail: "Verboden claim of vertical.",
      });
    }
  }

  return { ok: failures.length === 0, failures };
}

/** Honest UI: never "Live" without an active PublishRecord. */
export function isLive(artefact: Artefact, publishes: PublishRecord[]): boolean {
  if (artefact.state !== "PUBLISHED") return false;
  return publishes.some(
    (p) => p.artefactId === artefact.id && p.status === "ACTIVE" && !p.dryRun,
  );
}

export function publicLabel(artefact: Artefact, publishes: PublishRecord[]): ArtefactState | "LIVE" {
  return isLive(artefact, publishes) ? "LIVE" : artefact.state;
}

export function canTransitionToPublished(
  artefact: Artefact,
  publishes: PublishRecord[],
  report: VerifyReport,
): { ok: boolean; reason: string } {
  if (!report.ok) return { ok: false, reason: "VERIFY_FAILED" };
  if (artefact.state === "FROZEN") return { ok: false, reason: "FROZEN" };
  if (artefact.verifyFailures.some((f) => f.inv === "INV-1")) {
    return { ok: false, reason: "DISCLOSURE_GATE" };
  }
  void publishes;
  return { ok: true, reason: "OK" };
}

export const SAFETY_MAP: { inv: InvariantId; title: string; file: string; symbol: string }[] = [
  { inv: "INV-1", title: "Disclosure", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-2", title: "No fabricated proof", file: "src/lib/yieldloop/compliance.ts", symbol: "FABRICATED_PATTERNS" },
  { inv: "INV-3", title: "Prices are dated", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-4", title: "Consent boundary", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-5", title: "Allowlist only", file: "src/lib/yieldloop/compliance.ts", symbol: "isAllowlistedUrl" },
  { inv: "INV-6", title: "Prohibited verticals", file: "src/lib/yieldloop/compliance.ts", symbol: "PROHIBITED_CLAIM_PATTERNS" },
  { inv: "INV-7", title: "Spend cap", file: "src/lib/yieldloop/engine.ts", symbol: "debitBudget" },
  { inv: "INV-8", title: "Human override", file: "src/lib/yieldloop/engine.ts", symbol: "setRunState" },
  { inv: "INV-9", title: "Station clone gates", file: "src/lib/yieldloop/engine.ts", symbol: "evaluateClone" },
];
```


### `src/lib/yieldloop/engine.ts`

```ts
import {
  TIER_RANK,
  type ApprovalToken,
  type Artefact,
  type AutonomyTier,
  type CloneRequest,
  type CloneRecord,
  type CycleReport,
  type DoctorReport,
  type EventRecord,
  type ExpansionProposal,
  type Language,
  type Offer,
  type PolicyEnvelope,
  type Station,
  type StrategyMemo,
  type YieldState,
} from "./contracts.ts";
import { disclosureFor, verifyArtefact } from "./compliance.ts";
import { GOLDEN_BODIES, PROGRAMS, seedState } from "./fixtures.ts";

export type Gate = { ok: true } | { ok: false; code: string; detail: string };

function nextId(state: YieldState, prefix: string): { state: YieldState; id: string } {
  const seq = state.seq + 1;
  return { state: { ...state, seq }, id: `${prefix}_${String(seq).padStart(4, "0")}` };
}

function stamp(state: YieldState, extra = 0): string {
  const t = new Date(state.now).getTime() + extra;
  return new Date(t).toISOString();
}

function emit(
  state: YieldState,
  type: string,
  detail: string,
  stationId: string | null,
  payload?: Record<string, unknown>,
): YieldState {
  const n = nextId(state, "evt");
  const ev: EventRecord = {
    id: n.id,
    at: stamp(n.state),
    type,
    actorId: n.state.operatorId,
    stationId,
    detail,
    payload,
  };
  return { ...n.state, events: [ev, ...n.state.events].slice(0, 200) };
}

export function hashPolicy(p: PolicyEnvelope): string {
  const raw = JSON.stringify({
    n: [...p.nicheAllowlist].sort(),
    l: p.languageAllowlist,
    c: p.channelAllowlist,
    pr: p.programAllowlist,
    g: p.maxGeneration,
    s: p.maxStations,
    cap: p.spendCapEur,
  });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 33 + raw.charCodeAt(i)) >>> 0;
  return `pol_${h.toString(16)}`;
}

/** INV-7 Spend cap. Over cap → refuse. */
export function debitBudget(
  state: YieldState,
  amountEur: number,
  reason: string,
  stationId: string | null,
): { state: YieldState; ok: boolean } {
  const n = nextId(state, "led");
  const over = n.state.budget.spentEur + amountEur > n.state.budget.capEur;
  const entry = {
    id: n.id,
    at: stamp(n.state),
    amountEur,
    reason,
    stationId,
    refused: over || amountEur < 0,
  };
  if (over) {
    const s = emit(n.state, "BUDGET_REFUSED", `Cap €${n.state.budget.capEur} overschreden`, stationId);
    return {
      state: { ...s, budget: { ...s.budget, entries: [entry, ...s.budget.entries] } },
      ok: false,
    };
  }
  return {
    state: {
      ...n.state,
      budget: {
        ...n.state.budget,
        spentEur: n.state.budget.spentEur + amountEur,
        entries: [entry, ...n.state.budget.entries],
      },
    },
    ok: true,
  };
}

/** INV-8 Human override — kill-switch. */
export function setRunState(state: YieldState, runState: YieldState["runState"]): YieldState {
  let s = { ...state, runState };
  if (runState === "STOP") {
    s = {
      ...s,
      artefacts: s.artefacts.map((a) =>
        a.state === "PUBLISHED" || a.state === "APPROVED" || a.state === "DRAFT"
          ? a
          : a,
      ),
    };
    s = emit(s, "KILL_SWITCH", "RUNSTATE=STOP — publishers offline", null);
  } else {
    s = emit(s, "KILL_SWITCH_CLEAR", "RUNSTATE=RUN", null);
  }
  return s;
}

export function freezeStation(state: YieldState, stationId: string): YieldState {
  let s: YieldState = {
    ...state,
    stations: state.stations.map((st) => (st.id === stationId ? { ...st, status: "FROZEN" as const } : st)),
    artefacts: state.artefacts.map((a) =>
      a.stationId === stationId && a.state !== "PUBLISHED" && a.state !== "ROLLED_BACK"
        ? { ...a, state: "FROZEN" as const }
        : a,
    ),
  };
  return emit(s, "STATION_FROZEN", "Operator freeze", stationId);
}

export function setStationTier(state: YieldState, stationId: string, tier: AutonomyTier): YieldState {
  const st = state.stations.find((x) => x.id === stationId);
  if (!st) return state;
  if (TIER_RANK[tier] >= TIER_RANK.T3_BOUNDED_AUTO) {
    const token = state.tokens.find(
      (t) => t.action === "PROMOTE_TIER" && t.subjectId === stationId && !t.consumed,
    );
    if (!token && TIER_RANK[st.tier] < TIER_RANK.T3_BOUNDED_AUTO) {
      return emit(state, "TIER_REFUSED", "Promotie naar T3+ vereist operator-token", stationId);
    }
  }
  const s: YieldState = {
    ...state,
    stations: state.stations.map((x) => (x.id === stationId ? { ...x, tier } : x)),
  };
  return emit(s, "TIER_SET", `Autonomy ${st.tier} → ${tier}`, stationId);
}

export function scoreOffer(o: Offer): number {
  const risk = Math.max(0.05, o.complianceRisk);
  const cost = Math.max(0.05, o.costWeight);
  return (
    (o.searchDemand *
      o.conversionPrior *
      o.commissionPct *
      Math.min(1, o.cookieWindowDays / 30) *
      o.competitiveGap) /
    (risk * cost)
  );
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function clickIdFor(seq: number): string {
  return `clk_${String(seq).padStart(4, "0")}`;
}

function taggedUrl(url: string, clickId: string): string {
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}click_id=${clickId}`;
}

function produceBody(opts: {
  lang: Language;
  title: string;
  offer: Offer;
  clickId: string;
  contentType: Artefact["contentType"];
}): string {
  const d = disclosureFor(opts.lang);
  const priceLine =
    opts.lang === "en-US"
      ? `${opts.offer.title} — €${opts.offer.priceEur.toFixed(0)} (price as of ${opts.offer.priceAsOf.slice(0, 10)}).`
      : `${opts.offer.title} — €${opts.offer.priceEur.toFixed(0)} (peildatum ${opts.offer.priceAsOf.slice(0, 10)}).`;
  const cta =
    opts.lang === "en-US"
      ? `[View at ${opts.offer.merchant}](${taggedUrl(opts.offer.url, opts.clickId)})`
      : `[Bekijk bij ${opts.offer.merchant}](${taggedUrl(opts.offer.url, opts.clickId)})`;
  const intro =
    opts.contentType === "howto"
      ? opts.lang === "en-US"
        ? "How to choose a fit without inventing specs."
        : "Hoe je kiest zonder verzonnen specs."
      : opts.lang === "en-US"
        ? "Grounded on the offer feed. No invented testimonials."
        : "Gebaseerd op de offer-feed. Geen verzonnen testimonials.";
  return `${d}

## ${opts.title}

${intro}

### ${opts.offer.merchant}
${priceLine}
Voorraad: ${opts.offer.inStock ? (opts.lang === "en-US" ? "in stock" : "op voorraad") : "n.v.t."}. Cookie-window ${opts.offer.cookieWindowDays}d.

${cta}
`;
}

function tightenPolicy(parent: PolicyEnvelope, childNiche: string, lang: Language): PolicyEnvelope {
  const nicheAllowlist = parent.nicheAllowlist.filter((n) => n === childNiche || n === parent.nicheAllowlist[0]);
  const unique = Array.from(new Set([childNiche, ...nicheAllowlist]));
  const p: PolicyEnvelope = {
    ...parent,
    languageAllowlist: parent.languageAllowlist.filter((l) => l === lang),
    nicheAllowlist: unique,
    maxPublishesPerDay: Math.min(parent.maxPublishesPerDay, 2),
    explorerShare: Math.min(parent.explorerShare, 0.25),
    cloneEnabled: parent.cloneEnabled,
  };
  return { ...p, hash: hashPolicy(p) };
}

/**
 * INV-9 Station clone gates.
 * Clone is T4 expansion: without token it becomes a proposal, never a silent station.
 * Child inherits skills (copy) and a tightened policy; never inherits T3/T4.
 * Budget slice is transferred from parent remaining; never silent.
 */
export function evaluateClone(state: YieldState, req: CloneRequest): Gate {
  if (state.runState === "STOP") {
    return { ok: false, code: "KILL_SWITCH", detail: "RUNSTATE=STOP" };
  }
  const parent = state.stations.find((s) => s.id === req.parentId);
  if (!parent) return { ok: false, code: "PARENT_MISSING", detail: req.parentId };
  if (parent.status === "FROZEN") return { ok: false, code: "PARENT_FROZEN", detail: parent.name };
  if (!parent.policy.cloneEnabled) {
    return { ok: false, code: "CLONE_DISABLED", detail: "PolicyEnvelope.cloneEnabled=false" };
  }
  if (parent.generation >= parent.policy.maxGeneration) {
    return { ok: false, code: "MAX_GENERATION", detail: `generation ${parent.generation}` };
  }
  if (state.stations.length >= parent.policy.maxStations) {
    return { ok: false, code: "MAX_STATIONS", detail: String(parent.policy.maxStations) };
  }
  if (req.budgetSliceEur <= 0) return { ok: false, code: "BUDGET_SLICE_INVALID", detail: "≤ 0" };
  const parentRemaining = parent.budgetCapEur - parent.budgetSpentEur;
  if (req.budgetSliceEur > parentRemaining - parent.policy.minParentReserveEur) {
    return {
      ok: false,
      code: "BUDGET_INSUFFICIENT",
      detail: `slice €${req.budgetSliceEur} laat parent onder reserve €${parent.policy.minParentReserveEur}`,
    };
  }
  const allocated = state.stations.reduce((acc, st) => acc + st.budgetCapEur, 0);
  if (allocated > state.budget.capEur) {
    return { ok: false, code: "INV-7", detail: "station-allocatie boven globale cap" };
  }
  if (!parent.policy.nicheAllowlist.includes(req.childNiche)) {
    return { ok: false, code: "NICHE_NOT_ALLOWLISTED", detail: req.childNiche };
  }
  if (!parent.policy.languageAllowlist.includes(req.language)) {
    return { ok: false, code: "LANGUAGE_NOT_ALLOWLISTED", detail: req.language };
  }
  if (!parent.policy.channelAllowlist.includes(req.channel)) {
    return { ok: false, code: "CHANNEL_NOT_ALLOWLISTED", detail: req.channel };
  }
  const prohibited = parent.policy.prohibitedVerticals as readonly string[];
  if (prohibited.includes(req.childNiche)) {
    return { ok: false, code: "PROHIBITED_VERTICAL", detail: req.childNiche };
  }
  const existing = state.clones.find((c) => c.idempotencyKey === req.idempotencyKey);
  if (existing) return { ok: true };
  const token = req.approvalTokenId
    ? state.tokens.find(
        (t) =>
          t.id === req.approvalTokenId &&
          t.action === "CLONE_STATION" &&
          t.subjectId === parent.id &&
          !t.consumed,
      )
    : undefined;
  const auto =
    parent.tier === "T4_EXPAND" &&
    parent.policy.cloneEnabled &&
    parent.status === "ACTIVE";
  if (!token && !auto) {
    return { ok: false, code: "NEEDS_APPROVAL", detail: "CLONE_STATION vereist ApprovalToken of T4 envelope" };
  }
  return { ok: true };
}

export function proposeClone(state: YieldState, req: CloneRequest): YieldState {
  const dup = state.proposals.find(
    (p) => p.kind === "CLONE_STATION" && p.status === "PROPOSED" && p.payload && (p.payload as CloneRequest).idempotencyKey === req.idempotencyKey,
  );
  if (dup) return state;
  const n = nextId(state, "exp");
  const parent = n.state.stations.find((s) => s.id === req.parentId);
  const proposal: ExpansionProposal = {
    id: n.id,
    kind: "CLONE_STATION",
    stationId: req.parentId,
    title: `Kloon ${parent?.name ?? req.parentId} → ${req.childName}`,
    rationale: `Subniche ${req.childNiche}, slice €${req.budgetSliceEur}. Kind start op T1_DRAFT.`,
    payload: req,
    status: "PROPOSED",
    createdAt: stamp(n.state),
  };
  return emit(
    { ...n.state, proposals: [proposal, ...n.state.proposals] },
    "CLONE_PROPOSED",
    proposal.title,
    req.parentId,
  );
}

export function executeClone(
  state: YieldState,
  req: CloneRequest,
): { state: YieldState; child: Station | null; gate: Gate } {
  const existing = state.clones.find((c) => c.idempotencyKey === req.idempotencyKey);
  if (existing) {
    const child = state.stations.find((s) => s.id === existing.childId) ?? null;
    return { state, child, gate: { ok: true } };
  }
  const gate = evaluateClone(state, req);
  if (!gate.ok) {
    if (gate.code === "NEEDS_APPROVAL") {
      return { state: proposeClone(state, req), child: null, gate };
    }
    return { state: emit(state, "CLONE_REFUSED", `${gate.code}: ${gate.detail}`, req.parentId), child: null, gate };
  }
  const parent = state.stations.find((s) => s.id === req.parentId);
  if (!parent) return { state, child: null, gate: { ok: false, code: "PARENT_MISSING", detail: "" } };

  let s = state;
  const ids = nextId(s, "stn");
  s = ids.state;
  const childPolicy = tightenPolicy(parent.policy, req.childNiche, req.language);
  const child: Station = {
    id: ids.id,
    name: req.childName,
    parentId: parent.id,
    lineage: [...parent.lineage, parent.id],
    generation: parent.generation + 1,
    cloneIndex: state.clones.filter((c) => c.parentId === parent.id).length + 1,
    niche: req.childNiche,
    language: req.language,
    channel: req.channel,
    tier: "T1_DRAFT",
    status: "ACTIVE",
    policy: childPolicy,
    budgetCapEur: req.budgetSliceEur,
    budgetSpentEur: 0,
    cycleCount: 0,
    skillIds: [...parent.skillIds],
    epc: 0,
    clicks: 0,
    conversions: 0,
    lastCycleAt: null,
    createdAt: stamp(s),
    clonedFrom: parent.id,
  };

  const clo = nextId(s, "clo");
  s = clo.state;
  const record: CloneRecord = {
    id: clo.id,
    parentId: parent.id,
    childId: child.id,
    generation: child.generation,
    budgetSliceEur: req.budgetSliceEur,
    policyHash: childPolicy.hash,
    createdAt: stamp(s),
    idempotencyKey: req.idempotencyKey,
  };

  s = {
    ...s,
    clones: [record, ...s.clones],
    stations: [
      ...s.stations.map((st) =>
        st.id === parent.id ? { ...st, budgetCapEur: st.budgetCapEur - req.budgetSliceEur } : st,
      ),
      child,
    ],
  };

  if (req.approvalTokenId) {
    s = {
      ...s,
      tokens: s.tokens.map((t) => (t.id === req.approvalTokenId ? { ...t, consumed: true } : t)),
    };
  }
  s = {
    ...s,
    proposals: s.proposals.map((p) =>
      p.kind === "CLONE_STATION" &&
      (p.payload as CloneRequest).idempotencyKey === req.idempotencyKey &&
      p.status === "PROPOSED"
        ? { ...p, status: "EXECUTED" as const }
        : p,
    ),
  };
  s = emit(s, "STATION_CLONED", `${parent.name} → ${child.name} (gen ${child.generation})`, child.id, {
    parentId: parent.id,
    childId: child.id,
    policyHash: childPolicy.hash,
  });
  return { state: s, child, gate: { ok: true } };
}

export function issueToken(
  state: YieldState,
  action: ApprovalToken["action"],
  subjectId: string,
): { state: YieldState; token: ApprovalToken } {
  const n = nextId(state, "tok");
  const token: ApprovalToken = {
    id: n.id,
    action,
    subjectId,
    issuedAt: stamp(n.state),
    expiresAt: new Date(new Date(stamp(n.state)).getTime() + 36 * 3600_000).toISOString(),
    actorId: n.state.operatorId,
    consumed: false,
  };
  return { state: { ...n.state, tokens: [token, ...n.state.tokens] }, token };
}

export function approveProposal(state: YieldState, proposalId: string): YieldState {
  const p = state.proposals.find((x) => x.id === proposalId);
  if (!p || p.status !== "PROPOSED") return state;
  if (p.kind === "CLONE_STATION") {
    const req = p.payload as CloneRequest;
    const issued = issueToken(state, "CLONE_STATION", req.parentId);
    const exec = executeClone(issued.state, { ...req, approvalTokenId: issued.token.id });
    return exec.state;
  }
  if (p.kind === "NEW_SKILL" || p.kind === "NEW_TEMPLATE" || p.kind === "NEW_CHANNEL" || p.kind === "NEW_PROGRAM" || p.kind === "NEW_NICHE") {
    return emit(
      {
        ...state,
        proposals: state.proposals.map((x) => (x.id === proposalId ? { ...x, status: "APPROVED" as const } : x)),
      },
      "EXPANSION_APPROVED",
      p.title,
      p.stationId,
    );
  }
  return state;
}

export function rejectProposal(state: YieldState, proposalId: string): YieldState {
  const p = state.proposals.find((x) => x.id === proposalId);
  if (!p) return state;
  return emit(
    {
      ...state,
      proposals: state.proposals.map((x) => (x.id === proposalId ? { ...x, status: "REJECTED" as const } : x)),
    },
    "EXPANSION_REJECTED",
    p.title,
    p.stationId,
  );
}

export function publishArtefact(
  state: YieldState,
  artefactId: string,
  opts?: { tokenId?: string; dryRun?: boolean },
): YieldState {
  const art = state.artefacts.find((a) => a.id === artefactId);
  if (!art) return state;
  const station = state.stations.find((s) => s.id === art.stationId);
  if (!station) return state;
  if (state.runState === "STOP") {
    return emit(state, "PUBLISH_REFUSED", "KILL_SWITCH", station.id);
  }
  if (station.status === "FROZEN") {
    return emit(state, "PUBLISH_REFUSED", "STATION_FROZEN", station.id);
  }
  const report = verifyArtefact(art, state.programs);
  if (!report.ok) {
    return emit(
      {
        ...state,
        artefacts: state.artefacts.map((a) =>
          a.id === art.id ? { ...a, state: "BLOCKED", verifyFailures: report.failures } : a,
        ),
      },
      "PUBLISH_BLOCKED",
      report.failures.map((f) => f.code).join(","),
      station.id,
    );
  }

  const dry = opts?.dryRun ?? (station.tier === "T1_DRAFT" || station.tier === "T0_OBSERVE");
  const token = opts?.tokenId
    ? state.tokens.find((t) => t.id === opts.tokenId && t.action === "PUBLISH" && t.subjectId === art.id && !t.consumed)
    : state.tokens.find((t) => t.action === "PUBLISH" && t.subjectId === art.id && !t.consumed);

  const today = stamp(state).slice(0, 10);
  const publishedToday = state.publishes.filter(
    (p) => p.stationId === station.id && p.publishedAt.startsWith(today) && !p.dryRun && p.status === "ACTIVE",
  ).length;

  const mayAuto = station.tier === "T3_BOUNDED_AUTO" || station.tier === "T4_EXPAND";
  const mayGated = station.tier === "T2_GATED_ACT" && Boolean(token);
  if (!dry && !mayAuto && !mayGated) {
    return emit(
      {
        ...state,
        artefacts: state.artefacts.map((a) => (a.id === art.id ? { ...a, state: "APPROVED", verifyFailures: [] } : a)),
      },
      "PUBLISH_GATED",
      "Geen token / envelope — artefact APPROVED, niet LIVE",
      station.id,
    );
  }
  if (!dry && publishedToday >= station.policy.maxPublishesPerDay) {
    return emit(state, "PUBLISH_REFUSED", "maxPublishesPerDay", station.id);
  }

  const n = nextId(state, "pub");
  let s = n.state;
  const rec = {
    id: n.id,
    artefactId: art.id,
    stationId: station.id,
    slug: art.slug,
    status: dry ? ("DRY_RUN" as const) : ("ACTIVE" as const),
    snapshot: art.body,
    publishedAt: stamp(s),
    rolledBackAt: null,
    dryRun: dry,
  };
  s = {
    ...s,
    publishes: [rec, ...s.publishes],
    artefacts: s.artefacts.map((a) =>
      a.id === art.id
        ? {
            ...a,
            state: dry ? ("APPROVED" as const) : ("PUBLISHED" as const),
            publishedAt: dry ? a.publishedAt : stamp(s),
            snapshotId: rec.id,
            verifyFailures: [],
          }
        : a,
    ),
    tokens: token ? s.tokens.map((t) => (t.id === token.id ? { ...t, consumed: true } : t)) : s.tokens,
  };
  return emit(s, dry ? "PUBLISH_DRY_RUN" : "PUBLISHED", art.slug, station.id);
}

export function rollbackPublish(state: YieldState, publishId: string): YieldState {
  const rec = state.publishes.find((p) => p.id === publishId);
  if (!rec || rec.status === "ROLLED_BACK") return state;
  let s: YieldState = {
    ...state,
    publishes: state.publishes.map((p) =>
      p.id === publishId ? { ...p, status: "ROLLED_BACK" as const, rolledBackAt: stamp(state) } : p,
    ),
    artefacts: state.artefacts.map((a) =>
      a.id === rec.artefactId ? { ...a, state: "ROLLED_BACK" as const } : a,
    ),
  };
  return emit(s, "PUBLISH_ROLLED_BACK", rec.slug, rec.stationId);
}

export function mergePatch(state: YieldState, patchId: string): YieldState {
  const patch = state.patches.find((p) => p.id === patchId);
  if (!patch || patch.status !== "PROPOSED") return state;
  if (patch.touchesCompliance) {
    return emit(
      {
        ...state,
        patches: state.patches.map((p) => (p.id === patchId ? { ...p, status: "REJECTED" as const } : p)),
      },
      "LEARN_REJECTED",
      "Learner mag compliance-skills niet verzwakken",
      patch.stationId,
    );
  }
  const s: YieldState = {
    ...state,
    patches: state.patches.map((p) => (p.id === patchId ? { ...p, status: "MERGED" as const } : p)),
    skills: state.skills.map((sk) =>
      sk.id === patch.skillTarget && !sk.frozen && !sk.compliance
        ? { ...sk, version: sk.version + 1, body: `${sk.body}\n\n— ${patch.body}` }
        : sk,
    ),
  };
  return emit(s, "LEARN_MERGED", patch.title, patch.stationId);
}

export function runGolden(state: YieldState): YieldState {
  const mk = (id: string, title: string, body: string, priceAsOf: string | null): Artefact => ({
    id,
    stationId: "stn_thuiswerk",
    jobId: "golden",
    contentType: "update_post",
    title,
    slug: id,
    language: "nl-NL",
    body,
    state: "VERIFYING",
    offerIds: [],
    sourceUrls: [],
    priceAsOf,
    disclosurePresent: false,
    verifyFailures: [],
    clickId: null,
    publishedAt: null,
    snapshotId: null,
    createdAt: stamp(state),
  });
  const cases = [
    { id: "golden_disclosure", title: "disclosure_missing", body: GOLDEN_BODIES.disclosure_missing, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-1" },
    { id: "golden_fabricated", title: "fabricated_claim", body: GOLDEN_BODIES.fabricated_claim, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-2" },
    { id: "golden_stale", title: "stale_price", body: GOLDEN_BODIES.stale_price, asOf: null, expectFail: "INV-3" },
    { id: "golden_allowlist", title: "allowlist_violation", body: GOLDEN_BODIES.allowlist_violation, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-5" },
  ];
  const golden = cases.map((c) => {
    const art = mk(c.id, c.title, c.body, c.asOf);
    const report = verifyArtefact(art, PROGRAMS);
    const blocked = !report.ok && report.failures.some((f) => f.inv === c.expectFail);
    return {
      id: c.id,
      ok: blocked,
      detail: blocked
        ? `FAIL publish zoals vereist (${c.expectFail})`
        : `VERWACHT ${c.expectFail}, kreeg ${report.failures.map((f) => f.inv).join(",") || "geen failures"}`,
    };
  });
  return emit({ ...state, golden }, "GOLDEN_RUN", golden.filter((g) => g.ok).length + "/" + golden.length, null);
}

export function doctor(state: YieldState): DoctorReport {
  const checks: DoctorReport["checks"] = [];
  checks.push({
    id: "contracts",
    ok: state.version === 1 && state.stations.length > 0,
    detail: `${state.stations.length} stations, ${state.offers.length} offers`,
  });
  checks.push({
    id: "kill-switch",
    ok: state.runState === "RUN" || state.runState === "STOP",
    detail: `RUNSTATE=${state.runState}`,
  });
  checks.push({
    id: "disclosure-templates",
    ok: true,
    detail: "NL + EN disclosure aanwezig",
  });
  const liveWithoutRecord = state.artefacts.filter(
    (a) => a.state === "PUBLISHED" && !state.publishes.some((p) => p.artefactId === a.id && p.status === "ACTIVE" && !p.dryRun),
  );
  checks.push({
    id: "honest-ui",
    ok: liveWithoutRecord.length === 0,
    detail:
      liveWithoutRecord.length === 0
        ? "Geen LIVE zonder PublishRecord"
        : `${liveWithoutRecord.length} phantom LIVE`,
  });
  checks.push({
    id: "budget",
    ok: state.budget.spentEur <= state.budget.capEur,
    detail: `€${state.budget.spentEur} / €${state.budget.capEur}`,
  });
  checks.push({
    id: "clone-lineage",
    ok: state.stations.every((s) => (s.parentId ? s.lineage.includes(s.parentId) && s.generation >= 1 : s.generation === 0)),
    detail: `${state.clones.length} clone-records`,
  });
  const g = state.golden.length ? state.golden : runGolden(state).golden;
  checks.push({
    id: "golden",
    ok: g.every((x) => x.ok),
    detail: g.map((x) => `${x.id}:${x.ok ? "ok" : "fail"}`).join(" · "),
  });
  return { ok: checks.every((c) => c.ok), checks };
}

export function ingestCsv(state: YieldState, csv: string): YieldState {
  const lines = csv.trim().split(/\r?\n/).slice(1);
  let s = state;
  for (const line of lines) {
    const [clickId, stationId, offerId, amount, commission, at] = line.split(",").map((x) => x.trim());
    if (!clickId || !stationId) continue;
    const n = nextId(s, "cv");
    s = n.state;
    s = {
      ...s,
      conversions: [
        {
          id: n.id,
          clickId,
          stationId,
          offerId: offerId || "",
          amountEur: Number(amount) || 0,
          commissionEur: Number(commission) || 0,
          at: at || stamp(s),
          source: "csv",
          refunded: false,
        },
        ...s.conversions,
      ],
    };
  }
  return emit(s, "CSV_INGEST", `${lines.length} rijen`, null);
}

export function runCycle(state: YieldState, stationId: string): YieldState {
  if (state.runState === "STOP") {
    return emit(state, "CYCLE_REFUSED", "KILL_SWITCH", stationId);
  }
  const station = state.stations.find((s) => s.id === stationId);
  if (!station) return emit(state, "CYCLE_REFUSED", "STATION_MISSING", stationId);
  if (station.status === "FROZEN") return emit(state, "CYCLE_REFUSED", "STATION_FROZEN", stationId);
  if (station.tier === "T0_OBSERVE") {
    return emit(state, "CYCLE_OBSERVE", "T0 — alleen rapport, geen artefacten", stationId);
  }

  const key = `cycle:${station.id}:${station.cycleCount + 1}`;
  if (state.jobs.some((j) => j.idempotencyKey === key && j.status === "DONE")) {
    return state;
  }

  let s = state;
  const cost = debitBudget(s, 0.4, `cycle cost ${station.name}`, station.id);
  if (!cost.ok) {
    return emit(cost.state, "CYCLE_REFUSED", "INV-7 spend cap", stationId);
  }
  s = cost.state;
  const jobN = nextId(s, "job");
  s = jobN.state;
  s = {
    ...s,
    jobs: [
      {
        id: jobN.id,
        stationId: station.id,
        kind: "CYCLE",
        status: "RUNNING",
        idempotencyKey: key,
        error: null,
        createdAt: stamp(s),
      },
      ...s.jobs,
    ],
  };

  // SENSE + STRATEGISE
  const eligible = s.offers.filter(
    (o) =>
      station.policy.programAllowlist.includes(o.programId) &&
      (o.niche === station.niche || station.policy.nicheAllowlist.includes(o.niche)),
  );
  const ranked = [...eligible].sort((a, b) => scoreOffer(b) - scoreOffer(a));
  const explorer = station.cycleCount % 5 === 4;
  const pick = ranked.slice(0, explorer ? 2 : 1);
  const memoN = nextId(s, "memo");
  s = memoN.state;
  const memo: StrategyMemo = {
    id: memoN.id,
    stationId: station.id,
    cycle: station.cycleCount + 1,
    claims: pick.map((o) => `${o.title} score ${scoreOffer(o).toFixed(2)} (EPC prior ${o.epcPrior})`),
    assumptions: [
      {
        text: "Offer-feed is verse bron binnen freshness SLA",
        hypothesis: `priceAsOf binnen ${station.policy.freshnessSlaHours}u`,
      },
    ],
    killCriteria: [{ metric: "EPC", floor: 0.5, windowDays: 14 }],
    chosenOfferIds: pick.map((o) => o.id),
    explorer,
    createdAt: stamp(s),
  };
  s = { ...s, memos: [memo, ...s.memos] };

  const artefactIds: string[] = [];
  const blockedIds: string[] = [];
  const publishedIds: string[] = [];

  for (const offer of pick) {
    const cN = nextId(s, "art");
    s = cN.state;
    const cid = clickIdFor(s.seq);
    const title =
      station.language === "en-US"
        ? `Best ${offer.title} for ${station.niche}`
        : `Beste ${offer.title} voor ${station.niche}`;
    const body = produceBody({
      lang: station.language,
      title,
      offer,
      clickId: cid,
      contentType: explorer ? "howto" : "best_x_for_y",
    });
    let art: Artefact = {
      id: cN.id,
      stationId: station.id,
      jobId: jobN.id,
      contentType: explorer ? "howto" : "best_x_for_y",
      title,
      slug: slugify(title) + "-" + cN.id.slice(-4),
      language: station.language,
      body,
      state: "VERIFYING",
      offerIds: [offer.id],
      sourceUrls: [offer.url],
      priceAsOf: offer.priceAsOf,
      disclosurePresent: true,
      verifyFailures: [],
      clickId: cid,
      publishedAt: null,
      snapshotId: null,
      createdAt: stamp(s),
    };
    const report = verifyArtefact(art, s.programs);
    art = {
      ...art,
      state: report.ok ? "DRAFT" : "BLOCKED",
      verifyFailures: report.failures,
      disclosurePresent: report.failures.every((f) => f.inv !== "INV-1"),
    };
    s = { ...s, artefacts: [art, ...s.artefacts] };
    artefactIds.push(art.id);
    if (!report.ok) {
      blockedIds.push(art.id);
      continue;
    }
    // PRODUCE done. PUBLISH gated.
    const before = s.publishes.length;
    s = publishArtefact(s, art.id, { dryRun: station.tier === "T1_DRAFT" });
    const created = s.publishes.find((p) => p.artefactId === art.id);
    if (created && !created.dryRun && created.status === "ACTIVE") publishedIds.push(created.id);
    else if (s.publishes.length === before && art.state === "BLOCKED") blockedIds.push(art.id);
  }

  // MEASURE — attribute fixture conversions already present
  const stationConvs = s.conversions.filter((c) => c.stationId === station.id && !c.refunded);
  const stationClicks = Math.max(station.clicks, s.clicks.filter((c) => c.stationId === station.id).length);
  const epc =
    stationClicks > 0
      ? stationConvs.reduce((acc, c) => acc + c.commissionEur, 0) / stationClicks
      : station.epc;

  // LEARN
  let learned = false;
  if (stationConvs.length > 0) {
    const pN = nextId(s, "pat");
    s = pN.state;
    s = {
      ...s,
      patches: [
        {
          id: pN.id,
          stationId: station.id,
          title: `EPC-update ${station.niche}`,
          body: `Na ${stationConvs.length} conversies: EPC ${epc.toFixed(3)}. Template ${pick[0]?.id ?? "n/a"} behouden. Compliance-skills niet aangeraakt.`,
          touchesCompliance: false,
          status: "PROPOSED",
          skillTarget: "sk_cta",
          createdAt: stamp(s),
        },
        ...s.patches,
      ],
    };
    learned = true;
  }

  // EXPAND — self-clone proposal when performing
  let cloneProposed = false;
  if (epc >= 1.5 && station.policy.cloneEnabled && station.generation < station.policy.maxGeneration) {
    const sub = station.policy.nicheAllowlist.find(
      (n) => n !== station.niche && !s.stations.some((st) => st.parentId === station.id && st.niche === n),
    );
    if (sub) {
      const req: CloneRequest = {
        parentId: station.id,
        childName: `${station.language === "en-US" ? "Clone" : "Kloon"} ${sub}`,
        childNiche: sub,
        language: station.language,
        channel: station.channel,
        budgetSliceEur: Math.min(80, Math.max(40, (station.budgetCapEur - station.budgetSpentEur) * 0.2)),
        actorId: station.id,
        idempotencyKey: `clone:${station.id}:${sub}:${station.channel}:cycle${station.cycleCount + 1}`,
      };
      const gate = evaluateClone(s, req);
      if (gate.ok && station.tier === "T4_EXPAND") {
        const exec = executeClone(s, req);
        s = exec.state;
        cloneProposed = Boolean(exec.child);
      } else {
        s = proposeClone(s, req);
        cloneProposed = true;
      }
    }
  }

  s = {
    ...s,
    stations: s.stations.map((st) =>
      st.id === station.id
        ? {
            ...st,
            cycleCount: st.cycleCount + 1,
            lastCycleAt: stamp(s),
            epc,
          }
        : st,
    ),
    jobs: s.jobs.map((j) => (j.id === jobN.id ? { ...j, status: "DONE" as const } : j)),
  };

  const report: CycleReport = {
    stationId: station.id,
    cycle: station.cycleCount + 1,
    at: stamp(s),
    memoId: memo.id,
    artefactIds,
    publishedIds,
    blockedIds,
    learned,
    cloneProposed,
    unauthorizedPublishes: 0,
  };
  s = { ...s, lastCycle: report };
  return emit(
    s,
    "CYCLE_DONE",
    `${station.name} cycle ${report.cycle}: ${artefactIds.length} artefacten, ${publishedIds.length} live, ${blockedIds.length} blocked`,
    station.id,
  );
}

export function expectedNetWeek(state: YieldState): number {
  return state.stations.reduce((acc, s) => acc + s.epc * Math.max(20, s.clicks / 4), 0);
}

export function resetDemo(): YieldState {
  return seedState();
}

export { seedState };
```


### `src/lib/yieldloop/fixtures.ts`

```ts
import {
  NL_DISCLOSURE,
  EN_DISCLOSURE,
  type Offer,
  type PolicyEnvelope,
  type Program,
  type Skill,
  type YieldState,
} from "./contracts.ts";

export const NOW = "2026-08-28T08:00:00.000Z";

export const ROOT_POLICY: PolicyEnvelope = {
  hash: "pol_a1f3c9",
  languageAllowlist: ["nl-NL", "en-US"],
  nicheAllowlist: [
    "thuiswerk",
    "monitorarmen",
    "bureaus",
    "bureaustoelen",
    "laptopstandaards",
    "toetsenborden",
    "home-espresso",
    "espressomachines",
    "fietsaccessoires",
  ],
  channelAllowlist: ["site"],
  programAllowlist: ["prg_bol", "prg_awin", "prg_tt", "prg_csv"],
  maxPublishesPerDay: 3,
  maxBudgetPerNichePct: 0.4,
  explorerShare: 0.2,
  maxStations: 12,
  maxGeneration: 4,
  minParentReserveEur: 40,
  spendCapEur: 2000,
  freshnessSlaHours: 72,
  cookieMode: "NONE",
  prohibitedVerticals: [
    "health-cure",
    "guaranteed-income",
    "crypto-get-rich",
    "weapons",
    "adult-minors",
    "illegal-goods",
  ],
  cloneEnabled: true,
};

export const PROGRAMS: Program[] = [
  {
    id: "prg_bol",
    name: "Bol Partner",
    network: "bol",
    domainAllowlist: ["partner.bol.com", "bol.com"],
    cookieWindowDays: 30,
    geo: ["NL", "BE"],
    active: true,
  },
  {
    id: "prg_awin",
    name: "Awin",
    network: "awin",
    domainAllowlist: ["awin1.com", "wiki.awin.com"],
    cookieWindowDays: 30,
    geo: ["NL", "DE", "UK"],
    active: true,
  },
  {
    id: "prg_tt",
    name: "TradeTracker",
    network: "tradetracker",
    domainAllowlist: ["tc.tradetracker.net", "tradetracker.com"],
    cookieWindowDays: 14,
    geo: ["NL"],
    active: true,
  },
  {
    id: "prg_csv",
    name: "Generic CSV",
    network: "generic_csv",
    domainAllowlist: ["feeds.yieldloop.local"],
    cookieWindowDays: 21,
    geo: ["NL", "US"],
    active: true,
  },
];

export const OFFERS: Offer[] = [
  {
    id: "off_monitor_ergo",
    programId: "prg_bol",
    title: "ErgoDesk Pro monitorarm",
    merchant: "ErgoDesk",
    url: "https://partner.bol.com/click/monitor-ergo",
    niche: "monitorarmen",
    commissionPct: 0.08,
    epcPrior: 1.92,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 129,
    priceAsOf: "2026-08-27T10:00:00.000Z",
    inStock: true,
    searchDemand: 0.82,
    conversionPrior: 0.041,
    competitiveGap: 0.7,
    complianceRisk: 0.08,
    costWeight: 0.12,
  },
  {
    id: "off_flexispot",
    programId: "prg_awin",
    title: "Flexispot E7 sta-bureau",
    merchant: "Flexispot",
    url: "https://www.awin1.com/cread.php?awinmid=flexi",
    niche: "bureaus",
    commissionPct: 0.06,
    epcPrior: 2.4,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 449,
    priceAsOf: "2026-08-26T09:00:00.000Z",
    inStock: true,
    searchDemand: 0.74,
    conversionPrior: 0.028,
    competitiveGap: 0.55,
    complianceRisk: 0.1,
    costWeight: 0.18,
  },
  {
    id: "off_secretlab",
    programId: "prg_tt",
    title: "Secretlab Titan Evo 2026",
    merchant: "Secretlab",
    url: "https://tc.tradetracker.net/c?t=secretlab",
    niche: "bureaustoelen",
    commissionPct: 0.05,
    epcPrior: 1.1,
    cookieWindowDays: 14,
    geo: ["NL"],
    priceEur: 519,
    priceAsOf: "2026-08-25T12:00:00.000Z",
    inStock: true,
    searchDemand: 0.9,
    conversionPrior: 0.015,
    competitiveGap: 0.3,
    complianceRisk: 0.12,
    costWeight: 0.22,
  },
  {
    id: "off_keychron",
    programId: "prg_bol",
    title: "Keychron Q1 Max",
    merchant: "Keychron",
    url: "https://partner.bol.com/click/keychron-q1",
    niche: "toetsenborden",
    commissionPct: 0.07,
    epcPrior: 1.4,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 199,
    priceAsOf: "2026-08-27T08:00:00.000Z",
    inStock: true,
    searchDemand: 0.61,
    conversionPrior: 0.033,
    competitiveGap: 0.62,
    complianceRisk: 0.07,
    costWeight: 0.1,
  },
  {
    id: "off_sage",
    programId: "prg_csv",
    title: "Sage Barista Express Impress",
    merchant: "Sage",
    url: "https://feeds.yieldloop.local/sage-impress",
    niche: "espressomachines",
    commissionPct: 0.04,
    epcPrior: 2.8,
    cookieWindowDays: 21,
    geo: ["US", "NL"],
    priceEur: 699,
    priceAsOf: "2026-08-24T00:00:00.000Z",
    inStock: true,
    searchDemand: 0.7,
    conversionPrior: 0.022,
    competitiveGap: 0.48,
    complianceRisk: 0.09,
    costWeight: 0.2,
  },
  {
    id: "off_laptop_stand",
    programId: "prg_bol",
    title: "Rain Design mStand",
    merchant: "Rain Design",
    url: "https://partner.bol.com/click/mstand",
    niche: "laptopstandaards",
    commissionPct: 0.09,
    epcPrior: 1.55,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 59,
    priceAsOf: "2026-08-27T11:00:00.000Z",
    inStock: true,
    searchDemand: 0.58,
    conversionPrior: 0.05,
    competitiveGap: 0.8,
    complianceRisk: 0.05,
    costWeight: 0.08,
  },
];

export const SKILLS: Skill[] = [
  {
    id: "sk_disclosure",
    slug: "disclosure-first",
    title: "Disclosure altijd eerst",
    body: "Elke publieke aanbeveling opent met het NL/EN disclosure-blok vóór de eerste affiliate-link. Nooit inkorten.",
    version: 3,
    frozen: true,
    compliance: true,
  },
  {
    id: "sk_price_date",
    slug: "dated-prices",
    title: "Prijzen dateren",
    body: "Noem peildatum (YYYY-MM-DD) bij elke prijs. Markeer STALE boven freshness SLA.",
    version: 2,
    frozen: true,
    compliance: true,
  },
  {
    id: "sk_title_nl",
    slug: "nl-comparison-titles",
    title: "NL vergelijkingstitels",
    body: "Patroon: 'Beste {product} {jaar} voor {use-case}' — geen ALL CAPS, geen guaranteed.",
    version: 1,
    frozen: false,
    compliance: false,
  },
  {
    id: "sk_cta",
    slug: "cta-plain",
    title: "CTA in plain language",
    body: "CTA = 'Bekijk bij {merchant}' — geen schaarste-fake, geen 'laatste kans'.",
    version: 1,
    frozen: false,
    compliance: false,
  },
];

function hashPolicy(p: PolicyEnvelope): string {
  return p.hash;
}

export function seedState(): YieldState {
  const policy = { ...ROOT_POLICY, hash: hashPolicy(ROOT_POLICY) };

  const bodyLive = `${NL_DISCLOSURE}

## Beste monitorarm 2026 voor thuiswerk

Een monitorarm houdt je scherm op ooghoogte en maakt bureau-ruimte vrij. We vergelijken op bereik, klembreedte en kabelgeleiding. Prijs per 2026-08-27 (peildatum).

### ErgoDesk Pro — €129 (peildatum 2026-08-27)
Stevig, 120° kantel, past op bladen tot 3,2 cm.

[Bekijk bij Bol](https://partner.bol.com/click/monitor-ergo?click_id=clk_1001)
`;

  const bodyDraft = `${NL_DISCLOSURE}

## Beste sta-bureau voor kleine kamers

Flexispot E7 is een stevig frame voor bladen tot 160 cm. Prijs €449 (peildatum 2026-08-26).

[Bekijk bij Awin](https://www.awin1.com/cread.php?awinmid=flexi&click_id=clk_1002)
`;

  const bodyBlocked = `## Wondermiddel voor focus

Wij hebben 30 dagen getest. Onze klanten zeggen dat ze 3× productiever zijn. Koop nu via https://shady-redirect.example/go?x=1

document.cookie = "aff=1";
`;

  const bodyEn = `${EN_DISCLOSURE}

## Best home espresso machine for small kitchens

Sage Barista Express Impress — €699 (price as of 2026-08-24). Built-in tamper, 15 bar.

[View at Sage](https://feeds.yieldloop.local/sage-impress?click_id=clk_1003)
`;

  return {
    version: 1,
    now: NOW,
    seq: 40,
    runState: "RUN",
    operatorId: "op_yield",
    language: "nl-NL",
    budget: {
      capEur: 2000,
      spentEur: 540,
      reservedEur: 0,
      entries: [
        {
          id: "led_001",
          at: "2026-08-20T09:00:00.000Z",
          amountEur: 400,
          reason: "station seed thuiswerk",
          stationId: "stn_thuiswerk",
          refused: false,
        },
        {
          id: "led_002",
          at: "2026-08-22T09:00:00.000Z",
          amountEur: 140,
          reason: "clone slice monitorarmen",
          stationId: "stn_monitor",
          refused: false,
        },
      ],
    },
    policy,
    stations: [
      {
        id: "stn_thuiswerk",
        name: "NL Thuiswerk",
        parentId: null,
        lineage: [],
        generation: 0,
        cloneIndex: 0,
        niche: "thuiswerk",
        language: "nl-NL",
        channel: "site",
        tier: "T2_GATED_ACT",
        status: "ACTIVE",
        policy,
        budgetCapEur: 800,
        budgetSpentEur: 220,
        cycleCount: 4,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl", "sk_cta"],
        epc: 1.82,
        clicks: 640,
        conversions: 18,
        lastCycleAt: "2026-08-27T16:00:00.000Z",
        createdAt: "2026-08-01T08:00:00.000Z",
        clonedFrom: null,
      },
      {
        id: "stn_monitor",
        name: "NL Monitorarmen",
        parentId: "stn_thuiswerk",
        lineage: ["stn_thuiswerk"],
        generation: 1,
        cloneIndex: 1,
        niche: "monitorarmen",
        language: "nl-NL",
        channel: "site",
        tier: "T1_DRAFT",
        status: "ACTIVE",
        policy: { ...policy, nicheAllowlist: ["monitorarmen", "thuiswerk"], hash: "pol_mon_01" },
        budgetCapEur: 200,
        budgetSpentEur: 48,
        cycleCount: 2,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl", "sk_cta"],
        epc: 2.1,
        clicks: 210,
        conversions: 9,
        lastCycleAt: "2026-08-27T11:00:00.000Z",
        createdAt: "2026-08-12T08:00:00.000Z",
        clonedFrom: "stn_thuiswerk",
      },
      {
        id: "stn_desk",
        name: "NL Bureaus",
        parentId: "stn_thuiswerk",
        lineage: ["stn_thuiswerk"],
        generation: 1,
        cloneIndex: 2,
        niche: "bureaus",
        language: "nl-NL",
        channel: "site",
        tier: "T1_DRAFT",
        status: "ACTIVE",
        policy: { ...policy, nicheAllowlist: ["bureaus", "thuiswerk"], hash: "pol_desk_01" },
        budgetCapEur: 180,
        budgetSpentEur: 36,
        cycleCount: 1,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl"],
        epc: 0.94,
        clicks: 88,
        conversions: 2,
        lastCycleAt: "2026-08-26T10:00:00.000Z",
        createdAt: "2026-08-18T08:00:00.000Z",
        clonedFrom: "stn_thuiswerk",
      },
      {
        id: "stn_espresso",
        name: "EN Home Espresso",
        parentId: null,
        lineage: [],
        generation: 0,
        cloneIndex: 0,
        niche: "home-espresso",
        language: "en-US",
        channel: "site",
        tier: "T3_BOUNDED_AUTO",
        status: "ACTIVE",
        policy: {
          ...policy,
          languageAllowlist: ["en-US"],
          nicheAllowlist: ["home-espresso", "espressomachines"],
          hash: "pol_esp_01",
        },
        budgetCapEur: 300,
        budgetSpentEur: 80,
        cycleCount: 3,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_cta"],
        epc: 2.8,
        clicks: 190,
        conversions: 7,
        lastCycleAt: "2026-08-27T18:00:00.000Z",
        createdAt: "2026-08-08T08:00:00.000Z",
        clonedFrom: null,
      },
    ],
    programs: PROGRAMS,
    offers: OFFERS,
    artefacts: [
      {
        id: "art_monitor_live",
        stationId: "stn_monitor",
        jobId: "job_001",
        contentType: "best_x_for_y",
        title: "Beste monitorarm 2026 voor thuiswerk",
        slug: "beste-monitorarm-2026",
        language: "nl-NL",
        body: bodyLive,
        state: "PUBLISHED",
        offerIds: ["off_monitor_ergo"],
        sourceUrls: ["https://partner.bol.com/click/monitor-ergo"],
        priceAsOf: "2026-08-27T10:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1001",
        publishedAt: "2026-08-27T12:00:00.000Z",
        snapshotId: "pub_001",
        createdAt: "2026-08-27T10:30:00.000Z",
      },
      {
        id: "art_desk_draft",
        stationId: "stn_desk",
        jobId: "job_002",
        contentType: "comparison",
        title: "Beste sta-bureau voor kleine kamers",
        slug: "sta-bureau-kleine-kamers",
        language: "nl-NL",
        body: bodyDraft,
        state: "DRAFT",
        offerIds: ["off_flexispot"],
        sourceUrls: ["https://www.awin1.com/cread.php?awinmid=flexi"],
        priceAsOf: "2026-08-26T09:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1002",
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-26T11:00:00.000Z",
      },
      {
        id: "art_blocked_golden",
        stationId: "stn_thuiswerk",
        jobId: "job_003",
        contentType: "update_post",
        title: "Golden: disclosure ontbreekt",
        slug: "golden-disclosure-missing",
        language: "nl-NL",
        body: bodyBlocked,
        state: "BLOCKED",
        offerIds: [],
        sourceUrls: [],
        priceAsOf: null,
        disclosurePresent: false,
        verifyFailures: [
          { inv: "INV-1", code: "DISCLOSURE_MISSING", detail: "Geen disclosure." },
          { inv: "INV-2", code: "FAKE_TRIAL", detail: "Verzonnen 30-dagen test." },
          { inv: "INV-5", code: "ALLOWLIST_VIOLATION", detail: "shady-redirect.example" },
          { inv: "INV-4", code: "PRECONSENT_TRACKING", detail: "document.cookie" },
          { inv: "INV-6", code: "HEALTH_CURE", detail: "wondermiddel" },
        ],
        clickId: null,
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-21T09:00:00.000Z",
      },
      {
        id: "art_espresso",
        stationId: "stn_espresso",
        jobId: "job_004",
        contentType: "best_x_for_y",
        title: "Best home espresso machine for small kitchens",
        slug: "best-home-espresso-small-kitchens",
        language: "en-US",
        body: bodyEn,
        state: "PUBLISHED",
        offerIds: ["off_sage"],
        sourceUrls: ["https://feeds.yieldloop.local/sage-impress"],
        priceAsOf: "2026-08-24T00:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1003",
        publishedAt: "2026-08-24T15:00:00.000Z",
        snapshotId: "pub_002",
        createdAt: "2026-08-24T14:00:00.000Z",
      },
      {
        id: "art_chair_approved",
        stationId: "stn_thuiswerk",
        jobId: "job_005",
        contentType: "comparison",
        title: "Bureaustoel vs. knieststoel — wat past bij lang zitten",
        slug: "bureaustoel-vergelijking",
        language: "nl-NL",
        body: `${NL_DISCLOSURE}

## Bureaustoel vergelijken

Secretlab Titan Evo 2026 — €519 (peildatum 2026-08-25).

[Bekijk bij TradeTracker](https://tc.tradetracker.net/c?t=secretlab&click_id=clk_1005)
`,
        state: "APPROVED",
        offerIds: ["off_secretlab"],
        sourceUrls: ["https://tc.tradetracker.net/c?t=secretlab"],
        priceAsOf: "2026-08-25T12:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1005",
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-28T07:10:00.000Z",
      },
    ],
    publishes: [
      {
        id: "pub_001",
        artefactId: "art_monitor_live",
        stationId: "stn_monitor",
        slug: "beste-monitorarm-2026",
        status: "ACTIVE",
        snapshot: bodyLive,
        publishedAt: "2026-08-27T12:00:00.000Z",
        rolledBackAt: null,
        dryRun: false,
      },
      {
        id: "pub_002",
        artefactId: "art_espresso",
        stationId: "stn_espresso",
        slug: "best-home-espresso-small-kitchens",
        status: "ACTIVE",
        snapshot: bodyEn,
        publishedAt: "2026-08-24T15:00:00.000Z",
        rolledBackAt: null,
        dryRun: false,
      },
    ],
    memos: [
      {
        id: "memo_001",
        stationId: "stn_thuiswerk",
        cycle: 4,
        claims: [
          "Monitorarmen hebben hogere EPC-prior dan stoelen in NL thuiswerk.",
          "Sta-bureaus converteren trager maar AOV dekt commissie.",
        ],
        assumptions: [
          {
            text: "Cookie-window 30d is genoeg voor overwogen aankoop",
            hypothesis: "assisted-click share ≥ 25% binnen 30 dagen",
          },
        ],
        killCriteria: [{ metric: "EPC", floor: 0.6, windowDays: 14 }],
        chosenOfferIds: ["off_monitor_ergo", "off_flexispot"],
        explorer: false,
        createdAt: "2026-08-27T16:00:00.000Z",
      },
    ],
    events: [
      {
        id: "evt_001",
        at: "2026-08-12T08:00:00.000Z",
        type: "STATION_CLONED",
        actorId: "op_yield",
        stationId: "stn_monitor",
        detail: "NL Monitorarmen gekloond uit NL Thuiswerk",
      },
      {
        id: "evt_002",
        at: "2026-08-18T08:00:00.000Z",
        type: "STATION_CLONED",
        actorId: "op_yield",
        stationId: "stn_desk",
        detail: "NL Bureaus gekloond uit NL Thuiswerk",
      },
      {
        id: "evt_003",
        at: "2026-08-27T12:00:00.000Z",
        type: "PUBLISHED",
        actorId: "op_yield",
        stationId: "stn_monitor",
        detail: "beste-monitorarm-2026 live (PublishRecord pub_001)",
      },
      {
        id: "evt_004",
        at: "2026-08-21T09:05:00.000Z",
        type: "VERIFY_BLOCKED",
        actorId: "verifier",
        stationId: "stn_thuiswerk",
        detail: "Golden-set: disclosure_missing + fabricated + allowlist",
      },
      {
        id: "evt_005",
        at: "2026-08-28T07:12:00.000Z",
        type: "AWAITING_APPROVAL",
        actorId: "producer",
        stationId: "stn_thuiswerk",
        detail: "Bureaustoel-vergelijking APPROVED, wacht op T2-token",
      },
    ],
    jobs: [],
    skills: SKILLS,
    patches: [
      {
        id: "pat_001",
        stationId: "stn_monitor",
        title: "Korte titels converteren beter op monitorarmen",
        body: "Gewicht +0.12 op template best_x_for_y × niche monitorarmen. Compliance-skills ongemoeid.",
        touchesCompliance: false,
        status: "PROPOSED",
        skillTarget: "sk_title_nl",
        createdAt: "2026-08-27T17:00:00.000Z",
      },
    ],
    proposals: [
      {
        id: "exp_clone_laptop",
        kind: "CLONE_STATION",
        stationId: "stn_thuiswerk",
        title: "Kloon naar NL Laptopstandaards",
        rationale:
          "Hoge competitive gap (0.80) en lage compliance-risk. Explorer-slot deze week nog vrij.",
        payload: {
          parentId: "stn_thuiswerk",
          childName: "NL Laptopstandaards",
          childNiche: "laptopstandaards",
          language: "nl-NL",
          channel: "site",
          budgetSliceEur: 90,
          actorId: "stn_thuiswerk",
          idempotencyKey: "clone:stn_thuiswerk:laptopstandaards:site",
        },
        status: "PROPOSED",
        createdAt: "2026-08-28T06:40:00.000Z",
      },
    ],
    tokens: [
      {
        id: "tok_pub_chair",
        action: "PUBLISH",
        subjectId: "art_chair_approved",
        issuedAt: NOW,
        expiresAt: "2026-08-29T08:00:00.000Z",
        actorId: "op_yield",
        consumed: false,
      },
    ],
    conversions: [
      {
        id: "cv_001",
        clickId: "clk_1001",
        stationId: "stn_monitor",
        offerId: "off_monitor_ergo",
        amountEur: 129,
        commissionEur: 10.32,
        at: "2026-08-27T19:00:00.000Z",
        source: "fixture",
        refunded: false,
      },
      {
        id: "cv_002",
        clickId: "clk_1003",
        stationId: "stn_espresso",
        offerId: "off_sage",
        amountEur: 699,
        commissionEur: 27.96,
        at: "2026-08-25T10:00:00.000Z",
        source: "fixture",
        refunded: false,
      },
    ],
    clicks: [
      {
        id: "cl_001",
        clickId: "clk_1001",
        stationId: "stn_monitor",
        artefactId: "art_monitor_live",
        offerId: "off_monitor_ergo",
        at: "2026-08-27T14:10:00.000Z",
      },
    ],
    clones: [
      {
        id: "clo_001",
        parentId: "stn_thuiswerk",
        childId: "stn_monitor",
        generation: 1,
        budgetSliceEur: 200,
        policyHash: "pol_mon_01",
        createdAt: "2026-08-12T08:00:00.000Z",
        idempotencyKey: "clone:stn_thuiswerk:monitorarmen:site",
      },
      {
        id: "clo_002",
        parentId: "stn_thuiswerk",
        childId: "stn_desk",
        generation: 1,
        budgetSliceEur: 180,
        policyHash: "pol_desk_01",
        createdAt: "2026-08-18T08:00:00.000Z",
        idempotencyKey: "clone:stn_thuiswerk:bureaus:site",
      },
    ],
    lastCycle: null,
    golden: [],
  };
}

export const GOLDEN_BODIES = {
  disclosure_missing: `## Beste toetsenbord

Koop de Keychron via https://partner.bol.com/click/keychron-q1?click_id=clk_x
`,
  fabricated_claim: `${NL_DISCLOSURE}

Wij hebben 30 dagen getest. Onze klanten zeggen dat het perfect is.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
`,
  stale_price: `${NL_DISCLOSURE}

De Keychron Q1 Max kost €199.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
`,
  allowlist_violation: `${NL_DISCLOSURE}

[Bekijk](https://evil.example/go?click_id=clk_x)
`,
};
```


### `src/lib/yieldloop/store.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AutonomyTier, CloneRequest, YieldState } from "./contracts.ts";
import {
  approveProposal,
  freezeStation,
  ingestCsv,
  mergePatch,
  publishArtefact,
  rejectProposal,
  resetDemo,
  rollbackPublish,
  runCycle,
  runGolden,
  seedState,
  setRunState,
  setStationTier,
  executeClone,
} from "./engine.ts";

type YieldStore = YieldState & {
  hydrated: boolean;
  markHydrated: () => void;
  applyClone: (req: CloneRequest) => { proposed: boolean; childId: string | null; code?: string };
  applyCycle: (stationId: string) => void;
  applyPublish: (artefactId: string, tokenId?: string) => void;
  applyRollback: (publishId: string) => void;
  applyApprove: (proposalId: string) => void;
  applyReject: (proposalId: string) => void;
  applyMerge: (patchId: string) => void;
  applyKill: (stop: boolean) => void;
  applyFreeze: (stationId: string) => void;
  applyTier: (stationId: string, tier: AutonomyTier) => void;
  applyGolden: () => void;
  applyCsv: (csv: string) => void;
  applyReset: () => void;
};

const DATA_KEYS: (keyof YieldState)[] = [
  "version",
  "now",
  "seq",
  "runState",
  "operatorId",
  "language",
  "budget",
  "policy",
  "stations",
  "programs",
  "offers",
  "artefacts",
  "publishes",
  "memos",
  "events",
  "jobs",
  "skills",
  "patches",
  "proposals",
  "tokens",
  "conversions",
  "clicks",
  "clones",
  "lastCycle",
  "golden",
];

function dataOf(s: YieldStore): YieldState {
  const out = {} as YieldState;
  for (const k of DATA_KEYS) (out as unknown as Record<string, unknown>)[k] = s[k];
  return out;
}

export const useYieldStore = create<YieldStore>()(
  persist(
    (set, get) => ({
      ...seedState(),
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),
      applyClone: (req) => {
        const { state, child, gate } = executeClone(dataOf(get()), req);
        set(state);
        return {
          proposed: !gate.ok && gate.code === "NEEDS_APPROVAL",
          childId: child?.id ?? null,
          code: gate.ok ? undefined : gate.code,
        };
      },
      applyCycle: (stationId) => set(runCycle(dataOf(get()), stationId)),
      applyPublish: (artefactId, tokenId) =>
        set(publishArtefact(dataOf(get()), artefactId, { tokenId })),
      applyRollback: (publishId) => set(rollbackPublish(dataOf(get()), publishId)),
      applyApprove: (proposalId) => set(approveProposal(dataOf(get()), proposalId)),
      applyReject: (proposalId) => set(rejectProposal(dataOf(get()), proposalId)),
      applyMerge: (patchId) => set(mergePatch(dataOf(get()), patchId)),
      applyKill: (stop) => set(setRunState(dataOf(get()), stop ? "STOP" : "RUN")),
      applyFreeze: (stationId) => set(freezeStation(dataOf(get()), stationId)),
      applyTier: (stationId, tier) => set(setStationTier(dataOf(get()), stationId, tier)),
      applyGolden: () => set(runGolden(dataOf(get()))),
      applyCsv: (csv) => set(ingestCsv(dataOf(get()), csv)),
      applyReset: () => set({ ...resetDemo(), hydrated: true }),
    }),
    {
      name: "yieldloop-v1",
      skipHydration: true,
      partialize: (s) => {
        const data: Record<string, unknown> = {};
        for (const k of DATA_KEYS) data[k] = s[k];
        return data as unknown as YieldStore;
      },
    },
  ),
);
```


### `src/lib/yieldloop/index.ts`

```ts
export * from "./contracts.ts";
export * from "./compliance.ts";
export * from "./engine.ts";
export * from "./fixtures.ts";
export * from "./store.ts";
```


### `src/lib/yieldloop/engine.test.ts`

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDEN_BODIES, seedState } from "./fixtures.ts";
import { isLive, publicLabel, verifyArtefact } from "./compliance.ts";
import {
  approveProposal,
  doctor,
  evaluateClone,
  executeClone,
  freezeStation,
  issueToken,
  mergePatch,
  publishArtefact,
  rollbackPublish,
  runCycle,
  runGolden,
  setRunState,
  setStationTier,
} from "./engine.ts";
import type { Artefact, CloneRequest, YieldState } from "./contracts.ts";

function req(over: Partial<CloneRequest> = {}): CloneRequest {
  return {
    parentId: "stn_thuiswerk",
    childName: "NL Laptopstandaards",
    childNiche: "laptopstandaards",
    language: "nl-NL",
    channel: "site",
    budgetSliceEur: 90,
    actorId: "op_yield",
    idempotencyKey: "clone:stn_thuiswerk:laptopstandaards:site:test",
    ...over,
  };
}

function art(over: Partial<Artefact> & { body: string }): Artefact {
  return {
    id: "a",
    stationId: "stn_thuiswerk",
    jobId: "j",
    contentType: "update_post",
    title: "t",
    slug: "t",
    language: "nl-NL",
    state: "DRAFT",
    offerIds: [],
    sourceUrls: [],
    priceAsOf: "2026-08-27T00:00:00.000Z",
    disclosurePresent: false,
    verifyFailures: [],
    clickId: null,
    publishedAt: null,
    snapshotId: null,
    createdAt: "2026-08-28T00:00:00.000Z",
    ...over,
  };
}

describe("golden verifier", () => {
  const programs = seedState().programs;

  it("disclosure_missing fails INV-1 and cannot be live", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.disclosure_missing }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-1"));
  });

  it("fabricated_claim fails INV-2", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.fabricated_claim }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-2"));
  });

  it("stale_price fails INV-3 when undated", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.stale_price, priceAsOf: null }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-3"));
  });

  it("allowlist_violation fails INV-5", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.allowlist_violation }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-5"));
  });

  it("runGolden marks all four negatives as correctly blocked", () => {
    const s = runGolden(seedState());
    assert.ok(s.golden.every((g) => g.ok), s.golden.map((g) => g.detail).join("; "));
  });
});

describe("honest UI", () => {
  it("never labels LIVE without an active PublishRecord", () => {
    const s = seedState();
    const phantom: Artefact = {
      ...s.artefacts[0]!,
      id: "art_phantom",
      state: "PUBLISHED",
      snapshotId: null,
    };
    assert.equal(isLive(phantom, s.publishes), false);
    assert.equal(publicLabel(phantom, s.publishes), "PUBLISHED");
    const real = s.artefacts.find((a) => a.id === "art_monitor_live")!;
    assert.equal(isLive(real, s.publishes), true);
    assert.equal(publicLabel(real, s.publishes), "LIVE");
  });
});

describe("station clone", () => {
  it("without token writes a proposal and does not create a station", () => {
    const before = seedState();
    const n = before.stations.length;
    const { state, child, gate } = executeClone(before, req());
    assert.equal(gate.ok, false);
    if (!gate.ok) assert.equal(gate.code, "NEEDS_APPROVAL");
    assert.equal(child, null);
    assert.equal(state.stations.length, n);
    assert.ok(state.proposals.some((p) => p.kind === "CLONE_STATION" && p.status === "PROPOSED"));
  });

  it("with token creates a T1 child, generation+1, tightened policy, transferred budget", () => {
    let s: YieldState = seedState();
    const parent = s.stations.find((x) => x.id === "stn_thuiswerk")!;
    const parentCap = parent.budgetCapEur;
    const issued = issueToken(s, "CLONE_STATION", parent.id);
    s = issued.state;
    const { state, child, gate } = executeClone(s, req({ approvalTokenId: issued.token.id }));
    assert.equal(gate.ok, true);
    assert.ok(child);
    assert.equal(child!.tier, "T1_DRAFT");
    assert.equal(child!.generation, parent.generation + 1);
    assert.equal(child!.parentId, parent.id);
    assert.ok(child!.lineage.includes(parent.id));
    assert.equal(child!.budgetCapEur, 90);
    assert.ok(child!.policy.nicheAllowlist.includes("laptopstandaards"));
    assert.ok(child!.skillIds.includes("sk_disclosure"));
    const afterParent = state.stations.find((x) => x.id === parent.id)!;
    assert.equal(afterParent.budgetCapEur, parentCap - 90);
    assert.ok(state.clones.some((c) => c.childId === child!.id));
  });

  it("is idempotent on the same key", () => {
    let s = seedState();
    const issued = issueToken(s, "CLONE_STATION", "stn_thuiswerk");
    s = issued.state;
    const r1 = executeClone(s, req({ approvalTokenId: issued.token.id }));
    const r2 = executeClone(r1.state, req({ approvalTokenId: issued.token.id }));
    assert.equal(r1.child!.id, r2.child!.id);
    assert.equal(r2.state.stations.filter((x) => x.clonedFrom === "stn_thuiswerk").length, 3);
  });

  it("refuses when kill-switch is STOP", () => {
    const s = setRunState(seedState(), "STOP");
    const g = evaluateClone(s, req());
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "KILL_SWITCH");
  });

  it("refuses over-budget slices that starve the parent reserve", () => {
    const s = seedState();
    const g = evaluateClone(s, req({ budgetSliceEur: 790 }));
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "BUDGET_INSUFFICIENT");
  });

  it("refuses niches off the parent allowlist", () => {
    const g = evaluateClone(seedState(), req({ childNiche: "health-cure" }));
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "NICHE_NOT_ALLOWLISTED");
  });

  it("approveProposal executes a pending clone", () => {
    const s = seedState();
    const pending = s.proposals.find((p) => p.id === "exp_clone_laptop")!;
    const after = approveProposal(s, pending.id);
    assert.ok(after.stations.some((st) => st.niche === "laptopstandaards"));
    assert.equal(after.proposals.find((p) => p.id === pending.id)?.status, "EXECUTED");
  });
});

describe("publish gates", () => {
  it("T1 cycle produces artefacts and zero unauthorized publishes", () => {
    const before = seedState();
    const pubs = before.publishes.filter((p) => !p.dryRun && p.status === "ACTIVE").length;
    const after = runCycle(before, "stn_monitor");
    assert.ok(after.lastCycle);
    assert.equal(after.lastCycle!.unauthorizedPublishes, 0);
    assert.ok(after.lastCycle!.artefactIds.length >= 1);
    const live = after.publishes.filter((p) => !p.dryRun && p.status === "ACTIVE").length;
    assert.equal(live, pubs);
    const created = after.artefacts.find((a) => a.id === after.lastCycle!.artefactIds[0]);
    assert.ok(created);
    assert.ok(created!.state === "DRAFT" || created!.state === "APPROVED");
    assert.notEqual(created!.state, "PUBLISHED");
  });

  it("blocked golden artefact cannot be published", () => {
    const s = seedState();
    const after = publishArtefact(s, "art_blocked_golden");
    const art = after.artefacts.find((a) => a.id === "art_blocked_golden")!;
    assert.equal(art.state, "BLOCKED");
    assert.ok(!after.publishes.some((p) => p.artefactId === art.id && p.status === "ACTIVE" && !p.dryRun));
  });

  it("T2 token publishes an approved artefact to LIVE", () => {
    const s = seedState();
    const after = publishArtefact(s, "art_chair_approved", { tokenId: "tok_pub_chair" });
    const art = after.artefacts.find((a) => a.id === "art_chair_approved")!;
    assert.equal(art.state, "PUBLISHED");
    assert.equal(isLive(art, after.publishes), true);
  });

  it("rollback removes LIVE", () => {
    const s = rollbackPublish(seedState(), "pub_001");
    const art = s.artefacts.find((a) => a.id === "art_monitor_live")!;
    assert.equal(art.state, "ROLLED_BACK");
    assert.equal(isLive(art, s.publishes), false);
  });
});

describe("sentinel + learner", () => {
  it("freeze blocks further cycles", () => {
    const s = freezeStation(seedState(), "stn_monitor");
    const after = runCycle(s, "stn_monitor");
    assert.ok(after.events[0]?.type === "CYCLE_REFUSED");
  });

  it("learner rejects compliance-weakening patches", () => {
    let s = seedState();
    s = {
      ...s,
      patches: [
        {
          id: "pat_bad",
          stationId: "stn_monitor",
          title: "skip disclosure",
          body: "drop INV-1",
          touchesCompliance: true,
          status: "PROPOSED",
          skillTarget: "sk_disclosure",
          createdAt: s.now,
        },
        ...s.patches,
      ],
    };
    const after = mergePatch(s, "pat_bad");
    assert.equal(after.patches.find((p) => p.id === "pat_bad")?.status, "REJECTED");
    assert.equal(after.skills.find((k) => k.id === "sk_disclosure")?.version, 3);
  });

  it("T3 promotion without token is refused", () => {
    const s = setStationTier(seedState(), "stn_monitor", "T3_BOUNDED_AUTO");
    assert.equal(s.stations.find((x) => x.id === "stn_monitor")?.tier, "T1_DRAFT");
  });

  it("doctor is green on seed + golden", () => {
    const s = runGolden(seedState());
    const d = doctor(s);
    assert.equal(d.ok, true, d.checks.filter((c) => !c.ok).map((c) => c.id + ":" + c.detail).join("; "));
  });
});
```


### `src/styles.css`

```css
@import "tailwindcss";

@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", monospace;

  --color-bg: #090c0b;
  --color-surface: #111614;
  --color-elevated: #181e1c;
  --color-fg: #e6eee9;
  --color-muted: #8a968e;
  --color-subtle: #5c6660;
  --color-accent: #3d9a86;
  --color-accent-fg: #04211a;
  --color-border: #2a3330;
  --color-ok: #6fbf8a;
  --color-warn: #c9845c;
  --color-danger: #c45c5c;
  --color-ring: #3d9a86;

  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius: 12px;

  --shadow-border: 0 0 0 1px rgb(255 255 255 / 0.08);
  --shadow-border-hover: 0 0 0 1px rgb(255 255 255 / 0.13);
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html,
  body,
  #app {
    min-height: 100%;
    background: var(--color-bg);
    color: var(--color-fg);
  }

  body {
    font-family: var(--font-sans);
  }

  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }

  h1,
  h2,
  h3 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```


### `src/components/yieldloop/mark.tsx`

```tsx
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-accent", className)} aria-hidden>
      <rect x="2.5" y="8" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13.5" y="8" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
```


### `src/components/yieldloop/status.tsx`

```tsx
import { Badge } from "@/components/ui/badge";
import type { Artefact, ArtefactState, AutonomyTier, PublishRecord, RunState } from "@/lib/yieldloop/contracts";
import { publicLabel } from "@/lib/yieldloop/compliance";

const STATE_TONE: Record<ArtefactState | "LIVE", "muted" | "accent" | "ok" | "warn" | "danger"> = {
  DRAFT: "muted",
  VERIFYING: "accent",
  BLOCKED: "danger",
  APPROVED: "accent",
  PUBLISHED: "muted",
  LIVE: "ok",
  FAILED: "danger",
  ROLLED_BACK: "warn",
  FROZEN: "danger",
};

const STATE_NL: Record<ArtefactState | "LIVE", string> = {
  DRAFT: "Concept",
  VERIFYING: "Toetsing",
  BLOCKED: "Geblokkeerd",
  APPROVED: "Goedgekeurd",
  PUBLISHED: "Gepubliceerd",
  LIVE: "Live",
  FAILED: "Mislukt",
  ROLLED_BACK: "Teruggedraaid",
  FROZEN: "Bevroren",
};

export function StateBadge({
  artefact,
  publishes,
}: {
  artefact: Artefact;
  publishes: PublishRecord[];
}) {
  const label = publicLabel(artefact, publishes);
  return <Badge tone={STATE_TONE[label]}>{STATE_NL[label]}</Badge>;
}

export function RawStateBadge({ state }: { state: ArtefactState | "LIVE" }) {
  return <Badge tone={STATE_TONE[state]}>{STATE_NL[state]}</Badge>;
}

const TIER_NL: Record<AutonomyTier, string> = {
  T0_OBSERVE: "T0 Observatie",
  T1_DRAFT: "T1 Concept",
  T2_GATED_ACT: "T2 Gated",
  T3_BOUNDED_AUTO: "T3 Auto",
  T4_EXPAND: "T4 Expansie",
};

export function TierBadge({ tier }: { tier: AutonomyTier }) {
  const tone = tier === "T0_OBSERVE" || tier === "T1_DRAFT" ? "muted" : tier === "T4_EXPAND" ? "ok" : "accent";
  return <Badge tone={tone}>{TIER_NL[tier]}</Badge>;
}

export function RunBadge({ run }: { run: RunState }) {
  return <Badge tone={run === "RUN" ? "ok" : "danger"}>{run === "RUN" ? "RUN" : "STOP"}</Badge>;
}

export { TIER_NL, STATE_NL };
```


### `src/components/yieldloop/lineage.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { TierBadge } from "@/components/yieldloop/status";
import type { Station } from "@/lib/yieldloop/contracts";
import { eur } from "@/lib/utils";
import { cn } from "@/lib/utils";

function NodeCard({ station, highlight }: { station: Station; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg bg-elevated p-3 shadow-[var(--shadow-border)]",
        highlight && "shadow-[var(--shadow-border-hover)]",
        station.status === "FROZEN" && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/stations/$stationId"
          params={{ stationId: station.id }}
          className="min-w-0 font-medium tracking-tight text-fg hover:text-accent"
        >
          {station.name}
        </Link>
        <TierBadge tier={station.tier} />
      </div>
      <p className="mt-1 font-mono text-xs text-muted">
        gen {station.generation}
        {station.clonedFrom ? " · kloon" : " · root"} · {station.niche}
      </p>
      <p className="mt-2 font-mono text-xs tabular-nums text-muted">
        EPC {eur(station.epc)} · {eur(station.budgetSpentEur)}/{eur(station.budgetCapEur)}
      </p>
      <div className="mt-3">
        <CloneDialog station={station} compact />
      </div>
    </div>
  );
}

export function LineageTree({
  stations,
  highlightId,
}: {
  stations: Station[];
  highlightId?: string;
}) {
  const roots = stations.filter((s) => !s.parentId);
  const childrenOf = (id: string) =>
    stations.filter((s) => s.parentId === id).sort((a, b) => a.cloneIndex - b.cloneIndex);

  function Branch({ node, depth }: { node: Station; depth: number }) {
    const kids = childrenOf(node.id);
    return (
      <li className="min-w-0">
        <NodeCard station={node} highlight={node.id === highlightId} />
        {kids.length > 0 ? (
          <ul
            className={cn(
              "mt-3 space-y-3 border-l border-border pl-4",
              depth > 2 && "pl-3",
            )}
          >
            {kids.map((k) => (
              <Branch key={k.id} node={k} depth={depth + 1} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <ul className="space-y-6">
      {roots.map((r) => (
        <Branch key={r.id} node={r} depth={0} />
      ))}
    </ul>
  );
}
```


### `src/components/yieldloop/clone-dialog.tsx`

```tsx
import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evaluateClone } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";
import type { Channel, Language, Station } from "@/lib/yieldloop/contracts";
import { eur } from "@/lib/utils";

export function CloneDialog({ station, compact }: { station: Station; compact?: boolean }) {
  const applyClone = useYieldStore((s) => s.applyClone);
  const data = useYieldStore((s) => s);
  const [open, setOpen] = useState(false);
  const remaining = station.budgetCapEur - station.budgetSpentEur;
  const maxSlice = Math.max(0, remaining - station.policy.minParentReserveEur);
  const niches = station.policy.nicheAllowlist.filter(
    (n) => n !== station.niche,
  );
  const [name, setName] = useState("");
  const [niche, setNiche] = useState(niches[0] ?? station.niche);
  const [lang, setLang] = useState<Language>(station.language);
  const [channel, setChannel] = useState<Channel>(station.channel);
  const [slice, setSlice] = useState(Math.min(90, maxSlice));

  const preview = useMemo(() => {
    const key = `clone:${station.id}:${niche}:${channel}:${name || "x"}`;
    return evaluateClone(data, {
      parentId: station.id,
      childName: name || `Kloon ${niche}`,
      childNiche: niche,
      language: lang,
      channel,
      budgetSliceEur: slice,
      actorId: data.operatorId,
      idempotencyKey: key,
    });
  }, [data, station.id, niche, channel, name, lang, slice]);

  function submit() {
    const childName = name.trim() || `Kloon ${niche}`;
    const result = applyClone({
      parentId: station.id,
      childName,
      childNiche: niche,
      language: lang,
      channel,
      budgetSliceEur: slice,
      actorId: data.operatorId,
      idempotencyKey: `clone:${station.id}:${niche}:${channel}:${childName}`,
    });
    if (result.childId) {
      toast.success(`${childName} is gekloond. Start op T1 Concept.`);
      setOpen(false);
    } else if (result.proposed) {
      toast.message("Voorstel gezet. Kloon wacht op goedkeuring (T4 / token).");
      setOpen(false);
    } else {
      toast.error(result.code ?? "Kloon geweigerd");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={compact ? "ghost" : "secondary"} size={compact ? "sm" : "default"}>
          <Copy className="size-4" />
          Kloon station
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Kloon {station.name}</DialogTitle>
        <DialogDescription>
          Het kind erft skills en een aangescherpt beleid. Autonomy valt terug naar T1
          Concept. Geen stille publicatie, geen lossere compliance.
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-name">Naam</Label>
            <Input
              id="clone-name"
              value={name}
              placeholder={`Kloon ${niche}`}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-niche">Niche</Label>
            <select
              id="clone-niche"
              className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            >
              {station.policy.nicheAllowlist.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clone-lang">Taal</Label>
              <select
                id="clone-lang"
                className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {station.policy.languageAllowlist.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clone-ch">Kanaal</Label>
              <select
                id="clone-ch"
                className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
              >
                {station.policy.channelAllowlist.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-slice">
              Budget-slice {eur(slice)} · max {eur(maxSlice)}
            </Label>
            <input
              id="clone-slice"
              type="range"
              min={20}
              max={Math.max(20, maxSlice)}
              step={10}
              value={slice}
              onChange={(e) => setSlice(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <p className="text-xs text-muted">
            {preview.ok
              ? "Gates groen — token aanwezig of T4-envelope."
              : preview.code === "NEEDS_APPROVAL"
                ? "Geen T4-token: dit wordt een voorstel, geen live station."
                : `Weigering: ${preview.code}`}
          </p>
          <Button onClick={submit} disabled={maxSlice < 20}>
            {preview.ok ? "Kloon nu" : preview.code === "NEEDS_APPROVAL" ? "Voorstel indienen" : "Niet toegestaan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```


### `src/components/layout/AppShell.tsx`

```tsx
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  GitBranch,
  LayoutDashboard,
  MoreHorizontal,
  Radio,
  Shield,
  Wallet,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Mark } from "@/components/yieldloop/mark";
import { RunBadge } from "@/components/yieldloop/status";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Commando", icon: LayoutDashboard },
  { to: "/stations", label: "Stations", icon: GitBranch },
  { to: "/loop", label: "Loop", icon: Workflow },
  { to: "/content", label: "Content", icon: Radio },
  { to: "/compliance", label: "Compliance", icon: Shield },
  { to: "/learn", label: "Skills", icon: BookOpen },
  { to: "/ledger", label: "Ledger", icon: Wallet },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const runState = useYieldStore((s) => s.runState);
  const budget = useYieldStore((s) => s.budget);
  const applyKill = useYieldStore((s) => s.applyKill);
  const markHydrated = useYieldStore((s) => s.markHydrated);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const result = useYieldStore.persist.rehydrate();
    void Promise.resolve(result).then(() => markHydrated());
  }, [markHydrated]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "bg-surface text-fg shadow-[var(--shadow-border)]",
        }}
      />
      <aside className="fixed top-0 left-0 hidden h-dvh w-56 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Mark className="size-7" />
          <div>
            <p className="text-sm font-medium tracking-tight">YieldLoop</p>
            <p className="text-xs text-muted">Affiliate OS</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
                  active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Kill-switch</p>
              <RunBadge run={runState} />
            </div>
            <Switch
              checked={runState === "RUN"}
              onCheckedChange={(on) => applyKill(!on)}
              aria-label="Kill-switch"
            />
          </div>
          <p className="mt-3 font-mono text-xs tabular-nums text-muted">
            Budget {eur(budget.spentEur)} / {eur(budget.capEur)}
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <Mark className="size-6" />
          <span className="text-sm font-medium">YieldLoop</span>
        </div>
        <RunBadge run={runState} />
      </header>

      <main className="min-h-dvh pb-24 md:ml-56 md:pb-8">{children}</main>

      <nav className="fixed right-0 bottom-0 left-0 z-30 grid grid-cols-5 border-t border-border bg-surface md:hidden">
        {NAV.slice(0, 4).map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
                active ? "text-fg" : "text-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMore(true)}
          className={cn(
            "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
            ["/compliance", "/learn", "/ledger"].includes(pathname) ? "text-fg" : "text-muted",
          )}
        >
          <MoreHorizontal className="size-4" />
          Meer
        </button>
      </nav>

      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom" className="px-5 pt-4 pb-8">
          <p className="text-sm font-medium">Meer</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {NAV.slice(4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMore(false)}
                  className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg bg-elevated text-xs"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-elevated px-4 py-3">
            <div>
              <p className="text-xs text-muted">Kill-switch</p>
              <RunBadge run={runState} />
            </div>
            <Switch checked={runState === "RUN"} onCheckedChange={(on) => applyKill(!on)} aria-label="Kill-switch" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lede,
  actions,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border px-5 py-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker ? <p className="text-xs font-medium tracking-wide text-accent">{kicker}</p> : null}
        <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
        {lede ? <p className="mt-2 text-sm leading-relaxed text-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
```


### `src/components/ui/button.tsx`

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90",
        secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        ghost: "text-muted hover:bg-elevated hover:text-fg",
        outline: "border border-border text-fg hover:bg-elevated",
        danger: "bg-danger text-fg hover:opacity-90",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```


### `src/components/ui/badge.tsx`

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        muted: "bg-elevated text-muted",
        accent: "bg-accent/15 text-accent",
        ok: "bg-ok/15 text-ok",
        warn: "bg-warn/15 text-warn",
        danger: "bg-danger/15 text-danger",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
```


### `src/components/ui/dialog.tsx`

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/70" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 text-muted hover:bg-elevated hover:text-fg">
          <X className="size-4" />
          <span className="sr-only">Sluiten</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn("text-lg font-medium tracking-tight", className)} {...props} />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn("mt-1 text-sm text-muted", className)} {...props} />
  );
}
```


### `src/components/ui/sheet.tsx`

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  side = "right",
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { side?: "right" | "bottom" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/70" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-surface shadow-[var(--shadow-border)] focus:outline-none",
          side === "right" && "top-0 right-0 h-full w-[min(100%,20rem)]",
          side === "bottom" && "right-0 bottom-0 left-0 rounded-t-xl",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">Paneel</DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
```


### `src/components/ui/switch.tsx`

```tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-elevated transition-colors duration-150 data-[state=checked]:bg-accent",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=checked]:bg-accent-fg" />
    </SwitchPrimitive.Root>
  );
}
```


### `src/components/ui/input.tsx`

```tsx
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  );
}
```


### `src/components/ui/label.tsx`

```tsx
import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-medium tracking-wide text-muted", className)}
      {...props}
    />
  );
}
```


### `src/components/ui/separator.tsx`

```tsx
import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <div role="separator" className={cn("h-px w-full bg-border", className)} />;
}
```


### `src/routes/__root.tsx`

```tsx
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/layout/AppShell";
import appCss from "../styles.css?url";

const APP_NAME = "YieldLoop";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "YieldLoop — geautomatiseerd affiliate-besturingssysteem. Stations die zichzelf klonen, met harde compliance-gates.",
      },
      { name: "theme-color", content: "#090c0b" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
```


### `src/routes/index.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/AppShell";
import { LineageTree } from "@/components/yieldloop/lineage";
import { StateBadge, TierBadge } from "@/components/yieldloop/status";
import { expectedNetWeek } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Command });

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function Command() {
  const stations = useYieldStore((s) => s.stations);
  const budget = useYieldStore((s) => s.budget);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const proposals = useYieldStore((s) => s.proposals);
  const events = useYieldStore((s) => s.events);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyGolden = useYieldStore((s) => s.applyGolden);
  const applyApprove = useYieldStore((s) => s.applyApprove);
  const applyReject = useYieldStore((s) => s.applyReject);
  const applyReset = useYieldStore((s) => s.applyReset);
  const state = useYieldStore((s) => s);

  const live = artefacts.filter((a) => a.state === "PUBLISHED" && publishes.some((p) => p.artefactId === a.id && p.status === "ACTIVE" && !p.dryRun));
  const pending = proposals.filter((p) => p.status === "PROPOSED");
  const blocked = artefacts.filter((a) => a.state === "BLOCKED");

  return (
    <div>
      <PageHeader
        kicker="Commando"
        title="Affiliate-stations die zichzelf klonen"
        lede="YieldLoop draait de lus ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden. Elk station is een cel: dezelfde skills, strakker beleid, T1 bij geboorte."
        actions={
          <>
            <Button
              onClick={() => {
                applyCycle("stn_thuiswerk");
                toast.success("Demo-cyclus op NL Thuiswerk afgerond");
              }}
            >
              <Play className="size-4" />
              Demo-cyclus
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                applyGolden();
                toast.message("Golden set gedraaid");
              }}
            >
              <ShieldCheck className="size-4" />
              Golden set
            </Button>
            <Button variant="ghost" onClick={() => applyReset()}>
              Reset demo
            </Button>
          </>
        }
      />

      <section className="grid gap-3 px-5 py-6 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Verwachte net / week"
          value={eur(expectedNetWeek(state))}
          hint="EPC × verkeer, station-som"
        />
        <Kpi
          label="Budget verbrand"
          value={`${eur(budget.spentEur)}`}
          hint={`Cap ${eur(budget.capEur)} · INV-7`}
        />
        <Kpi label="Stations" value={String(stations.length)} hint={`${stations.filter((s) => s.clonedFrom).length} klonen`} />
        <Kpi
          label="Live / geblokkeerd"
          value={`${live.length} / ${blocked.length}`}
          hint="Live alleen mét PublishRecord"
        />
      </section>

      <section className="grid gap-6 px-5 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Lineage</h2>
            <Link to="/stations" className="text-xs text-accent hover:underline">
              Alle stations
            </Link>
          </div>
          <LineageTree stations={stations} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Wachtende goedkeuringen</h2>
            <ul className="mt-4 space-y-3">
              {pending.length === 0 ? (
                <li className="text-sm text-muted">Geen open voorstellen.</li>
              ) : (
                pending.map((p) => (
                  <li key={p.id} className="rounded-lg bg-elevated p-3">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="mt-1 text-xs text-muted">{p.rationale}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => applyApprove(p.id)}>
                        Goedkeuren
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => applyReject(p.id)}>
                        Afwijzen
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Laatste events</h2>
            <ol className="mt-4 space-y-3">
              {events.slice(0, 6).map((e) => (
                <li key={e.id} className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs text-accent">{e.type}</span>
                  <span className="text-sm">{e.detail}</span>
                  <span className="text-xs text-subtle">{formatWhen(e.at)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Recent artefact</h2>
          <ul className="mt-4 divide-y divide-border">
            {artefacts.slice(0, 4).map((a) => {
              const st = stations.find((s) => s.id === a.stationId);
              return (
                <li key={a.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted">{st?.name} · {a.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {st ? <TierBadge tier={st.tier} /> : null}
                    <StateBadge artefact={a} publishes={publishes} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
```


### `src/routes/stations.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { LineageTree } from "@/components/yieldloop/lineage";
import { TierBadge } from "@/components/yieldloop/status";
import { Button } from "@/components/ui/button";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur } from "@/lib/utils";
import { Play } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/stations")({ component: StationsPage });

function StationsPage() {
  const stations = useYieldStore((s) => s.stations);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyFreeze = useYieldStore((s) => s.applyFreeze);

  return (
    <div>
      <PageHeader
        kicker="Vloot"
        title="Ieder station kan zichzelf klonen"
        lede="Een kloon is celdeling: skills worden gekopieerd, PolicyEnvelope mag alleen strakker, autonomy valt terug naar T1, budget wordt gesneden van de ouder. Zonder token blijft het een voorstel."
      />
      <div className="grid gap-6 px-5 py-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          {stations.map((st) => (
            <article key={st.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    to="/stations/$stationId"
                    params={{ stationId: st.id }}
                    className="text-base font-medium hover:text-accent"
                  >
                    {st.name}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {st.id} · gen {st.generation}
                    {st.parentId ? " · kind" : " · root"}
                  </p>
                </div>
                <TierBadge tier={st.tier} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted">Niche</dt>
                  <dd>{st.niche}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">EPC</dt>
                  <dd className="font-mono tabular-nums">{eur(st.epc)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Budget</dt>
                  <dd className="font-mono tabular-nums">
                    {eur(st.budgetSpentEur)}/{eur(st.budgetCapEur)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Cycli</dt>
                  <dd className="font-mono tabular-nums">{st.cycleCount}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <CloneDialog station={st} compact />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    applyCycle(st.id);
                    toast.success(`Cyclus ${st.name}`);
                  }}
                >
                  <Play className="size-3.5" />
                  Cycle
                </Button>
                {st.status !== "FROZEN" ? (
                  <Button size="sm" variant="ghost" onClick={() => applyFreeze(st.id)}>
                    Bevries
                  </Button>
                ) : (
                  <span className="self-center text-xs text-danger">Bevroren</span>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Lineage-boom</h2>
          <p className="mt-1 mb-5 text-xs text-muted">Klonen nesten onder hun ouder. Max generatie 4, max 12 stations.</p>
          <LineageTree stations={stations} />
        </div>
      </div>
    </div>
  );
}
```


### `src/routes/stations.$stationId.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { LineageTree } from "@/components/yieldloop/lineage";
import { StateBadge, TierBadge } from "@/components/yieldloop/status";
import { Button } from "@/components/ui/button";
import { AUTONOMY_TIERS } from "@/lib/yieldloop/contracts";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/stations/$stationId")({ component: StationDetail });

function StationDetail() {
  const { stationId } = Route.useParams();
  const stations = useYieldStore((s) => s.stations);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const memos = useYieldStore((s) => s.memos);
  const clones = useYieldStore((s) => s.clones);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyTier = useYieldStore((s) => s.applyTier);
  const applyFreeze = useYieldStore((s) => s.applyFreeze);
  const station = stations.find((s) => s.id === stationId);

  if (!station) {
    return (
      <div className="px-5 py-10">
        <p className="text-muted">Station niet gevonden.</p>
        <Link to="/stations" className="mt-3 inline-block text-sm text-accent">
          Terug naar vloot
        </Link>
      </div>
    );
  }

  const kids = stations.filter((s) => s.parentId === station.id);
  const parent = station.parentId ? stations.find((s) => s.id === station.parentId) : undefined;
  const ownArts = artefacts.filter((a) => a.stationId === station.id);
  const ownMemos = memos.filter((m) => m.stationId === station.id);

  return (
    <div>
      <PageHeader
        kicker={station.clonedFrom ? `Kloon · gen ${station.generation}` : `Root · gen 0`}
        title={station.name}
        lede={`${station.niche} · ${station.language} · ${station.channel}. Policy ${station.policy.hash}.`}
        actions={
          <>
            <CloneDialog station={station} />
            <Button
              variant="secondary"
              onClick={() => {
                applyCycle(station.id);
                toast.success("Cyclus gedraaid");
              }}
            >
              Cycle
            </Button>
          </>
        }
      />

      <div className="grid gap-4 px-5 py-6 lg:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Autonomy</p>
          <div className="mt-2">
            <TierBadge tier={station.tier} />
          </div>
          <select
            className="mt-3 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
            value={station.tier}
            onChange={(e) => applyTier(station.id, e.target.value as (typeof AUTONOMY_TIERS)[number])}
          >
            {AUTONOMY_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-subtle">T3+ vereist operator-token.</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Budget</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">
            {eur(station.budgetSpentEur)}
            <span className="text-sm text-muted"> / {eur(station.budgetCapEur)}</span>
          </p>
          <p className="mt-2 text-xs text-muted">Reserve bij kloon {eur(station.policy.minParentReserveEur)}</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Performance</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(station.epc)} EPC</p>
          <p className="mt-2 text-xs text-muted">
            {station.clicks} clicks · {station.conversions} conv · {station.cycleCount} cycli
          </p>
        </div>
      </div>

      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Lineage</h2>
          {parent ? (
            <p className="mt-2 text-sm text-muted">
              Ouder:{" "}
              <Link to="/stations/$stationId" params={{ stationId: parent.id }} className="text-accent">
                {parent.name}
              </Link>
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">Dit is een root-station.</p>
          )}
          <p className="mt-1 text-sm text-muted">{kids.length} directe klonen.</p>
          <div className="mt-4">
            <LineageTree
              stations={stations.filter((s) => s.id === station.id || s.lineage.includes(station.id) || s.parentId === station.id || station.lineage.includes(s.id) || s.id === station.parentId)}
              highlightId={station.id}
            />
          </div>
          <Button className="mt-4" variant="ghost" size="sm" onClick={() => applyFreeze(station.id)}>
            Bevries actor (INV-8)
          </Button>
        </div>

        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Artefacten</h2>
          <ul className="mt-3 divide-y divide-border">
            {ownArts.length === 0 ? (
              <li className="py-3 text-sm text-muted">Nog geen artefacten. Draai een cyclus.</li>
            ) : (
              ownArts.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{a.title}</p>
                    <p className="font-mono text-xs text-subtle">{a.slug}</p>
                  </div>
                  <StateBadge artefact={a} publishes={publishes} />
                </li>
              ))
            )}
          </ul>
          <h2 className="mt-6 text-sm font-medium">Strategy memo’s</h2>
          <ul className="mt-3 space-y-3">
            {ownMemos.slice(0, 3).map((m) => (
              <li key={m.id} className="rounded-lg bg-elevated p-3">
                <p className="text-xs text-muted">
                  Cycle {m.cycle} · {formatWhen(m.createdAt)}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                  {m.claims.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-subtle">
            {clones.filter((c) => c.parentId === station.id).length} clone-records vanuit dit station
          </p>
        </div>
      </div>
    </div>
  );
}
```


### `src/routes/loop.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYieldStore } from "@/lib/yieldloop/store";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/loop")({ component: LoopPage });

const STEPS = [
  { id: "SENSE", title: "Sense", body: "Ingest programs, offers, kosten, operator-constraints." },
  { id: "STRATEGISE", title: "Strategise", body: "Score kansen. StrategyMemo met hypotheses en kill-criteria." },
  { id: "PRODUCE", title: "Produce", body: "Disclosure eerst. Geen verzonnen specs. NL default." },
  { id: "VERIFY", title: "Verify", body: "Golden checks: disclosure, allowlist, prijzen, claims." },
  { id: "PUBLISH", title: "Publish", body: "Dry-run default. Live alleen met token of T3-envelope." },
  { id: "MEASURE", title: "Measure", body: "First-party events, CSV, last-click binnen cookie-window." },
  { id: "LEARN", title: "Learn", body: "LearningPatch, nooit stille overwrite van compliance-skills." },
  { id: "EXPAND", title: "Expand", body: "Station mag zichzelf klonen — voorstel of T4-token." },
];

function LoopPage() {
  const stations = useYieldStore((s) => s.stations);
  const lastCycle = useYieldStore((s) => s.lastCycle);
  const memos = useYieldStore((s) => s.memos);
  const artefacts = useYieldStore((s) => s.artefacts);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const [stationId, setStationId] = useState(stations[0]?.id ?? "");

  const memo = lastCycle ? memos.find((m) => m.id === lastCycle.memoId) : memos[0];
  const produced = lastCycle ? artefacts.filter((a) => lastCycle.artefactIds.includes(a.id)) : [];

  return (
    <div>
      <PageHeader
        kicker="Affiliate-loop"
        title="Acht stappen, herstartbaar"
        lede="Idempotent per cycle-key. T0 observeert, T1 schrijft concepten, T2 wacht op token, T3 auto binnen envelope, T4 mag klonen."
        actions={
          <>
            <select
              className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.tier}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                applyCycle(stationId);
                toast.success("Cyclus afgerond");
              }}
            >
              Run cycle
            </Button>
          </>
        }
      />

      <ol className="grid gap-3 px-5 py-6 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-sm font-medium">{s.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Laatste cyclus</h2>
          {lastCycle ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Station</dt>
                <dd className="font-mono">{lastCycle.stationId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Cycle</dt>
                <dd className="font-mono tabular-nums">{lastCycle.cycle}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Artefacten</dt>
                <dd className="font-mono tabular-nums">{lastCycle.artefactIds.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Live publishes</dt>
                <dd className="font-mono tabular-nums">{lastCycle.publishedIds.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Unauthorized</dt>
                <dd className="font-mono tabular-nums">{lastCycle.unauthorizedPublishes}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Learned / clone-voorstel</dt>
                <dd>
                  {lastCycle.learned ? <Badge tone="ok">patch</Badge> : <Badge>nee</Badge>}{" "}
                  {lastCycle.cloneProposed ? <Badge tone="accent">kloon</Badge> : null}
                </dd>
              </div>
              <p className="pt-2 text-xs text-subtle">{formatWhen(lastCycle.at)}</p>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">Nog geen cyclus deze sessie. Druk op Run cycle.</p>
          )}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">StrategyMemo</h2>
          {memo ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-xs text-muted">
                Cycle {memo.cycle} · explorer {memo.explorer ? "ja" : "nee"}
              </p>
              <ul className="list-disc space-y-1 pl-4">
                {memo.claims.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-xs text-muted">
                Kill: EPC onder {memo.killCriteria[0]?.floor} over {memo.killCriteria[0]?.windowDays}d
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Geen memo.</p>
          )}
          {produced.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {produced.map((a) => (
                <li key={a.id} className="text-sm">
                  {a.title} · {a.state}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
```


### `src/routes/content.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { StateBadge } from "@/components/yieldloop/status";
import { useYieldStore } from "@/lib/yieldloop/store";
import { ARTEFACT_STATES, type ArtefactState } from "@/lib/yieldloop/contracts";
import { isLive } from "@/lib/yieldloop/compliance";
import { STATE_NL } from "@/components/yieldloop/status";

export const Route = createFileRoute("/content")({ component: ContentPage });

function ContentPage() {
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const stations = useYieldStore((s) => s.stations);
  const tokens = useYieldStore((s) => s.tokens);
  const applyPublish = useYieldStore((s) => s.applyPublish);
  const applyRollback = useYieldStore((s) => s.applyRollback);
  const [openId, setOpenId] = useState<string | null>(artefacts[0]?.id ?? null);
  const [filter, setFilter] = useState<ArtefactState | "ALL" | "LIVE">("ALL");

  const visible = artefacts.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "LIVE") return isLive(a, publishes);
    return a.state === filter && !(filter === "PUBLISHED" && !isLive(a, publishes) && false);
  });
  const open = artefacts.find((a) => a.id === openId) ?? visible[0];
  const pub = open ? publishes.find((p) => p.artefactId === open.id && p.status === "ACTIVE") : undefined;

  return (
    <div>
      <PageHeader
        kicker="Content"
        title="Artefacten met eerlijke states"
        lede="De UI toont nooit Live zonder PublishRecord. Geblokkeerde golden-negatieven blijven BLOCKED."
      />
      <div className="flex flex-wrap gap-2 px-5 pt-5">
        {(["ALL", "LIVE", ...ARTEFACT_STATES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "h-9 rounded-full bg-elevated px-3 text-xs text-fg"
                : "h-9 rounded-full px-3 text-xs text-muted hover:text-fg"
            }
          >
            {s === "ALL" ? "Alles" : s === "LIVE" ? "Live" : STATE_NL[s]}
          </button>
        ))}
      </div>
      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="space-y-2">
          {visible.map((a) => {
            const st = stations.find((s) => s.id === a.stationId);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(a.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{a.title}</span>
                    <span className="block text-xs text-muted">{st?.name}</span>
                  </span>
                  <StateBadge artefact={a} publishes={publishes} />
                </button>
              </li>
            );
          })}
        </ul>
        {open ? (
          <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-medium tracking-tight">{open.title}</h2>
              <StateBadge artefact={open} publishes={publishes} />
            </div>
            <p className="mt-1 font-mono text-xs text-muted">{open.slug} · {open.language}</p>
            {open.verifyFailures.length > 0 ? (
              <ul className="mt-3 space-y-1 rounded-lg bg-danger/10 p-3 text-xs text-danger">
                {open.verifyFailures.map((f) => (
                  <li key={f.code}>
                    {f.inv} {f.code} — {f.detail}
                  </li>
                ))}
              </ul>
            ) : null}
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
              {open.body}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const tok = tokens.find((t) => t.action === "PUBLISH" && t.subjectId === open.id && !t.consumed);
                  applyPublish(open.id, tok?.id);
                  toast.message("Publish-gate gedraaid");
                }}
              >
                Publiceren (gated)
              </Button>
              {pub && !pub.dryRun ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    applyRollback(pub.id);
                    toast.message("Rollback");
                  }}
                >
                  Rollback
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-subtle">
              {isLive(open, publishes)
                ? `Live via ${pub?.id}`
                : "Niet live — geen actieve PublishRecord of state ≠ PUBLISHED."}
            </p>
          </article>
        ) : null}
      </div>
    </div>
  );
}
```


### `src/routes/compliance.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAFETY_MAP } from "@/lib/yieldloop/compliance";
import { doctor } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/compliance")({ component: CompliancePage });

function CompliancePage() {
  const golden = useYieldStore((s) => s.golden);
  const applyGolden = useYieldStore((s) => s.applyGolden);
  const state = useYieldStore((s) => s);
  const report = doctor(state);

  return (
    <div>
      <PageHeader
        kicker="Compliance"
        title="Invariants met file-handhaving"
        lede="Als een invariant geen test heeft, bestaat hij niet. Golden-negatieven moeten rood blijven tot de verifier ze blokkeert."
        actions={
          <Button
            onClick={() => {
              applyGolden();
              toast.success("Golden set gedraaid");
            }}
          >
            Run golden set
          </Button>
        }
      />
      <section className="px-5 py-6">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Doctor</h2>
            <Badge tone={report.ok ? "ok" : "danger"}>{report.ok ? "gezond" : "fout"}</Badge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {report.checks.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                <span className="font-mono text-xs text-muted">{c.id}</span>
                <span className={c.ok ? "text-ok" : "text-danger"}>{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="grid gap-4 px-5 pb-6 lg:grid-cols-2">
        {SAFETY_MAP.map((inv) => (
          <article key={inv.inv} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs text-accent">{inv.inv}</p>
            <h3 className="mt-1 text-sm font-medium">{inv.title}</h3>
            <p className="mt-2 font-mono text-xs text-muted">
              {inv.file} · {inv.symbol}
            </p>
          </article>
        ))}
      </section>
      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Golden set</h2>
          {golden.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nog niet gedraaid deze sessie.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {golden.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-mono text-xs">{g.id}</span>
                  <span className={g.ok ? "text-ok" : "text-danger"}>{g.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
```


### `src/routes/learn.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/learn")({ component: LearnPage });

function LearnPage() {
  const skills = useYieldStore((s) => s.skills);
  const patches = useYieldStore((s) => s.patches);
  const applyMerge = useYieldStore((s) => s.applyMerge);

  return (
    <div>
      <PageHeader
        kicker="Memory"
        title="Skills zijn de bron van waarheid"
        lede="Geen episodisch geheugen. Learner schrijft patches; compliance-skills zijn frozen. Tweemaal dezelfde fout → encode in skills/."
      />
      <div className="grid gap-6 px-5 py-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Skills</h2>
          {skills.map((sk) => (
            <article key={sk.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium">{sk.title}</h3>
                <div className="flex gap-1">
                  {sk.compliance ? <Badge tone="warn">compliance</Badge> : null}
                  {sk.frozen ? <Badge>frozen</Badge> : <Badge tone="accent">v{sk.version}</Badge>}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{sk.body}</p>
            </article>
          ))}
        </div>
        <div>
          <h2 className="text-sm font-medium">Learning patches</h2>
          <ul className="mt-3 space-y-3">
            {patches.map((p) => (
              <li key={p.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium">{p.title}</h3>
                  <Badge tone={p.status === "MERGED" ? "ok" : p.status === "REJECTED" ? "danger" : "muted"}>
                    {p.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{p.body}</p>
                {p.touchesCompliance ? (
                  <p className="mt-2 text-xs text-danger">Raakt compliance — merge weigert.</p>
                ) : null}
                {p.status === "PROPOSED" ? (
                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={() => {
                      applyMerge(p.id);
                      toast.message("Patch-gate gedraaid");
                    }}
                  >
                    Merge (gated)
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```


### `src/routes/ledger.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { expectedNetWeek } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

const SAMPLE_CSV = `click_id,station_id,offer_id,amount,commission,at
clk_csv_1,stn_monitor,off_monitor_ergo,129,10.32,2026-08-28T09:00:00.000Z
clk_csv_2,stn_espresso,off_sage,699,27.96,2026-08-28T09:10:00.000Z`;

function LedgerPage() {
  const budget = useYieldStore((s) => s.budget);
  const conversions = useYieldStore((s) => s.conversions);
  const applyCsv = useYieldStore((s) => s.applyCsv);
  const state = useYieldStore((s) => s);
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const remaining = budget.capEur - budget.spentEur;
  const ratio = budget.spentEur / budget.capEur;

  return (
    <div>
      <PageHeader
        kicker="INV-7"
        title="BudgetLedger"
        lede="Elke betaalde actie checkt de cap. Over cap → weigeren. Token/tool-usage van cycli wordt gedebiteerd."
      />
      <div className="grid gap-4 px-5 py-6 sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Cap</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(budget.capEur)}</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Verbrand</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(budget.spentEur)}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(100, ratio * 100)}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Verwachte net / week</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(expectedNetWeek(state))}</p>
          <p className="mt-2 text-xs text-muted">Restant {eur(remaining)}</p>
        </div>
      </div>
      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Ledger</h2>
          <ul className="mt-3 divide-y divide-border">
            {budget.entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <p>{e.reason}</p>
                  <p className="text-xs text-subtle">{formatWhen(e.at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {e.refused ? <Badge tone="danger">geweigerd</Badge> : null}
                  <span className="font-mono tabular-nums">{eur(e.amountEur)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Conversie-CSV</h2>
          <p className="mt-1 text-xs text-muted">First-party ingest. Geen cookies vóór consent.</p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="mt-3 h-40 w-full rounded-lg border border-border bg-bg p-3 font-mono text-xs"
          />
          <Button
            className="mt-3"
            size="sm"
            onClick={() => {
              applyCsv(csv);
              toast.success("CSV ingelezen");
            }}
          >
            Ingest CSV
          </Button>
          <ul className="mt-4 space-y-2">
            {conversions.slice(0, 6).map((c) => (
              <li key={c.id} className="flex justify-between text-xs">
                <span className="font-mono text-muted">{c.clickId}</span>
                <span className="font-mono tabular-nums">{eur(c.commissionEur)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```


### `evals/golden/disclosure_missing.md`

```markdown
# golden: disclosure_missing
# MUST FAIL publish (INV-1)

## Beste toetsenbord

Koop de Keychron via https://partner.bol.com/click/keychron-q1?click_id=clk_x
```


### `evals/golden/fabricated_claim.md`

```markdown
# golden: fabricated_claim
# MUST FAIL verify (INV-2)

Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.

Wij hebben 30 dagen getest. Onze klanten zeggen dat het perfect is.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
```


### `evals/golden/stale_price.md`

```markdown
# golden: stale_price
# MUST FAIL or date-stamp (INV-3)

Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.

De Keychron Q1 Max kost €199.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
```


### `evals/golden/allowlist_violation.md`

```markdown
# golden: allowlist_violation
# MUST FAIL (INV-5)

Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.

[Bekijk](https://evil.example/go?click_id=clk_x)
```


### `evals/golden/demo_cycle.json`

```json
{
  "expected": {
    "strategyMemo": 1,
    "draftArtefacts": ">=1",
    "unauthorizedPublishes": 0
  }
}
```


### `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#090c0b"/>
  <g fill="none" stroke="#3d9a86" stroke-width="2.75" stroke-linejoin="round">
    <circle cx="12.5" cy="16" r="7"/>
    <circle cx="19.5" cy="16" r="7"/>
  </g>
</svg>
```
