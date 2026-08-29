import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { LineageTree } from "@/components/yieldloop/lineage";
import { StateBadge, TierBadge } from "@/components/yieldloop/status";
import { Button } from "@/components/ui/button";
import { AUTONOMY_TIERS } from "@/lib/yieldloop/contracts";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/stations/$stationId")({ component: StationDetail });

function StationDetail() {
  const { stationId } = Route.useParams();
  const stations = useYieldStore((s) => s.stations);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const memos = useYieldStore((s) => s.memos);
  const clones = useYieldStore((s) => s.clones);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const applyTier = useYieldStore((s) => s.applyTier);
  const applyFreeze = useYieldStore((s) => s.applyFreeze);
  const station = stations.find((s) => s.id === stationId);

  if (!station) {
    return (
      <div className="px-5 py-10">
        <p className="text-muted">Station niet gevonden.</p>
        <Link to="/stations" className="mt-3 inline-block text-sm text-accent">
          Terug naar vloot
        </Link>
      </div>
    );
  }

  const kids = stations.filter((s) => s.parentId === station.id);
  const parent = station.parentId ? stations.find((s) => s.id === station.parentId) : undefined;
  const ownArts = artefacts.filter((a) => a.stationId === station.id);
  const ownMemos = memos.filter((m) => m.stationId === station.id);

  return (
    <div>
      <PageHeader
        kicker={station.clonedFrom ? `Kloon · gen ${station.generation}` : `Root · gen 0`}
        title={station.name}
        lede={`${station.niche} · ${station.language} · ${station.channel}. Policy ${station.policy.hash}.`}
        actions={
          <>
            <CloneDialog station={station} />
            <Button
              variant="secondary"
              onClick={() => {
                applyCycle(station.id);
                toast.success("Cyclus gedraaid");
              }}
            >
              Cycle
            </Button>
          </>
        }
      />

      <div className="grid gap-4 px-5 py-6 lg:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Autonomy</p>
          <div className="mt-2">
            <TierBadge tier={station.tier} />
          </div>
          <select
            className="mt-3 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
            value={station.tier}
            onChange={(e) => applyTier(station.id, e.target.value as (typeof AUTONOMY_TIERS)[number])}
          >
            {AUTONOMY_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-subtle">T3+ vereist operator-token.</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Budget</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">
            {eur(station.budgetSpentEur)}
            <span className="text-sm text-muted"> / {eur(station.budgetCapEur)}</span>
          </p>
          <p className="mt-2 text-xs text-muted">Reserve bij kloon {eur(station.policy.minParentReserveEur)}</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Performance</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(station.epc)} EPC</p>
          <p className="mt-2 text-xs text-muted">
            {station.clicks} clicks · {station.conversions} conv · {station.cycleCount} cycli
          </p>
        </div>
      </div>

      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Lineage</h2>
          {parent ? (
            <p className="mt-2 text-sm text-muted">
              Ouder:{" "}
              <Link to="/stations/$stationId" params={{ stationId: parent.id }} className="text-accent">
                {parent.name}
              </Link>
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">Dit is een root-station.</p>
          )}
          <p className="mt-1 text-sm text-muted">{kids.length} directe klonen.</p>
          <div className="mt-4">
            <LineageTree
              stations={stations.filter((s) => s.id === station.id || s.lineage.includes(station.id) || s.parentId === station.id || station.lineage.includes(s.id) || s.id === station.parentId)}
              highlightId={station.id}
            />
          </div>
          <Button className="mt-4" variant="ghost" size="sm" onClick={() => applyFreeze(station.id)}>
            Bevries actor (INV-8)
          </Button>
        </div>

        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Artefacten</h2>
          <ul className="mt-3 divide-y divide-border">
            {ownArts.length === 0 ? (
              <li className="py-3 text-sm text-muted">Nog geen artefacten. Draai een cyclus.</li>
            ) : (
              ownArts.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{a.title}</p>
                    <p className="font-mono text-xs text-subtle">{a.slug}</p>
                  </div>
                  <StateBadge artefact={a} publishes={publishes} />
                </li>
              ))
            )}
          </ul>
          <h2 className="mt-6 text-sm font-medium">Strategy memo’s</h2>
          <ul className="mt-3 space-y-3">
            {ownMemos.slice(0, 3).map((m) => (
              <li key={m.id} className="rounded-lg bg-elevated p-3">
                <p className="text-xs text-muted">
                  Cycle {m.cycle} · {formatWhen(m.createdAt)}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                  {m.claims.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-subtle">
            {clones.filter((c) => c.parentId === station.id).length} clone-records vanuit dit station
          </p>
        </div>
      </div>
    </div>
  );
}
