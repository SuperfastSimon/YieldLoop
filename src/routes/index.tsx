import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/AppShell";
import { LineageTree } from "@/components/yieldloop/lineage";
import { StateBadge, TierBadge } from "@/components/yieldloop/status";
import { expectedNetWeek } from "@/lib/yieldloop/engine";
import { partnerReady } from "@/lib/yieldloop/links.ts";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Command });

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function Command() {
  const stations = useYieldStore((s) => s.stations);
  const budget = useYieldStore((s) => s.budget);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const proposals = useYieldStore((s) => s.proposals);
  const events = useYieldStore((s) => s.events);
  const partner = useYieldStore((s) => s.partner);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyGolden = useYieldStore((s) => s.applyGolden);
  const applyApprove = useYieldStore((s) => s.applyApprove);
  const applyReject = useYieldStore((s) => s.applyReject);
  const applyReset = useYieldStore((s) => s.applyReset);
  const state = useYieldStore((s) => s);
  const ready = partnerReady(partner);

  const live = artefacts.filter((a) => a.state === "PUBLISHED" && publishes.some((p) => p.artefactId === a.id && p.status === "ACTIVE" && !p.dryRun));
  const pending = proposals.filter((p) => p.status === "PROPOSED");
  const blocked = artefacts.filter((a) => a.state === "BLOCKED");

  return (
    <div>
      <PageHeader
        kicker="Commando"
        title="Affiliate-stations die zichzelf klonen"
        lede="YieldLoop draait de lus ontdekken → kiezen → produceren → toetsen → publiceren (gated) → meten → leren → uitbreiden. Commissies komen van Bol, Awin of TradeTracker — niet van YieldLoop."
        actions={
          <>
            <Button
              onClick={() => {
                applyCycle("stn_thuiswerk");
                toast.success("Demo-cyclus op NL Thuiswerk afgerond");
              }}
            >
              <Play className="size-4" />
              Demo-cyclus
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                applyGolden();
                toast.message("Golden set gedraaid");
              }}
            >
              <ShieldCheck className="size-4" />
              Golden set
            </Button>
            <Button variant="ghost" onClick={() => applyReset()}>
              Reset demo
            </Button>
          </>
        }
      />

      <section className="px-5 pt-6">
        {ready ? (
          <Link
            to="/verdienen"
            className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-accent">Verdienen</p>
              <p className="mt-1 text-sm font-medium">Partner-IDs staan. Kopieer een verdien-link van een live artikel.</p>
              <p className="mt-1 text-xs text-muted">Bezoekers op een ander apparaat hebben die link nodig voor tagging.</p>
            </div>
            <span className="text-xs text-accent">Open Verdienen →</span>
          </Link>
        ) : (
          <Link
            to="/verdienen"
            className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-accent">Nog geen commissie</p>
              <p className="mt-1 text-sm font-medium">Zet Bol, Awin of TradeTracker-IDs om links te taggen</p>
              <p className="mt-1 text-xs text-muted">YieldLoop betaalt niet. Het netwerk betaalt bij aankoop via jouw ID.</p>
            </div>
            <span className="text-xs text-accent">Naar Verdienen →</span>
          </Link>
        )}
      </section>

      <section className="grid gap-3 px-5 py-6 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Verwachte net / week"
          value={eur(expectedNetWeek(state))}
          hint="EPC × verkeer, station-som"
        />
        <Kpi
          label="Budget verbrand"
          value={`${eur(budget.spentEur)}`}
          hint={`Cap ${eur(budget.capEur)} · INV-7`}
        />
        <Kpi label="Stations" value={String(stations.length)} hint={`${stations.filter((s) => s.clonedFrom).length} klonen`} />
        <Kpi
          label="Live / geblokkeerd"
          value={`${live.length} / ${blocked.length}`}
          hint="Live alleen mét PublishRecord"
        />
      </section>

      <section className="grid gap-6 px-5 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Lineage</h2>
            <Link to="/stations" className="text-xs text-accent hover:underline">
              Alle stations
            </Link>
          </div>
          <LineageTree stations={stations} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Wachtende goedkeuringen</h2>
            <ul className="mt-4 space-y-3">
              {pending.length === 0 ? (
                <li className="text-sm text-muted">Geen open voorstellen.</li>
              ) : (
                pending.map((p) => (
                  <li key={p.id} className="rounded-lg bg-elevated p-3">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="mt-1 text-xs text-muted">{p.rationale}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => applyApprove(p.id)}>
                        Goedkeuren
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => applyReject(p.id)}>
                        Afwijzen
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Laatste events</h2>
            <ol className="mt-4 space-y-3">
              {events.slice(0, 6).map((e) => (
                <li key={e.id} className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs text-accent">{e.type}</span>
                  <span className="text-sm">{e.detail}</span>
                  <span className="text-xs text-subtle">{formatWhen(e.at)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Recent artefact</h2>
          <ul className="mt-4 divide-y divide-border">
            {artefacts.slice(0, 4).map((a) => {
              const st = stations.find((s) => s.id === a.stationId);
              return (
                <li key={a.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted">{st?.name} · {a.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {st ? <TierBadge tier={st.tier} /> : null}
                    <StateBadge artefact={a} publishes={publishes} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
