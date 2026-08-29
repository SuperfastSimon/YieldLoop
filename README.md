# YieldLoop

Affiliate-besturingssysteem. Stations zijn cellen die zichzelf klonen onder harde gates.

**Niet** een chatbot met tips. Software die een lus draait: ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden.

Repo: [github.com/SuperfastSimon/YieldLoop](https://github.com/SuperfastSimon/YieldLoop)

## Voor een nieuw Grok-gesprek

1. Open Grok Build.
2. Zeg: *Neem YieldLoop over vanaf `https://github.com/SuperfastSimon/YieldLoop`. Lees `START_HERE.md` eerst.*
3. Of plak `START_HERE.md` + clone de repo.

Volledige bron-dump (één markdown): `attachments/YIELDLOOP_OVERDRACHT.md`.

## Kernel

| Pad | Rol |
| --- | --- |
| `src/lib/yieldloop/contracts.ts` | Closed enums, YieldState |
| `src/lib/yieldloop/compliance.ts` | INV-1…6, honest Live |
| `src/lib/yieldloop/engine.ts` | Clone, cycle, budget, kill-switch |
| `src/lib/yieldloop/fixtures.ts` | Seed + golden bodies |
| `src/lib/yieldloop/store.ts` | Zustand persist `yieldloop-v1` |
| `src/lib/yieldloop/engine.test.ts` | 21 pinning tests |

Kind van een clone is altijd `T1_DRAFT`. Zonder ApprovalToken = proposal, nooit silent station. Live-badge alleen mét `PublishRecord`.

## Design

Ink `#090c0b` · teal `#3d9a86` · ivory `#e6eee9`. Instrument Sans + IBM Plex Mono. Geen neon, geen matrix.

## Testen

```
node --experimental-strip-types --test src/lib/yieldloop/engine.test.ts
```

## License

Privé-demo tenzij anders afgesproken.
