# Privacy — YieldLoop

**Sjabloon — geen juridisch advies.** Laatst bijgewerkt: 2026-09-01.

YieldLoop heeft geen accounts en in deze MVP geen server-database.

## Wat we bewaren

Operator-staat (stations, artefacten, partner-IDs, click-log) staat in de browser (localStorage, sleutel `yieldloop-v1`).

## Partner-IDs

Bol site-id, Awin publisher-id en TradeTracker-IDs zijn geen wachtwoorden. Ze staan in affiliate-URLs. Een gedeelde verdien-link kan ze als query-parameter meenemen zodat bezoekers op een ander apparaat getagd uitkomen.

## Clicks

Een first-party `/go/{click_id}` slaat een ClickEvent op in dezelfde browser: click_id, station, artefact, tijdstip. Geen IP, geen e-mail, geen third-party pixel, geen cookie vóór consent.

## Geen trackers

Geen analytics-suite, geen cookiemelding. Wis site-gegevens in de browser of gebruik Reset demo. Contact: GitHub Issues op SuperfastSimon/YieldLoop.
