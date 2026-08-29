import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYieldStore } from "@/lib/yieldloop/store";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/loop")({ component: LoopPage });

const STEPS = [
  { id: "SENSE", title: "Sense", body: "Ingest programs, offers, kosten, operator-constraints." },
  { id: "STRATEGISE", title: "Strategise", body: "Score kansen. StrategyMemo met hypotheses en kill-criteria." },
  { id: "PRODUCE", title: "Produce", body: "Disclosure eerst. Geen verzonnen specs. NL default." },
  { id: "VERIFY", title: "Verify", body: "Golden checks: disclosure, allowlist, prijzen, claims." },
  { id: "PUBLISH", title: "Publish", body: "Dry-run default. Live alleen met token of T3-envelope." },
  { id: "MEASURE", title: "Measure", body: "First-party events, CSV, last-click binnen cookie-window." },
  { id: "LEARN", title: "Learn", body: "LearningPatch, nooit stille overwrite van compliance-skills." },
  { id: "EXPAND", title: "Expand", body: "Station mag zichzelf klonen — voorstel of T4-token." },
];

function LoopPage() {
  const stations = useYieldStore((s) => s.stations);
  const lastCycle = useYieldStore((s) => s.lastCycle);
  const memos = useYieldStore((s) => s.memos);
  const artefacts = useYieldStore((s) => s.artefacts);
  const applyCycle = useYieldStore((s) => s.applyCycle);
  const [stationId, setStationId] = useState(stations[0]?.id ?? "");

  const memo = lastCycle ? memos.find((m) => m.id === lastCycle.memoId) : memos[0];
  const produced = lastCycle ? artefacts.filter((a) => lastCycle.artefactIds.includes(a.id)) : [];

  return (
    <div>
      <PageHeader
        kicker="Affiliate-loop"
        title="Acht stappen, herstartbaar"
        lede="Idempotent per cycle-key. T0 observeert, T1 schrijft concepten, T2 wacht op token, T3 auto binnen envelope, T4 mag klonen."
        actions={
          <>
            <select
              className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.tier}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                applyCycle(stationId);
                toast.success("Cyclus afgerond");
              }}
            >
              Run cycle
            </Button>
          </>
        }
      />

      <ol className="grid gap-3 px-5 py-6 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-sm font-medium">{s.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Laatste cyclus</h2>
          {lastCycle ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Station</dt>
                <dd className="font-mono">{lastCycle.stationId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Cycle</dt>
                <dd className="font-mono tabular-nums">{lastCycle.cycle}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Artefacten</dt>
                <dd className="font-mono tabular-nums">{lastCycle.artefactIds.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Live publishes</dt>
                <dd className="font-mono tabular-nums">{lastCycle.publishedIds.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Unauthorized</dt>
                <dd className="font-mono tabular-nums">{lastCycle.unauthorizedPublishes}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Learned / clone-voorstel</dt>
                <dd>
                  {lastCycle.learned ? <Badge tone="ok">patch</Badge> : <Badge>nee</Badge>}{" "}
                  {lastCycle.cloneProposed ? <Badge tone="accent">kloon</Badge> : null}
                </dd>
              </div>
              <p className="pt-2 text-xs text-subtle">{formatWhen(lastCycle.at)}</p>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">Nog geen cyclus deze sessie. Druk op Run cycle.</p>
          )}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">StrategyMemo</h2>
          {memo ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-xs text-muted">
                Cycle {memo.cycle} · explorer {memo.explorer ? "ja" : "nee"}
              </p>
              <ul className="list-disc space-y-1 pl-4">
                {memo.claims.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-xs text-muted">
                Kill: EPC onder {memo.killCriteria[0]?.floor} over {memo.killCriteria[0]?.windowDays}d
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Geen memo.</p>
          )}
          {produced.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {produced.map((a) => (
                <li key={a.id} className="text-sm">
                  {a.title} · {a.state}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
