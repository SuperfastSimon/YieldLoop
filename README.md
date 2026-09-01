# YieldLoop

Affiliate-besturingssysteem. Stations zijn cellen die zichzelf klonen onder harde gates.

**Niet** een chatbot met tips. Software die een lus draait: ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden.

Repo: [github.com/SuperfastSimon/YieldLoop](https://github.com/SuperfastSimon/YieldLoop)

YieldLoop keert zelf geen geld uit. Commissies komen van Bol, Awin of TradeTracker via getagde links.

## Voor een nieuw Grok-gesprek

1. Open Grok Build.
2. Zeg: *Neem YieldLoop over vanaf `https://github.com/SuperfastSimon/YieldLoop`. Lees `START_HERE.md` eerst.*
3. Of plak `START_HERE.md` + clone de repo.

Volledige bron-dump (één markdown): `attachments/YIELDLOOP_OVERDRACHT.md`.

## Verdienen

1. Vul jouw partner-IDs in onder **Verdienen** (Bol site-id, Awin publisher-id, TradeTracker).
2. Zet een artefact live (operator-token, geen silent T3).
3. Deel de **verdien-link** van `/p/{slug}` — die draagt IDs mee zodat bezoekers op een ander apparaat nog getagd uitkomen.
4. Clicks gaan first-party via `/go/{click_id}` naar een allowlisted merchant.
5. Plak de conversie-CSV van het netwerk in Ledger.

Zonder IDs is er geen commissie. Live zonder `PublishRecord` bestaat niet.

## Kernel

| Pad | Rol |
| --- | --- |
| `src/lib/yieldloop/contracts.ts` | Closed enums, YieldState |
| `src/lib/yieldloop/compliance.ts` | INV-1…6, honest Live |
| `src/lib/yieldloop/engine.ts` | Clone, cycle, budget, kill-switch, goLive |
| `src/lib/yieldloop/links.ts` | Partner-tag, `/go`, verdien-query |
| `src/lib/yieldloop/fixtures.ts` | Seed + golden bodies |
| `src/lib/yieldloop/store.ts` | Zustand persist `yieldloop-v1` |
| `src/lib/yieldloop/engine.test.ts` | Pinning tests inclusief income path |

Kind van een clone is altijd `T1_DRAFT`. Zonder ApprovalToken = proposal, nooit silent station. Live-badge alleen mét `PublishRecord`.

## Design

Ink `#090c0b` · teal `#3d9a86` · ivory `#e6eee9`. Instrument Sans + IBM Plex Mono. Geen neon, geen matrix.

Zie ook `UX_NOTES.md`.

## Testen

```
node --experimental-strip-types --test src/lib/yieldloop/engine.test.ts
```

Ship-gate: `.github/workflows/mvp-ship-gate.yml` pint `SuperfastSimon/mvp-ship-gate@c81a1ab97d8cefa260cbf61db72331b83b4f2ca4`.

## License

Privé-demo tenzij anders afgesproken. Voorwaarden: `TERMS.md`. Privacy: `PRIVACY.md`.
