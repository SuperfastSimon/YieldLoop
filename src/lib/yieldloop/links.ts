import { extractUrls, hasClickId, isAffiliateUrl } from "./compliance.ts";
import type { PartnerConfig, Program, YieldState } from "./contracts.ts";

export const EMPTY_PARTNER: PartnerConfig = {
  bolSiteId: "",
  awinPublisherId: "",
  tradeTrackerCampaignId: "",
  tradeTrackerAffiliateId: "",
  configuredAt: null,
};

export function partnerReady(p: PartnerConfig | undefined | null): boolean {
  if (!p) return false;
  return Boolean(
    p.bolSiteId.trim() ||
      p.awinPublisherId.trim() ||
      p.tradeTrackerCampaignId.trim() ||
      p.tradeTrackerAffiliateId.trim(),
  );
}

function withParam(raw: string, key: string, value: string, clickId?: string): string {
  try {
    const u = new URL(raw);
    if (value) u.searchParams.set(key, value);
    if (clickId) u.searchParams.set("click_id", clickId);
    return u.toString();
  } catch {
    return raw;
  }
}

/** Tag a network URL with the operator's partner IDs. Preserves click_id. */
export function tagNetworkUrl(
  url: string,
  programs: Program[],
  partner: PartnerConfig,
  clickId?: string,
): string {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
  const program = programs.find(
    (p) => p.active && p.domainAllowlist.some((d) => host === d || host.endsWith(`.${d}`)),
  );
  const cid = clickId ?? undefined;
  if (!program) {
    return cid ? withParam(url, "click_id", cid) : url;
  }
  if (program.network === "bol" && partner.bolSiteId.trim()) {
    return withParam(url, "s", partner.bolSiteId.trim(), cid);
  }
  if (program.network === "awin" && partner.awinPublisherId.trim()) {
    return withParam(url, "awinaffid", partner.awinPublisherId.trim(), cid);
  }
  if (program.network === "tradetracker") {
    let next = url;
    if (partner.tradeTrackerCampaignId.trim()) {
      next = withParam(next, "c", partner.tradeTrackerCampaignId.trim(), cid);
    }
    if (partner.tradeTrackerAffiliateId.trim()) {
      next = withParam(next, "a", partner.tradeTrackerAffiliateId.trim(), cid);
    }
    return next;
  }
  return cid ? withParam(url, "click_id", cid) : url;
}

export function clickIdFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("click_id");
  } catch {
    const m = /[?&]click_id=([^&]+)/.exec(url);
    return m?.[1] ?? null;
  }
}

export function destinationForClickId(state: YieldState, clickId: string): string | null {
  const partner = state.partner ?? EMPTY_PARTNER;
  for (const art of state.artefacts) {
    for (const url of extractUrls(art.body)) {
      if (clickIdFromUrl(url) === clickId) {
        return partnerReady(partner) ? tagNetworkUrl(url, state.programs, partner, clickId) : url;
      }
    }
  }
  for (const rec of state.publishes) {
    for (const url of extractUrls(rec.snapshot)) {
      if (clickIdFromUrl(url) === clickId) {
        return partnerReady(partner) ? tagNetworkUrl(url, state.programs, partner, clickId) : url;
      }
    }
  }
  return null;
}

/** Rewrite affiliate markdown links to first-party /go/{click_id} for public pages. */
export function rewriteBodyForPublic(body: string, programs: Program[]): string {
  return body.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (full, label: string, url: string) => {
    if (!isAffiliateUrl(url, programs) && !hasClickId(url)) return full;
    const id = clickIdFromUrl(url);
    if (!id) return full;
    return `[${label}](/go/${id})`;
  });
}

/** Re-apply partner tags on every affiliate URL in a markdown body. */
export function retagBody(body: string, programs: Program[], partner: PartnerConfig): string {
  return body.replace(/https?:\/\/[^\s)]+/g, (url) => {
    const cid = clickIdFromUrl(url);
    if (!isAffiliateUrl(url, programs) && !cid) return url;
    return tagNetworkUrl(url, programs, partner, cid ?? undefined);
  });
}

export function partnerFromQuery(search: string): Partial<PartnerConfig> {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const q = new URLSearchParams(raw);
  const out: Partial<PartnerConfig> = {};
  const bol = q.get("bol") ?? q.get("s");
  const awin = q.get("awin") ?? q.get("awinaffid");
  const ttc = q.get("ttc") ?? q.get("c");
  const tta = q.get("tta") ?? q.get("a");
  if (bol) out.bolSiteId = bol;
  if (awin) out.awinPublisherId = awin;
  if (ttc) out.tradeTrackerCampaignId = ttc;
  if (tta) out.tradeTrackerAffiliateId = tta;
  return out;
}

export function mergePartner(base: PartnerConfig | undefined | null, over: Partial<PartnerConfig>): PartnerConfig {
  const b = base ?? EMPTY_PARTNER;
  return {
    bolSiteId: (over.bolSiteId ?? b.bolSiteId).trim(),
    awinPublisherId: (over.awinPublisherId ?? b.awinPublisherId).trim(),
    tradeTrackerCampaignId: (over.tradeTrackerCampaignId ?? b.tradeTrackerCampaignId).trim(),
    tradeTrackerAffiliateId: (over.tradeTrackerAffiliateId ?? b.tradeTrackerAffiliateId).trim(),
    configuredAt: b.configuredAt,
  };
}

/** Query string so a shared public URL carries the operator's partner IDs. */
export function verdienQuery(p: PartnerConfig): string {
  const q = new URLSearchParams();
  if (p.bolSiteId.trim()) q.set("bol", p.bolSiteId.trim());
  if (p.awinPublisherId.trim()) q.set("awin", p.awinPublisherId.trim());
  if (p.tradeTrackerCampaignId.trim()) q.set("ttc", p.tradeTrackerCampaignId.trim());
  if (p.tradeTrackerAffiliateId.trim()) q.set("tta", p.tradeTrackerAffiliateId.trim());
  const s = q.toString();
  return s ? `?${s}` : "";
}
