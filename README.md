# YieldLoop

Affiliate-besturingssysteem. Stations zijn cellen die zichzelf klonen onder harde gates.

**Niet** een chatbot met tips. Software die een lus draait: ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden.

Repo: [github.com/SuperfastSimon/YieldLoop](https://github.com/SuperfastSimon/YieldLoop)

## Status

Publieke kernel + dashboard-preview in deze repo. **Geen live productie-URL.** GitHub Pages staat uit. Er is geen hosted SaaS.

Live-badge in de UI is alleen geldig mét `PublishRecord`. Zonder ApprovalToken is een clone een proposal, nooit een silent station.

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

Kind van een clone is altijd `T1_DRAFT`.

## Design

Ink `#090c0b` · teal `#3d9a86` · ivory `#e6eee9`. Instrument Sans + IBM Plex Mono. Geen neon, geen matrix.

## Testen

```
node --experimental-strip-types --test src/lib/yieldloop/engine.test.ts
```

## Legal

- Gebruiksvoorwaarden: [`TERMS.md`](TERMS.md)
- Compliance-gates: [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)
- Geen privacyverklaring: deze repo verzamelt geen accounts, formulieren of analytics. Persist is lokaal (`yieldloop-v1`).

`TERMS.md` is een starttemplate, geen juridisch advies. Identiteit (bedrijfsnaam, KvK, adres) is bewust leeg gelaten.

## License

Bron is zichtbaar omdat deze repo public is. Dat is **geen** open-source-licentie. Gebruik, kopiëren of herpubliceren alleen met toestemming van de eigenaar. Zie `TERMS.md`.
