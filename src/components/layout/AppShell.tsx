import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Coins,
  FileText,
  GitBranch,
  LayoutDashboard,
  MoreHorizontal,
  Radio,
  Shield,
  Wallet,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Mark } from "@/components/yieldloop/mark";
import { RunBadge } from "@/components/yieldloop/status";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useYieldStore } from "@/lib/yieldloop/store";
import { partnerReady } from "@/lib/yieldloop/links.ts";
import { eur } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Commando", icon: LayoutDashboard },
  { to: "/stations", label: "Stations", icon: GitBranch },
  { to: "/verdienen", label: "Verdienen", icon: Coins },
  { to: "/content", label: "Content", icon: Radio },
  { to: "/loop", label: "Loop", icon: Workflow },
  { to: "/compliance", label: "Compliance", icon: Shield },
  { to: "/learn", label: "Skills", icon: BookOpen },
  { to: "/ledger", label: "Ledger", icon: Wallet },
  { to: "/overdracht", label: "Overdracht", icon: FileText },
] as const;

const MEER_PATHS = ["/loop", "/compliance", "/learn", "/ledger", "/overdracht"];

function isPublicPath(pathname: string): boolean {
  return (
    pathname.startsWith("/p/") ||
    pathname.startsWith("/go/") ||
    pathname === "/voorwaarden" ||
    pathname === "/privacy"
  );
}

function LegalLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex flex-wrap gap-4 text-xs text-muted", className)}>
      <Link to="/voorwaarden" className="hover:text-fg">
        Voorwaarden
      </Link>
      <Link to="/privacy" className="hover:text-fg">
        Privacy
      </Link>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const runState = useYieldStore((s) => s.runState);
  const budget = useYieldStore((s) => s.budget);
  const partner = useYieldStore((s) => s.partner);
  const applyKill = useYieldStore((s) => s.applyKill);
  const markHydrated = useYieldStore((s) => s.markHydrated);
  const [more, setMore] = useState(false);
  const ready = partnerReady(partner);
  const publicChrome = isPublicPath(pathname);

  useEffect(() => {
    const result = useYieldStore.persist.rehydrate();
    void Promise.resolve(result).then(() => markHydrated());
  }, [markHydrated]);

  if (publicChrome) {
    return (
      <div className="min-h-dvh bg-bg text-fg">
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            className: "bg-surface text-fg shadow-[var(--shadow-border)]",
          }}
        />
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Mark className="size-6" />
            <span className="text-sm font-medium">YieldLoop</span>
          </Link>
          <Link to="/" className="text-xs text-muted hover:text-fg">
            Commando
          </Link>
        </header>
        <main className="min-h-[70dvh]">{children}</main>
        <footer className="border-t border-border px-5 py-6">
          <p className="text-xs leading-relaxed text-muted">
            Affiliate-links: bij aankoop via deze links kan de operator een commissie ontvangen. Dat
            kost jou niets extra. YieldLoop zelf keert geen geld uit.
          </p>
          <LegalLinks className="mt-3" />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          className: "bg-surface text-fg shadow-[var(--shadow-border)]",
        }}
      />
      <aside className="fixed top-0 left-0 hidden h-dvh w-56 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Mark className="size-7" />
          <div>
            <p className="text-sm font-medium tracking-tight">YieldLoop</p>
            <p className="text-xs text-muted">Affiliate OS</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            const warn = item.to === "/verdienen" && !ready;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
                  active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
                {warn ? <span className="ml-auto size-1.5 rounded-full bg-warn" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Kill-switch</p>
              <RunBadge run={runState} />
            </div>
            <Switch
              checked={runState === "RUN"}
              onCheckedChange={(on) => applyKill(!on)}
              aria-label="Kill-switch"
            />
          </div>
          <p className="mt-3 font-mono text-xs tabular-nums text-muted">
            Budget {eur(budget.spentEur)} / {eur(budget.capEur)}
          </p>
          <LegalLinks className="mt-3" />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <Mark className="size-6" />
          <span className="text-sm font-medium">YieldLoop</span>
        </div>
        <RunBadge run={runState} />
      </header>

      <main className="min-h-dvh pb-24 md:ml-56 md:pb-8">{children}</main>

      <nav className="fixed right-0 bottom-0 left-0 z-30 grid grid-cols-5 border-t border-border bg-surface md:hidden">
        {NAV.slice(0, 4).map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
                active ? "text-fg" : "text-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMore(true)}
          className={cn(
            "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
            MEER_PATHS.some((p) => pathname.startsWith(p)) ? "text-fg" : "text-muted",
          )}
        >
          <MoreHorizontal className="size-4" />
          Meer
        </button>
      </nav>

      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom" className="px-5 pt-4 pb-8">
          <p className="text-sm font-medium">Meer</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {NAV.slice(4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMore(false)}
                  className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg bg-elevated text-xs"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-elevated px-4 py-3">
            <div>
              <p className="text-xs text-muted">Kill-switch</p>
              <RunBadge run={runState} />
            </div>
            <Switch checked={runState === "RUN"} onCheckedChange={(on) => applyKill(!on)} aria-label="Kill-switch" />
          </div>
          <LegalLinks className="mt-4" />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lede,
  actions,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border px-5 py-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker ? <p className="text-xs font-medium tracking-wide text-accent">{kicker}</p> : null}
        <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
        {lede ? <p className="mt-2 text-sm leading-relaxed text-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
