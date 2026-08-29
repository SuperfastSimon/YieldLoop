import { Link } from "@tanstack/react-router";
import { CloneDialog } from "@/components/yieldloop/clone-dialog";
import { TierBadge } from "@/components/yieldloop/status";
import type { Station } from "@/lib/yieldloop/contracts";
import { eur } from "@/lib/utils";
import { cn } from "@/lib/utils";

function NodeCard({ station, highlight }: { station: Station; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg bg-elevated p-3 shadow-[var(--shadow-border)]",
        highlight && "shadow-[var(--shadow-border-hover)]",
        station.status === "FROZEN" && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/stations/$stationId"
          params={{ stationId: station.id }}
          className="min-w-0 font-medium tracking-tight text-fg hover:text-accent"
        >
          {station.name}
        </Link>
        <TierBadge tier={station.tier} />
      </div>
      <p className="mt-1 font-mono text-xs text-muted">
        gen {station.generation}
        {station.clonedFrom ? " · kloon" : " · root"} · {station.niche}
      </p>
      <p className="mt-2 font-mono text-xs tabular-nums text-muted">
        EPC {eur(station.epc)} · {eur(station.budgetSpentEur)}/{eur(station.budgetCapEur)}
      </p>
      <div className="mt-3">
        <CloneDialog station={station} compact />
      </div>
    </div>
  );
}

export function LineageTree({
  stations,
  highlightId,
}: {
  stations: Station[];
  highlightId?: string;
}) {
  const roots = stations.filter((s) => !s.parentId);
  const childrenOf = (id: string) =>
    stations.filter((s) => s.parentId === id).sort((a, b) => a.cloneIndex - b.cloneIndex);

  function Branch({ node, depth }: { node: Station; depth: number }) {
    const kids = childrenOf(node.id);
    return (
      <li className="min-w-0">
        <NodeCard station={node} highlight={node.id === highlightId} />
        {kids.length > 0 ? (
          <ul
            className={cn(
              "mt-3 space-y-3 border-l border-border pl-4",
              depth > 2 && "pl-3",
            )}
          >
            {kids.map((k) => (
              <Branch key={k.id} node={k} depth={depth + 1} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <ul className="space-y-6">
      {roots.map((r) => (
        <Branch key={r.id} node={r} depth={0} />
      ))}
    </ul>
  );
}
