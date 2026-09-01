import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isLive } from "@/lib/yieldloop/compliance";
import { partnerReady, verdienQuery } from "@/lib/yieldloop/links.ts";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/verdienen")({ component: VerdienenPage });

function VerdienenPage() {
  const partner = useYieldStore((s) => s.partner);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const applyPartner = useYieldStore((s) => s.applyPartner);
  const applyGoLive = useYieldStore((s) => s.applyGoLive);
  const [bol, setBol] = useState(partner.bolSiteId);
  const [awin, setAwin] = useState(partner.awinPublisherId);
  const [ttc, setTtc] = useState(partner.tradeTrackerCampaignId);
  const [tta, setTta] = useState(partner.tradeTrackerAffiliateId);
  const [copied, setCopied] = useState<string | null>(null);

  const ready = partnerReady(partner);
  const live = artefacts.filter((a) => isLive(a, publishes));
  const query = useMemo(() => verdienQuery(partner), [partner]);

  function save() {
    applyPartner({
      bolSiteId: bol,
      awinPublisherId: awin,
      tradeTrackerCampaignId: ttc,
      tradeTrackerAffiliateId: tta,
    });
    toast.success("Partner-IDs opgeslagen — live links opnieuw getagd");
  }

  async function copyLink(slug: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/p/${slug}${query}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(slug);
    toast.message("Verdien-link gekopieerd");
  }

  return (
    <div>
      <PageHeader
        kicker="Inkomen"
        title="Partner-IDs en verdien-links"
        lede="YieldLoop keert zelf geen geld uit. Bol, Awin en TradeTracker betalen commissie als een bezoeker via een getagde link koopt. Zet hier jouw eigen IDs. Deel daarna de publieke verdien-link van een live artikel."
      />

      <section className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <h2 className="text-sm font-medium">Jouw netwerk-IDs</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Alleen IDs die jij zelf in het partnerportaal hebt. Geen secrets, geen API-keys — ze
            komen in de publieke URL te staan, net als bij elke affiliate-link.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bol">Bol site-id</Label>
              <Input
                id="bol"
                name="bol"
                value={bol}
                onChange={(e) => setBol(e.target.value)}
                placeholder="bijv. 1234567"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awin">Awin publisher-id</Label>
              <Input
                id="awin"
                name="awin"
                value={awin}
                onChange={(e) => setAwin(e.target.value)}
                placeholder="bijv. 890123"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ttc">TradeTracker campaign-id</Label>
              <Input
                id="ttc"
                name="ttc"
                value={ttc}
                onChange={(e) => setTtc(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tta">TradeTracker affiliate-id</Label>
              <Input
                id="tta"
                name="tta"
                value={tta}
                onChange={(e) => setTta(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button type="submit">Opslaan en taggen</Button>
            <p className="text-xs text-muted">
              {ready ? "Minimaal één netwerk is gezet." : "Nog geen ID — geen commissie."}
            </p>
          </div>
        </form>

        <aside className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Hoe je écht verdient</h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <li>
              <span className="font-medium text-fg">1. IDs</span> — uit Bol Partnerprogramma, Awin
              of TradeTracker.
            </li>
            <li>
              <span className="font-medium text-fg">2. Live artikel</span> — alleen mét
              PublishRecord. Gebruik Zet live hieronder of onder Content.
            </li>
            <li>
              <span className="font-medium text-fg">3. Deel de verdien-link</span> — die draagt jouw
              IDs mee, zodat bezoekers op een ander apparaat nog steeds getagd uitkomen.
            </li>
            <li>
              <span className="font-medium text-fg">4. Conversies</span> — plak de CSV van het
              netwerk in Ledger. YieldLoop rekent EPC; het netwerk keert uit.
            </li>
          </ol>
        </aside>
      </section>

      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Live artikelen</h2>
          {live.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nog geen live PublishRecord.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {live.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="font-mono text-xs text-muted">/p/{a.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link to="/p/$slug" params={{ slug: a.slug }}>
                        Open publiek
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copyLink(a.slug)}>
                      {copied === a.slug ? <Check className="size-4" /> : <Copy className="size-4" />}
                      Kopieer verdien-link
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-8 text-sm font-medium">Nog niet live — Zet live</h3>
          <p className="mt-1 text-xs text-muted">
            Operator-actie: YieldLoop geeft zichzelf een PUBLISH-token. Station-autonomy blijft
            gelijk. Zonder partner-IDs weigert de gate.
          </p>
          <ul className="mt-3 space-y-2">
            {artefacts
              .filter((a) => !isLive(a, publishes) && a.state !== "BLOCKED" && a.state !== "FROZEN")
              .slice(0, 6)
              .map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg bg-elevated px-3 py-2">
                  <span className="truncate text-sm">{a.title}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      applyGoLive(a.id);
                      toast.message(ready ? "Live-gate gedraaid" : "Eerst partner-IDs opslaan");
                    }}
                  >
                    Zet live
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
