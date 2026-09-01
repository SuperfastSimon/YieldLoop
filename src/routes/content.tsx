import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { StateBadge } from "@/components/yieldloop/status";
import { useYieldStore } from "@/lib/yieldloop/store";
import { ARTEFACT_STATES, type ArtefactState } from "@/lib/yieldloop/contracts";
import { isLive } from "@/lib/yieldloop/compliance";
import { partnerReady } from "@/lib/yieldloop/links.ts";
import { STATE_NL } from "@/components/yieldloop/status";

export const Route = createFileRoute("/content")({ component: ContentPage });

function ContentPage() {
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const stations = useYieldStore((s) => s.stations);
  const tokens = useYieldStore((s) => s.tokens);
  const partner = useYieldStore((s) => s.partner);
  const applyPublish = useYieldStore((s) => s.applyPublish);
  const applyRollback = useYieldStore((s) => s.applyRollback);
  const applyGoLive = useYieldStore((s) => s.applyGoLive);
  const [openId, setOpenId] = useState<string | null>(artefacts[0]?.id ?? null);
  const [filter, setFilter] = useState<ArtefactState | "ALL" | "LIVE">("ALL");
  const ready = partnerReady(partner);

  const visible = artefacts.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "LIVE") return isLive(a, publishes);
    return a.state === filter;
  });
  const open = artefacts.find((a) => a.id === openId) ?? visible[0];
  const pub = open ? publishes.find((p) => p.artefactId === open.id && p.status === "ACTIVE") : undefined;
  const live = open ? isLive(open, publishes) : false;

  return (
    <div>
      <PageHeader
        kicker="Content"
        title="Artefacten met eerlijke states"
        lede="De UI toont nooit Live zonder PublishRecord. Zet live is een operator-actie: token + getagde links. Zonder partner-IDs weigert de gate."
      />
      <div className="flex flex-wrap gap-2 px-5 pt-5">
        {(["ALL", "LIVE", ...ARTEFACT_STATES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "h-9 rounded-full bg-elevated px-3 text-xs text-fg"
                : "h-9 rounded-full px-3 text-xs text-muted hover:text-fg"
            }
          >
            {s === "ALL" ? "Alles" : s === "LIVE" ? "Live" : STATE_NL[s]}
          </button>
        ))}
      </div>
      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="space-y-2">
          {visible.map((a) => {
            const st = stations.find((s) => s.id === a.stationId);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(a.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{a.title}</span>
                    <span className="block text-xs text-muted">{st?.name}</span>
                  </span>
                  <StateBadge artefact={a} publishes={publishes} />
                </button>
              </li>
            );
          })}
        </ul>
        {open ? (
          <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-medium tracking-tight">{open.title}</h2>
              <StateBadge artefact={open} publishes={publishes} />
            </div>
            <p className="mt-1 font-mono text-xs text-muted">
              {open.slug} · {open.language}
            </p>
            {open.verifyFailures.length > 0 ? (
              <ul className="mt-3 space-y-1 rounded-lg bg-danger/10 p-3 text-xs text-danger">
                {open.verifyFailures.map((f) => (
                  <li key={f.code}>
                    {f.inv} {f.code} — {f.detail}
                  </li>
                ))}
              </ul>
            ) : null}
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
              {open.body}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  applyGoLive(open.id);
                  toast.message(ready ? "Live-gate gedraaid" : "Eerst partner-IDs onder Verdienen");
                }}
              >
                Zet live
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const tok = tokens.find((t) => t.action === "PUBLISH" && t.subjectId === open.id && !t.consumed);
                  applyPublish(open.id, tok?.id);
                  toast.message("Publish-gate gedraaid");
                }}
              >
                Publiceren (gated)
              </Button>
              {live ? (
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/p/$slug" params={{ slug: open.slug }}>
                    Open publiek
                  </Link>
                </Button>
              ) : null}
              {pub && !pub.dryRun ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    applyRollback(pub.id);
                    toast.message("Rollback");
                  }}
                >
                  Rollback
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-subtle">
              {live
                ? `Live via ${pub?.id}`
                : "Niet live — geen actieve PublishRecord of state ≠ PUBLISHED."}
            </p>
          </article>
        ) : null}
      </div>
    </div>
  );
}
