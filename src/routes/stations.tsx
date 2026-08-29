import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { LineageTree } from "@/components/yieldloop/lineage";
import { TierBadge } from "@/components/yieldloop/status";
import { Button } from "@/components/ui/button";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur } from "@/lib/utils";
import { Play } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/stations")({ component: StationsPage });

function StationsPage() {
  const stations = useYieldStore((s) => s.stations);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyFreeze = useYieldStore((s) => s.applyFreeze);

  return (
    <div>
      <PageHeader
        kicker="Vloot"
        title="Ieder station kan zichzelf klonen"
        lede="Een kloon is celdeling: skills worden gekopieerd, PolicyEnvelope mag alleen strakker, autonomy valt terug naar T1, budget wordt gesneden van de ouder. Zonder token blijft het een voorstel."
      />
      <div className="grid gap-6 px-5 py-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          {stations.map((st) => (
            <article key={st.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    to="/stations/$stationId"
                    params={{ stationId: st.id }}
                    className="text-base font-medium hover:text-accent"
                  >
                    {st.name}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {st.id} · gen {st.generation}
                    {st.parentId ? " · kind" : " · root"}
                  </p>
                </div>
                <TierBadge tier={st.tier} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted">Niche</dt>
                  <dd>{st.niche}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">EPC</dt>
                  <dd className="font-mono tabular-nums">{eur(st.epc)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Budget</dt>
                  <dd className="font-mono tabular-nums">
                    {eur(st.budgetSpentEur)}/{eur(st.budgetCapEur)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Cycli</dt>
                  <dd className="font-mono tabular-nums">{st.cycleCount}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <CloneDialog station={st} compact />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    applyCycle(st.id);
                    toast.success(`Cyclus ${st.name}`);
                  }}
                >
                  <Play className="size-3.5" />
                  Cycle
                </Button>
                {st.status !== "FROZEN" ? (
                  <Button size="sm" variant="ghost" onClick={() => applyFreeze(st.id)}>
                    Bevries
                  </Button>
                ) : (
                  <span className="self-center text-xs text-danger">Bevroren</span>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Lineage-boom</h2>
          <p className="mt-1 mb-5 text-xs text-muted">Klonen nesten onder hun ouder. Max generatie 4, max 12 stations.</p>
          <LineageTree stations={stations} />
        </div>
      </div>
    </div>
  );
}
