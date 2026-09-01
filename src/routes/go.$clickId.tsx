import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { isAllowlistedUrl } from "@/lib/yieldloop/compliance";
import {
  EMPTY_PARTNER,
  destinationForClickId,
  mergePartner,
  partnerFromQuery,
  partnerReady,
  tagNetworkUrl,
} from "@/lib/yieldloop/links.ts";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/go/$clickId")({ component: GoRedirect });

function GoRedirect() {
  const { clickId } = Route.useParams();
  const hydrated = useYieldStore((s) => s.hydrated);
  const applyClick = useYieldStore((s) => s.applyClick);
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });
  const [dest, setDest] = useState<string | null>(null);
  const [miss, setMiss] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!hydrated || ran.current) return;
    ran.current = true;
    const snap = useYieldStore.getState();
    const merged = mergePartner(snap.partner ?? EMPTY_PARTNER, partnerFromQuery(searchStr));
    let next = destinationForClickId({ ...snap, partner: merged }, clickId);
    if (next && partnerReady(merged)) {
      next = tagNetworkUrl(next, snap.programs, merged, clickId);
    }
    applyClick(clickId);
    if (!next || !isAllowlistedUrl(next, snap.programs)) {
      setMiss(true);
      return;
    }
    setDest(next);
    window.location.assign(next);
  }, [hydrated, clickId, searchStr, applyClick]);

  if (!hydrated) {
    return <p className="px-5 py-16 text-sm text-muted">Doorschakelen…</p>;
  }

  if (miss) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <h1 className="text-2xl font-medium tracking-tight">Link niet gevonden</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Deze click_id hoort bij geen allowlisted affiliate-URL. YieldLoop stuurt nergens heen
          buiten het program-allowlist (INV-5).
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
          Naar commando
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="text-2xl font-medium tracking-tight">Naar de winkel</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Je verlaat YieldLoop naar een allowlisted merchant. Affiliate-disclosure blijft van
        toepassing.
      </p>
      {dest ? (
        <a
          href={dest}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
          rel="nofollow sponsored noopener"
        >
          Doorgaan
        </a>
      ) : (
        <p className="mt-6 text-sm text-muted">Doorschakelen…</p>
      )}
    </div>
  );
}
