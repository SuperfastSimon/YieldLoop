# UX notes — YieldLoop

## Design

Ink `#090c0b`, surface `#111614`, teal accent `#3d9a86`, ivory `#e6eee9`. Instrument Sans + IBM Plex Mono. Geen neon, geen matrix, geen gradient-blobs.

## Honesty

De UI zegt nooit Live zonder actieve `PublishRecord`. Dry-run is Approved, niet Live. Clone zonder token is een voorstel.

## Verdienen

Partner-IDs staan onder Verdienen. Publieke artikelen leven op `/p/{slug}` met first-party `/go/{click_id}` uitstappen. De verdien-link draagt IDs mee in de query zodat een bezoeker op een ander apparaat nog commissie kan triggeren.

## Motion

Korte 150ms kleur-overgangen. `prefers-reduced-motion` zet animaties uit. Tap targets 44px op de mobiele balk.

## Chrome

Publieke routes (`/p`, `/go`, voorwaarden, privacy) krijgen een dunne header zonder kill-switch. Dashboard houdt de commandokant.
