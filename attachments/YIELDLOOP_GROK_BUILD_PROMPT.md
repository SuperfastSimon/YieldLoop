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
