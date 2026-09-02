# YieldLoop — OFFLINE

**This product is offline as of 2026-09-02.**

No live stations. No production affiliate redirects. No Vercel project on Team Skipper. Source remains in this repo for later work; it is not a running service.

See `OFFLINE.md`.

---

Affiliate-besturingssysteem. Stations zijn cellen die zichzelf klonen onder harde gates.

**Niet** een chatbot met tips. Software die een lus draait: ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden.

Repo: [github.com/SuperfastSimon/YieldLoop](https://github.com/SuperfastSimon/YieldLoop)

YieldLoop keert zelf geen geld uit. Commissies komen van Bol, Awin of TradeTracker via getagde links — alleen als een operator ooit weer live zet.

## Voor een nieuw Grok-gesprek

1. Open Grok Build.
2. Zeg: *Neem YieldLoop over vanaf `https://github.com/SuperfastSimon/YieldLoop`. Lees `START_HERE.md` eerst.*
3. Of plak `START_HERE.md` + clone de repo.

Volledige bron-dump (één markdown): `attachments/YIELDLOOP_OVERDRACHT.md`.

## Verdienen

Disabled while offline. Partner-IDs, `/p/{slug}` and `/go/{click_id}` are not a live income path.

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

Kind van een clone is altijd `T1_DRAFT`. Zonder ApprovalToken = proposal, nooit silent station. Live-badge alleen mét `PublishRecord` — and not while this repo is marked offline.

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
