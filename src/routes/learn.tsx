import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/learn")({ component: LearnPage });

function LearnPage() {
  const skills = useYieldStore((s) => s.skills);
  const patches = useYieldStore((s) => s.patches);
  const applyMerge = useYieldStore((s) => s.applyMerge);

  return (
    <div>
      <PageHeader
        kicker="Memory"
        title="Skills zijn de bron van waarheid"
        lede="Geen episodisch geheugen. Learner schrijft patches; compliance-skills zijn frozen. Tweemaal dezelfde fout → encode in skills/."
      />
      <div className="grid gap-6 px-5 py-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Skills</h2>
          {skills.map((sk) => (
            <article key={sk.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium">{sk.title}</h3>
                <div className="flex gap-1">
                  {sk.compliance ? <Badge tone="warn">compliance</Badge> : null}
                  {sk.frozen ? <Badge>frozen</Badge> : <Badge tone="accent">v{sk.version}</Badge>}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{sk.body}</p>
            </article>
          ))}
        </div>
        <div>
          <h2 className="text-sm font-medium">Learning patches</h2>
          <ul className="mt-3 space-y-3">
            {patches.map((p) => (
              <li key={p.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium">{p.title}</h3>
                  <Badge tone={p.status === "MERGED" ? "ok" : p.status === "REJECTED" ? "danger" : "muted"}>
                    {p.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{p.body}</p>
                {p.touchesCompliance ? (
                  <p className="mt-2 text-xs text-danger">Raakt compliance — merge weigert.</p>
                ) : null}
                {p.status === "PROPOSED" ? (
                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={() => {
                      applyMerge(p.id);
                      toast.message("Patch-gate gedraaid");
                    }}
                  >
                    Merge (gated)
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
