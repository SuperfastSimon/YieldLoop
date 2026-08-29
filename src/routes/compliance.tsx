import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAFETY_MAP } from "@/lib/yieldloop/compliance";
import { doctor } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/compliance")({ component: CompliancePage });

function CompliancePage() {
  const golden = useYieldStore((s) => s.golden);
  const applyGolden = useYieldStore((s) => s.applyGolden);
  const state = useYieldStore((s) => s);
  const report = doctor(state);

  return (
    <div>
      <PageHeader
        kicker="Compliance"
        title="Invariants met file-handhaving"
        lede="Als een invariant geen test heeft, bestaat hij niet. Golden-negatieven moeten rood blijven tot de verifier ze blokkeert."
        actions={
          <Button
            onClick={() => {
              applyGolden();
              toast.success("Golden set gedraaid");
            }}
          >
            Run golden set
          </Button>
        }
      />
      <section className="px-5 py-6">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Doctor</h2>
            <Badge tone={report.ok ? "ok" : "danger"}>{report.ok ? "gezond" : "fout"}</Badge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {report.checks.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                <span className="font-mono text-xs text-muted">{c.id}</span>
                <span className={c.ok ? "text-ok" : "text-danger"}>{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="grid gap-4 px-5 pb-6 lg:grid-cols-2">
        {SAFETY_MAP.map((inv) => (
          <article key={inv.inv} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs text-accent">{inv.inv}</p>
            <h3 className="mt-1 text-sm font-medium">{inv.title}</h3>
            <p className="mt-2 font-mono text-xs text-muted">
              {inv.file} · {inv.symbol}
            </p>
          </article>
        ))}
      </section>
      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Golden set</h2>
          {golden.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nog niet gedraaid deze sessie.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {golden.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-mono text-xs">{g.id}</span>
                  <span className={g.ok ? "text-ok" : "text-danger"}>{g.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
