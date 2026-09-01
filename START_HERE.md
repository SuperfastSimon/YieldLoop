# START HERE — YieldLoop voor een nieuw Grok-gesprek

Clone of lees deze repo: https://github.com/SuperfastSimon/YieldLoop

Je neemt YieldLoop over. Zero prior context. Deze repo is de waarheid.

YieldLoop is een **affiliate-operating-system** (geen chatbot, geen game).
Een **station** is een cel. Stations **klonen zichzelf** onder harde gates.
Kernel = TypeScript in `src/lib/yieldloop/`. Auth UIT. Database UIT.
Persist-key: `yieldloop-v1`.

Inkomen: operator vult partner-IDs onder `/verdienen`. `goLive` geeft een PUBLISH-token
en tagt links. Publiek artikel = `/p/{slug}` alleen mét PublishRecord. Click-out =
`/go/{clickId}` naar allowlisted merchant. YieldLoop betaalt niet; het netwerk wel.

Lees daarna in deze volgorde:

1. `docs/HANDOVER.md`
2. `docs/SAFETY.md`
3. `src/lib/yieldloop/contracts.ts`
4. `src/lib/yieldloop/engine.ts` (`evaluateClone`, `executeClone`, `runCycle`, `goLive`)
5. `src/lib/yieldloop/links.ts`

Behoud het productcontract. Wijzig geen invariant zonder pinning-test in
`src/lib/yieldloop/engine.test.ts` (moeten groen blijven).

Vraag de gebruiker wat de volgende stap is als dat niet in hun bericht staat.

Volledige dump in één bestand: `attachments/YIELDLOOP_OVERDRACHT.md`.
Oorspronkelijke brief: `attachments/YIELDLOOP_GROK_BUILD_PROMPT.md`.
Korte prompt: `attachments/YIELDLOOP_NIEUW_GESPREK.md`.
