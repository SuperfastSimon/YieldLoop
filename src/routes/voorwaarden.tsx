import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voorwaarden")({ component: VoorwaardenPage });

function VoorwaardenPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed">
      <p className="text-xs font-medium tracking-wide text-accent">Juridisch</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight">Voorwaarden</h1>
      <p className="mt-2 text-xs text-muted">Sjabloon — geen juridisch advies. Laatst bijgewerkt: 1 september 2026.</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">1. Wie</h2>
        <p className="text-muted">
          Deze voorwaarden gelden voor het gebruik van YieldLoop, een affiliate-besturingssysteem.
          Tot een bedrijfsnaam is gepubliceerd, is de operator de eigenaar van de repository
          github.com/SuperfastSimon/YieldLoop.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">2. De dienst</h2>
        <p className="text-muted">
          YieldLoop helpt een operator affiliate-artikelen te toetsen, gated te publiceren en
          clicks door te zetten naar Bol, Awin of TradeTracker. YieldLoop keert zelf geen
          commissie uit. Uitbetaling loopt via het partnerprogramma waar jij een account hebt.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">3. Affiliate-disclosure</h2>
        <p className="text-muted">
          Publieke artikelen bevatten affiliate-links. Bij aankoop via die links kan de operator
          een commissie ontvangen. Dat kost de bezoeker niets extra. Die disclosure staat bovenaan
          elk live artikel (INV-1).
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">4. Acceptabel gebruik</h2>
        <p className="text-muted">
          Geen verboden verticals (gezondheidsclaims als kuur, gegarandeerd inkomen, wapens,
          illegaal). Geen verzonnen testimonials. Geen tracking vóór consent. De verifier weigert
          die artefacten.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">5. Aansprakelijkheid</h2>
        <p className="text-muted">
          YieldLoop wordt geleverd zoals het is. Voor zover dwingend recht (inclusief Nederlands
          en EU-consumentenrecht) dat toelaat, is de operator niet aansprakelijk voor indirecte
          schade of misgelopen commissie. Dwingende consumentenrechten blijven staan.
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-medium">6. Recht en contact</h2>
        <p className="text-muted">
          Nederlands recht, onverminderd dwingende consumentenbescherming. Contact via GitHub
          Issues op SuperfastSimon/YieldLoop. KvK en postadres zijn voor deze MVP niet
          gepubliceerd.
        </p>
      </section>
    </article>
  );
}
