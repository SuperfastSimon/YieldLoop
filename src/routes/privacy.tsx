import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed">
      <p className="text-xs font-medium tracking-wide text-accent">Juridisch</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight">Privacy</h1>
      <p className="mt-2 text-xs text-muted">Sjabloon — geen juridisch advies. Laatst bijgewerkt: 1 september 2026.</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">Wat we bewaren</h2>
        <p className="text-muted">
          YieldLoop heeft geen accounts. Er is geen server-database in deze MVP. Operator-staat
          (stations, artefacten, partner-IDs, click-log) staat in de browser van de operator
          (localStorage, sleutel yieldloop-v1).
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">Partner-IDs</h2>
        <p className="text-muted">
          Bol site-id, Awin publisher-id en TradeTracker-IDs zijn geen wachtwoorden. Ze staan in
          affiliate-URLs. Een gedeelde verdien-link kan ze als query-parameter meenemen (bol, awin,
          ttc, tta) zodat bezoekers op een ander apparaat nog steeds getagd uitkomen.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">Clicks</h2>
        <p className="text-muted">
          Een first-party /go/click_id slaat een ClickEvent op in dezelfde browser: click_id,
          station, artefact, tijdstip. Geen IP, geen e-mail, geen third-party pixel, geen cookie
          vóór consent (INV-4).
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">Geen trackers</h2>
        <p className="text-muted">
          Geen Google Analytics, geen Meta-pixel, geen cookiemelding. Als dat ooit verandert,
          hoort daar consent bij.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">Rechten</h2>
        <p className="text-muted">
          Wis de site-gegevens in je browser om de lokale staat te verwijderen, of gebruik Reset
          demo in Commando. Contact via GitHub Issues op SuperfastSimon/YieldLoop.
        </p>
      </section>
    </article>
  );
}
