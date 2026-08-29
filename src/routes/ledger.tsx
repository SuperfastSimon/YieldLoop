import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { expectedNetWeek } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";
import { eur, formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

const SAMPLE_CSV = `click_id,station_id,offer_id,amount,commission,at
clk_csv_1,stn_monitor,off_monitor_ergo,129,10.32,2026-08-28T09:00:00.000Z
clk_csv_2,stn_espresso,off_sage,699,27.96,2026-08-28T09:10:00.000Z`;

function LedgerPage() {
  const budget = useYieldStore((s) => s.budget);
  const conversions = useYieldStore((s) => s.conversions);
  const applyCsv = useYieldStore((s) => s.applyCsv);
  const state = useYieldStore((s) => s);
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const remaining = budget.capEur - budget.spentEur;
  const ratio = budget.spentEur / budget.capEur;

  return (
    <div>
      <PageHeader
        kicker="INV-7"
        title="BudgetLedger"
        lede="Elke betaalde actie checkt de cap. Over cap → weigeren. Token/tool-usage van cycli wordt gedebiteerd."
      />
      <div className="grid gap-4 px-5 py-6 sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Cap</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(budget.capEur)}</p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Verbrand</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(budget.spentEur)}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(100, ratio * 100)}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Verwachte net / week</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{eur(expectedNetWeek(state))}</p>
          <p className="mt-2 text-xs text-muted">Restant {eur(remaining)}</p>
        </div>
      </div>
      <div className="grid gap-6 px-5 pb-10 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Ledger</h2>
          <ul className="mt-3 divide-y divide-border">
            {budget.entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <p>{e.reason}</p>
                  <p className="text-xs text-subtle">{formatWhen(e.at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {e.refused ? <Badge tone="danger">geweigerd</Badge> : null}
                  <span className="font-mono tabular-nums">{eur(e.amountEur)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Conversie-CSV</h2>
          <p className="mt-1 text-xs text-muted">First-party ingest. Geen cookies vóór consent.</p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="mt-3 h-40 w-full rounded-lg border border-border bg-bg p-3 font-mono text-xs"
          />
          <Button
            className="mt-3"
            size="sm"
            onClick={() => {
              applyCsv(csv);
              toast.success("CSV ingelezen");
            }}
          >
            Ingest CSV
          </Button>
          <ul className="mt-4 space-y-2">
            {conversions.slice(0, 6).map((c) => (
              <li key={c.id} className="flex justify-between text-xs">
                <span className="font-mono text-muted">{c.clickId}</span>
                <span className="font-mono tabular-nums">{eur(c.commissionEur)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
