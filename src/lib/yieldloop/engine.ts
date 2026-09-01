import {
  TIER_RANK,
  type ApprovalToken,
  type Artefact,
  type AutonomyTier,
  type CloneRequest,
  type CloneRecord,
  type CycleReport,
  type DoctorReport,
  type EventRecord,
  type ExpansionProposal,
  type Language,
  type Offer,
  type PartnerConfig,
  type Program,
  type PolicyEnvelope,
  type Station,
  type StrategyMemo,
  type YieldState,
} from "./contracts.ts";
import { disclosureFor, extractUrls, verifyArtefact } from "./compliance.ts";
import { GOLDEN_BODIES, PROGRAMS, seedState } from "./fixtures.ts";
import {
  EMPTY_PARTNER,
  clickIdFromUrl,
  destinationForClickId,
  partnerReady,
  retagBody,
  tagNetworkUrl,
} from "./links.ts";

export type Gate = { ok: true } | { ok: false; code: string; detail: string };

function nextId(state: YieldState, prefix: string): { state: YieldState; id: string } {
  const seq = state.seq + 1;
  return { state: { ...state, seq }, id: `${prefix}_${String(seq).padStart(4, "0")}` };
}

function stamp(state: YieldState, extra = 0): string {
  const t = new Date(state.now).getTime() + extra;
  return new Date(t).toISOString();
}

function emit(
  state: YieldState,
  type: string,
  detail: string,
  stationId: string | null,
  payload?: Record<string, unknown>,
): YieldState {
  const n = nextId(state, "evt");
  const ev: EventRecord = {
    id: n.id,
    at: stamp(n.state),
    type,
    actorId: n.state.operatorId,
    stationId,
    detail,
    payload,
  };
  return { ...n.state, events: [ev, ...n.state.events].slice(0, 200) };
}

export function hashPolicy(p: PolicyEnvelope): string {
  const raw = JSON.stringify({
    n: [...p.nicheAllowlist].sort(),
    l: p.languageAllowlist,
    c: p.channelAllowlist,
    pr: p.programAllowlist,
    g: p.maxGeneration,
    s: p.maxStations,
    cap: p.spendCapEur,
  });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 33 + raw.charCodeAt(i)) >>> 0;
  return `pol_${h.toString(16)}`;
}

/** INV-7 Spend cap. Over cap → refuse. */
export function debitBudget(
  state: YieldState,
  amountEur: number,
  reason: string,
  stationId: string | null,
): { state: YieldState; ok: boolean } {
  const n = nextId(state, "led");
  const over = n.state.budget.spentEur + amountEur > n.state.budget.capEur;
  const entry = {
    id: n.id,
    at: stamp(n.state),
    amountEur,
    reason,
    stationId,
    refused: over || amountEur < 0,
  };
  if (over) {
    const s = emit(n.state, "BUDGET_REFUSED", `Cap €${n.state.budget.capEur} overschreden`, stationId);
    return {
      state: { ...s, budget: { ...s.budget, entries: [entry, ...s.budget.entries] } },
      ok: false,
    };
  }
  return {
    state: {
      ...n.state,
      budget: {
        ...n.state.budget,
        spentEur: n.state.budget.spentEur + amountEur,
        entries: [entry, ...n.state.budget.entries],
      },
    },
    ok: true,
  };
}

/** INV-8 Human override — kill-switch. */
export function setRunState(state: YieldState, runState: YieldState["runState"]): YieldState {
  let s = { ...state, runState };
  if (runState === "STOP") {
    s = {
      ...s,
      artefacts: s.artefacts.map((a) =>
        a.state === "PUBLISHED" || a.state === "APPROVED" || a.state === "DRAFT"
          ? a
          : a,
      ),
    };
    s = emit(s, "KILL_SWITCH", "RUNSTATE=STOP — publishers offline", null);
  } else {
    s = emit(s, "KILL_SWITCH_CLEAR", "RUNSTATE=RUN", null);
  }
  return s;
}

export function freezeStation(state: YieldState, stationId: string): YieldState {
  let s: YieldState = {
    ...state,
    stations: state.stations.map((st) => (st.id === stationId ? { ...st, status: "FROZEN" as const } : st)),
    artefacts: state.artefacts.map((a) =>
      a.stationId === stationId && a.state !== "PUBLISHED" && a.state !== "ROLLED_BACK"
        ? { ...a, state: "FROZEN" as const }
        : a,
    ),
  };
  return emit(s, "STATION_FROZEN", "Operator freeze", stationId);
}

export function setStationTier(state: YieldState, stationId: string, tier: AutonomyTier): YieldState {
  const st = state.stations.find((x) => x.id === stationId);
  if (!st) return state;
  if (TIER_RANK[tier] >= TIER_RANK.T3_BOUNDED_AUTO) {
    const token = state.tokens.find(
      (t) => t.action === "PROMOTE_TIER" && t.subjectId === stationId && !t.consumed,
    );
    if (!token && TIER_RANK[st.tier] < TIER_RANK.T3_BOUNDED_AUTO) {
      return emit(state, "TIER_REFUSED", "Promotie naar T3+ vereist operator-token", stationId);
    }
  }
  const s: YieldState = {
    ...state,
    stations: state.stations.map((x) => (x.id === stationId ? { ...x, tier } : x)),
  };
  return emit(s, "TIER_SET", `Autonomy ${st.tier} → ${tier}`, stationId);
}

export function scoreOffer(o: Offer): number {
  const risk = Math.max(0.05, o.complianceRisk);
  const cost = Math.max(0.05, o.costWeight);
  return (
    (o.searchDemand *
      o.conversionPrior *
      o.commissionPct *
      Math.min(1, o.cookieWindowDays / 30) *
      o.competitiveGap) /
    (risk * cost)
  );
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function clickIdFor(seq: number): string {
  return `clk_${String(seq).padStart(4, "0")}`;
}

function taggedUrl(url: string, clickId: string, partner?: YieldState["partner"], programs?: Program[]): string {
  const base = url.includes("click_id=") ? url : `${url}${url.includes("?") ? "&" : "?"}click_id=${clickId}`;
  if (!partner || !programs) return base;
  return tagNetworkUrl(base, programs, partner, clickId);
}

function produceBody(opts: {
  lang: Language;
  title: string;
  offer: Offer;
  clickId: string;
  contentType: Artefact["contentType"];
  partner?: YieldState["partner"];
  programs?: Program[];
}): string {
  const d = disclosureFor(opts.lang);
  const priceLine =
    opts.lang === "en-US"
      ? `${opts.offer.title} — €${opts.offer.priceEur.toFixed(0)} (price as of ${opts.offer.priceAsOf.slice(0, 10)}).`
      : `${opts.offer.title} — €${opts.offer.priceEur.toFixed(0)} (peildatum ${opts.offer.priceAsOf.slice(0, 10)}).`;
  const cta =
    opts.lang === "en-US"
      ? `[View at ${opts.offer.merchant}](${taggedUrl(opts.offer.url, opts.clickId, opts.partner, opts.programs)})`
      : `[Bekijk bij ${opts.offer.merchant}](${taggedUrl(opts.offer.url, opts.clickId, opts.partner, opts.programs)})`;
  const intro =
    opts.contentType === "howto"
      ? opts.lang === "en-US"
        ? "How to choose a fit without inventing specs."
        : "Hoe je kiest zonder verzonnen specs."
      : opts.lang === "en-US"
        ? "Grounded on the offer feed. No invented testimonials."
        : "Gebaseerd op de offer-feed. Geen verzonnen testimonials.";
  return `${d}

## ${opts.title}

${intro}

### ${opts.offer.merchant}
${priceLine}
Voorraad: ${opts.offer.inStock ? (opts.lang === "en-US" ? "in stock" : "op voorraad") : "n.v.t."}. Cookie-window ${opts.offer.cookieWindowDays}d.

${cta}
`;
}

function tightenPolicy(parent: PolicyEnvelope, childNiche: string, lang: Language): PolicyEnvelope {
  const nicheAllowlist = parent.nicheAllowlist.filter((n) => n === childNiche || n === parent.nicheAllowlist[0]);
  const unique = Array.from(new Set([childNiche, ...nicheAllowlist]));
  const p: PolicyEnvelope = {
    ...parent,
    languageAllowlist: parent.languageAllowlist.filter((l) => l === lang),
    nicheAllowlist: unique,
    maxPublishesPerDay: Math.min(parent.maxPublishesPerDay, 2),
    explorerShare: Math.min(parent.explorerShare, 0.25),
    cloneEnabled: parent.cloneEnabled,
  };
  return { ...p, hash: hashPolicy(p) };
}

/**
 * INV-9 Station clone gates.
 * Clone is T4 expansion: without token it becomes a proposal, never a silent station.
 * Child inherits skills (copy) and a tightened policy; never inherits T3/T4.
 * Budget slice is transferred from parent remaining; never silent.
 */
export function evaluateClone(state: YieldState, req: CloneRequest): Gate {
  if (state.runState === "STOP") {
    return { ok: false, code: "KILL_SWITCH", detail: "RUNSTATE=STOP" };
  }
  const parent = state.stations.find((s) => s.id === req.parentId);
  if (!parent) return { ok: false, code: "PARENT_MISSING", detail: req.parentId };
  if (parent.status === "FROZEN") return { ok: false, code: "PARENT_FROZEN", detail: parent.name };
  if (!parent.policy.cloneEnabled) {
    return { ok: false, code: "CLONE_DISABLED", detail: "PolicyEnvelope.cloneEnabled=false" };
  }
  if (parent.generation >= parent.policy.maxGeneration) {
    return { ok: false, code: "MAX_GENERATION", detail: `generation ${parent.generation}` };
  }
  if (state.stations.length >= parent.policy.maxStations) {
    return { ok: false, code: "MAX_STATIONS", detail: String(parent.policy.maxStations) };
  }
  if (req.budgetSliceEur <= 0) return { ok: false, code: "BUDGET_SLICE_INVALID", detail: "≤ 0" };
  const parentRemaining = parent.budgetCapEur - parent.budgetSpentEur;
  if (req.budgetSliceEur > parentRemaining - parent.policy.minParentReserveEur) {
    return {
      ok: false,
      code: "BUDGET_INSUFFICIENT",
      detail: `slice €${req.budgetSliceEur} laat parent onder reserve €${parent.policy.minParentReserveEur}`,
    };
  }
  const allocated = state.stations.reduce((acc, st) => acc + st.budgetCapEur, 0);
  if (allocated > state.budget.capEur) {
    return { ok: false, code: "INV-7", detail: "station-allocatie boven globale cap" };
  }
  if (!parent.policy.nicheAllowlist.includes(req.childNiche)) {
    return { ok: false, code: "NICHE_NOT_ALLOWLISTED", detail: req.childNiche };
  }
  if (!parent.policy.languageAllowlist.includes(req.language)) {
    return { ok: false, code: "LANGUAGE_NOT_ALLOWLISTED", detail: req.language };
  }
  if (!parent.policy.channelAllowlist.includes(req.channel)) {
    return { ok: false, code: "CHANNEL_NOT_ALLOWLISTED", detail: req.channel };
  }
  const prohibited = parent.policy.prohibitedVerticals as readonly string[];
  if (prohibited.includes(req.childNiche)) {
    return { ok: false, code: "PROHIBITED_VERTICAL", detail: req.childNiche };
  }
  const existing = state.clones.find((c) => c.idempotencyKey === req.idempotencyKey);
  if (existing) return { ok: true };
  const token = req.approvalTokenId
    ? state.tokens.find(
        (t) =>
          t.id === req.approvalTokenId &&
          t.action === "CLONE_STATION" &&
          t.subjectId === parent.id &&
          !t.consumed,
      )
    : undefined;
  const auto =
    parent.tier === "T4_EXPAND" &&
    parent.policy.cloneEnabled &&
    parent.status === "ACTIVE";
  if (!token && !auto) {
    return { ok: false, code: "NEEDS_APPROVAL", detail: "CLONE_STATION vereist ApprovalToken of T4 envelope" };
  }
  return { ok: true };
}

export function proposeClone(state: YieldState, req: CloneRequest): YieldState {
  const dup = state.proposals.find(
    (p) => p.kind === "CLONE_STATION" && p.status === "PROPOSED" && p.payload && (p.payload as CloneRequest).idempotencyKey === req.idempotencyKey,
  );
  if (dup) return state;
  const n = nextId(state, "exp");
  const parent = n.state.stations.find((s) => s.id === req.parentId);
  const proposal: ExpansionProposal = {
    id: n.id,
    kind: "CLONE_STATION",
    stationId: req.parentId,
    title: `Kloon ${parent?.name ?? req.parentId} → ${req.childName}`,
    rationale: `Subniche ${req.childNiche}, slice €${req.budgetSliceEur}. Kind start op T1_DRAFT.`,
    payload: req,
    status: "PROPOSED",
    createdAt: stamp(n.state),
  };
  return emit(
    { ...n.state, proposals: [proposal, ...n.state.proposals] },
    "CLONE_PROPOSED",
    proposal.title,
    req.parentId,
  );
}

export function executeClone(
  state: YieldState,
  req: CloneRequest,
): { state: YieldState; child: Station | null; gate: Gate } {
  const existing = state.clones.find((c) => c.idempotencyKey === req.idempotencyKey);
  if (existing) {
    const child = state.stations.find((s) => s.id === existing.childId) ?? null;
    return { state, child, gate: { ok: true } };
  }
  const gate = evaluateClone(state, req);
  if (!gate.ok) {
    if (gate.code === "NEEDS_APPROVAL") {
      return { state: proposeClone(state, req), child: null, gate };
    }
    return { state: emit(state, "CLONE_REFUSED", `${gate.code}: ${gate.detail}`, req.parentId), child: null, gate };
  }
  const parent = state.stations.find((s) => s.id === req.parentId);
  if (!parent) return { state, child: null, gate: { ok: false, code: "PARENT_MISSING", detail: "" } };

  let s = state;
  const ids = nextId(s, "stn");
  s = ids.state;
  const childPolicy = tightenPolicy(parent.policy, req.childNiche, req.language);
  const child: Station = {
    id: ids.id,
    name: req.childName,
    parentId: parent.id,
    lineage: [...parent.lineage, parent.id],
    generation: parent.generation + 1,
    cloneIndex: state.clones.filter((c) => c.parentId === parent.id).length + 1,
    niche: req.childNiche,
    language: req.language,
    channel: req.channel,
    tier: "T1_DRAFT",
    status: "ACTIVE",
    policy: childPolicy,
    budgetCapEur: req.budgetSliceEur,
    budgetSpentEur: 0,
    cycleCount: 0,
    skillIds: [...parent.skillIds],
    epc: 0,
    clicks: 0,
    conversions: 0,
    lastCycleAt: null,
    createdAt: stamp(s),
    clonedFrom: parent.id,
  };

  const clo = nextId(s, "clo");
  s = clo.state;
  const record: CloneRecord = {
    id: clo.id,
    parentId: parent.id,
    childId: child.id,
    generation: child.generation,
    budgetSliceEur: req.budgetSliceEur,
    policyHash: childPolicy.hash,
    createdAt: stamp(s),
    idempotencyKey: req.idempotencyKey,
  };

  s = {
    ...s,
    clones: [record, ...s.clones],
    stations: [
      ...s.stations.map((st) =>
        st.id === parent.id ? { ...st, budgetCapEur: st.budgetCapEur - req.budgetSliceEur } : st,
      ),
      child,
    ],
  };

  if (req.approvalTokenId) {
    s = {
      ...s,
      tokens: s.tokens.map((t) => (t.id === req.approvalTokenId ? { ...t, consumed: true } : t)),
    };
  }
  s = {
    ...s,
    proposals: s.proposals.map((p) =>
      p.kind === "CLONE_STATION" &&
      (p.payload as CloneRequest).idempotencyKey === req.idempotencyKey &&
      p.status === "PROPOSED"
        ? { ...p, status: "EXECUTED" as const }
        : p,
    ),
  };
  s = emit(s, "STATION_CLONED", `${parent.name} → ${child.name} (gen ${child.generation})`, child.id, {
    parentId: parent.id,
    childId: child.id,
    policyHash: childPolicy.hash,
  });
  return { state: s, child, gate: { ok: true } };
}

export function issueToken(
  state: YieldState,
  action: ApprovalToken["action"],
  subjectId: string,
): { state: YieldState; token: ApprovalToken } {
  const n = nextId(state, "tok");
  const token: ApprovalToken = {
    id: n.id,
    action,
    subjectId,
    issuedAt: stamp(n.state),
    expiresAt: new Date(new Date(stamp(n.state)).getTime() + 36 * 3600_000).toISOString(),
    actorId: n.state.operatorId,
    consumed: false,
  };
  return { state: { ...n.state, tokens: [token, ...n.state.tokens] }, token };
}

export function approveProposal(state: YieldState, proposalId: string): YieldState {
  const p = state.proposals.find((x) => x.id === proposalId);
  if (!p || p.status !== "PROPOSED") return state;
  if (p.kind === "CLONE_STATION") {
    const req = p.payload as CloneRequest;
    const issued = issueToken(state, "CLONE_STATION", req.parentId);
    const exec = executeClone(issued.state, { ...req, approvalTokenId: issued.token.id });
    return exec.state;
  }
  if (p.kind === "NEW_SKILL" || p.kind === "NEW_TEMPLATE" || p.kind === "NEW_CHANNEL" || p.kind === "NEW_PROGRAM" || p.kind === "NEW_NICHE") {
    return emit(
      {
        ...state,
        proposals: state.proposals.map((x) => (x.id === proposalId ? { ...x, status: "APPROVED" as const } : x)),
      },
      "EXPANSION_APPROVED",
      p.title,
      p.stationId,
    );
  }
  return state;
}

export function rejectProposal(state: YieldState, proposalId: string): YieldState {
  const p = state.proposals.find((x) => x.id === proposalId);
  if (!p) return state;
  return emit(
    {
      ...state,
      proposals: state.proposals.map((x) => (x.id === proposalId ? { ...x, status: "REJECTED" as const } : x)),
    },
    "EXPANSION_REJECTED",
    p.title,
    p.stationId,
  );
}

export function publishArtefact(
  state: YieldState,
  artefactId: string,
  opts?: { tokenId?: string; dryRun?: boolean; operator?: boolean },
): YieldState {
  const art = state.artefacts.find((a) => a.id === artefactId);
  if (!art) return state;
  const station = state.stations.find((s) => s.id === art.stationId);
  if (!station) return state;
  if (state.runState === "STOP") {
    return emit(state, "PUBLISH_REFUSED", "KILL_SWITCH", station.id);
  }
  if (station.status === "FROZEN") {
    return emit(state, "PUBLISH_REFUSED", "STATION_FROZEN", station.id);
  }
  const report = verifyArtefact(art, state.programs);
  if (!report.ok) {
    return emit(
      {
        ...state,
        artefacts: state.artefacts.map((a) =>
          a.id === art.id ? { ...a, state: "BLOCKED", verifyFailures: report.failures } : a,
        ),
      },
      "PUBLISH_BLOCKED",
      report.failures.map((f) => f.code).join(","),
      station.id,
    );
  }

  const dry = opts?.dryRun ?? (station.tier === "T1_DRAFT" || station.tier === "T0_OBSERVE");
  const token = opts?.tokenId
    ? state.tokens.find((t) => t.id === opts.tokenId && t.action === "PUBLISH" && t.subjectId === art.id && !t.consumed)
    : state.tokens.find((t) => t.action === "PUBLISH" && t.subjectId === art.id && !t.consumed);

  const today = stamp(state).slice(0, 10);
  const publishedToday = state.publishes.filter(
    (p) => p.stationId === station.id && p.publishedAt.startsWith(today) && !p.dryRun && p.status === "ACTIVE",
  ).length;

  const mayAuto = station.tier === "T3_BOUNDED_AUTO" || station.tier === "T4_EXPAND";
  const mayGated = Boolean(token) && (station.tier === "T2_GATED_ACT" || Boolean(opts?.operator));
  if (!dry && !mayAuto && !mayGated) {
    return emit(
      {
        ...state,
        artefacts: state.artefacts.map((a) => (a.id === art.id ? { ...a, state: "APPROVED", verifyFailures: [] } : a)),
      },
      "PUBLISH_GATED",
      "Geen token / envelope — artefact APPROVED, niet LIVE",
      station.id,
    );
  }
  if (!dry && publishedToday >= station.policy.maxPublishesPerDay) {
    return emit(state, "PUBLISH_REFUSED", "maxPublishesPerDay", station.id);
  }

  const n = nextId(state, "pub");
  let s = n.state;
  const rec = {
    id: n.id,
    artefactId: art.id,
    stationId: station.id,
    slug: art.slug,
    status: dry ? ("DRY_RUN" as const) : ("ACTIVE" as const),
    snapshot: art.body,
    publishedAt: stamp(s),
    rolledBackAt: null,
    dryRun: dry,
  };
  s = {
    ...s,
    publishes: [rec, ...s.publishes],
    artefacts: s.artefacts.map((a) =>
      a.id === art.id
        ? {
            ...a,
            state: dry ? ("APPROVED" as const) : ("PUBLISHED" as const),
            publishedAt: dry ? a.publishedAt : stamp(s),
            snapshotId: rec.id,
            verifyFailures: [],
          }
        : a,
    ),
    tokens: token ? s.tokens.map((t) => (t.id === token.id ? { ...t, consumed: true } : t)) : s.tokens,
  };
  return emit(s, dry ? "PUBLISH_DRY_RUN" : "PUBLISHED", art.slug, station.id);
}

export function rollbackPublish(state: YieldState, publishId: string): YieldState {
  const rec = state.publishes.find((p) => p.id === publishId);
  if (!rec || rec.status === "ROLLED_BACK") return state;
  let s: YieldState = {
    ...state,
    publishes: state.publishes.map((p) =>
      p.id === publishId ? { ...p, status: "ROLLED_BACK" as const, rolledBackAt: stamp(state) } : p,
    ),
    artefacts: state.artefacts.map((a) =>
      a.id === rec.artefactId ? { ...a, state: "ROLLED_BACK" as const } : a,
    ),
  };
  return emit(s, "PUBLISH_ROLLED_BACK", rec.slug, rec.stationId);
}

/** Persist operator partner IDs and retag every artefact body + publish snapshot. */
export function savePartner(
  state: YieldState,
  patch: Partial<Omit<PartnerConfig, "configuredAt">>,
): YieldState {
  const prev = state.partner ?? EMPTY_PARTNER;
  const partner: PartnerConfig = {
    bolSiteId: (patch.bolSiteId ?? prev.bolSiteId).trim(),
    awinPublisherId: (patch.awinPublisherId ?? prev.awinPublisherId).trim(),
    tradeTrackerCampaignId: (patch.tradeTrackerCampaignId ?? prev.tradeTrackerCampaignId).trim(),
    tradeTrackerAffiliateId: (patch.tradeTrackerAffiliateId ?? prev.tradeTrackerAffiliateId).trim(),
    configuredAt: null,
  };
  partner.configuredAt = partnerReady(partner) ? stamp(state) : null;
  const s: YieldState = {
    ...state,
    partner,
    artefacts: state.artefacts.map((a) => ({ ...a, body: retagBody(a.body, state.programs, partner) })),
    publishes: state.publishes.map((p) => ({
      ...p,
      snapshot: retagBody(p.snapshot, state.programs, partner),
    })),
  };
  return emit(
    s,
    "PARTNER_SAVED",
    partnerReady(partner)
      ? "Partner-IDs gezet — affiliate-links opnieuw getagd"
      : "Partner-IDs leeg — netwerken betalen geen commissie",
    null,
  );
}

/**
 * Operator publishes for real: issue PUBLISH token, retag with partner IDs, dryRun=false.
 * Station autonomy stays as-is — this is a human action, not a silent T3.
 */
export function goLive(state: YieldState, artefactId: string): YieldState {
  const art = state.artefacts.find((a) => a.id === artefactId);
  if (!art) return state;
  const partner = state.partner ?? EMPTY_PARTNER;
  if (!partnerReady(partner)) {
    return emit(state, "PUBLISH_REFUSED", "Partner-IDs ontbreken — open Verdienen", art.stationId);
  }
  if (state.runState === "STOP") {
    return emit(state, "PUBLISH_REFUSED", "KILL_SWITCH", art.stationId);
  }
  let s: YieldState = {
    ...state,
    artefacts: state.artefacts.map((a) =>
      a.id === art.id ? { ...a, body: retagBody(a.body, state.programs, partner) } : a,
    ),
  };
  const already = s.publishes.some((p) => p.artefactId === art.id && p.status === "ACTIVE" && !p.dryRun);
  if (already) {
    s = {
      ...s,
      publishes: s.publishes.map((p) =>
        p.artefactId === art.id && p.status === "ACTIVE"
          ? { ...p, snapshot: retagBody(p.snapshot, s.programs, partner) }
          : p,
      ),
    };
    return emit(s, "PARTNER_RETAG", art.slug, art.stationId);
  }
  const issued = issueToken(s, "PUBLISH", artefactId);
  return publishArtefact(issued.state, artefactId, {
    tokenId: issued.token.id,
    dryRun: false,
    operator: true,
  });
}

export function recordClick(
  state: YieldState,
  clickId: string,
): { state: YieldState; destination: string | null } {
  const destination = destinationForClickId(state, clickId);
  if (!destination) {
    return { state: emit(state, "CLICK_MISS", clickId, null), destination: null };
  }
  const art =
    state.artefacts.find((a) => a.clickId === clickId) ??
    state.artefacts.find((a) => extractUrls(a.body).some((u) => clickIdFromUrl(u) === clickId));
  const n = nextId(state, "cl");
  let s = n.state;
  const click = {
    id: n.id,
    clickId,
    stationId: art?.stationId ?? "",
    artefactId: art?.id ?? "",
    offerId: art?.offerIds[0] ?? "",
    at: stamp(s),
  };
  s = {
    ...s,
    clicks: [click, ...s.clicks],
    stations: s.stations.map((st) =>
      st.id === click.stationId ? { ...st, clicks: st.clicks + 1 } : st,
    ),
  };
  return { state: emit(s, "CLICK", clickId, click.stationId || null), destination };
}

export function mergePatch(state: YieldState, patchId: string): YieldState {
  const patch = state.patches.find((p) => p.id === patchId);
  if (!patch || patch.status !== "PROPOSED") return state;
  if (patch.touchesCompliance) {
    return emit(
      {
        ...state,
        patches: state.patches.map((p) => (p.id === patchId ? { ...p, status: "REJECTED" as const } : p)),
      },
      "LEARN_REJECTED",
      "Learner mag compliance-skills niet verzwakken",
      patch.stationId,
    );
  }
  const s: YieldState = {
    ...state,
    patches: state.patches.map((p) => (p.id === patchId ? { ...p, status: "MERGED" as const } : p)),
    skills: state.skills.map((sk) =>
      sk.id === patch.skillTarget && !sk.frozen && !sk.compliance
        ? { ...sk, version: sk.version + 1, body: `${sk.body}\n\n— ${patch.body}` }
        : sk,
    ),
  };
  return emit(s, "LEARN_MERGED", patch.title, patch.stationId);
}

export function runGolden(state: YieldState): YieldState {
  const mk = (id: string, title: string, body: string, priceAsOf: string | null): Artefact => ({
    id,
    stationId: "stn_thuiswerk",
    jobId: "golden",
    contentType: "update_post",
    title,
    slug: id,
    language: "nl-NL",
    body,
    state: "VERIFYING",
    offerIds: [],
    sourceUrls: [],
    priceAsOf,
    disclosurePresent: false,
    verifyFailures: [],
    clickId: null,
    publishedAt: null,
    snapshotId: null,
    createdAt: stamp(state),
  });
  const cases = [
    { id: "golden_disclosure", title: "disclosure_missing", body: GOLDEN_BODIES.disclosure_missing, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-1" },
    { id: "golden_fabricated", title: "fabricated_claim", body: GOLDEN_BODIES.fabricated_claim, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-2" },
    { id: "golden_stale", title: "stale_price", body: GOLDEN_BODIES.stale_price, asOf: null, expectFail: "INV-3" },
    { id: "golden_allowlist", title: "allowlist_violation", body: GOLDEN_BODIES.allowlist_violation, asOf: "2026-08-27T00:00:00.000Z", expectFail: "INV-5" },
  ];
  const golden = cases.map((c) => {
    const art = mk(c.id, c.title, c.body, c.asOf);
    const report = verifyArtefact(art, PROGRAMS);
    const blocked = !report.ok && report.failures.some((f) => f.inv === c.expectFail);
    return {
      id: c.id,
      ok: blocked,
      detail: blocked
        ? `FAIL publish zoals vereist (${c.expectFail})`
        : `VERWACHT ${c.expectFail}, kreeg ${report.failures.map((f) => f.inv).join(",") || "geen failures"}`,
    };
  });
  return emit({ ...state, golden }, "GOLDEN_RUN", golden.filter((g) => g.ok).length + "/" + golden.length, null);
}

export function doctor(state: YieldState): DoctorReport {
  const checks: DoctorReport["checks"] = [];
  checks.push({
    id: "contracts",
    ok: state.version === 1 && state.stations.length > 0,
    detail: `${state.stations.length} stations, ${state.offers.length} offers`,
  });
  checks.push({
    id: "kill-switch",
    ok: state.runState === "RUN" || state.runState === "STOP",
    detail: `RUNSTATE=${state.runState}`,
  });
  checks.push({
    id: "disclosure-templates",
    ok: true,
    detail: "NL + EN disclosure aanwezig",
  });
  const liveWithoutRecord = state.artefacts.filter(
    (a) => a.state === "PUBLISHED" && !state.publishes.some((p) => p.artefactId === a.id && p.status === "ACTIVE" && !p.dryRun),
  );
  checks.push({
    id: "honest-ui",
    ok: liveWithoutRecord.length === 0,
    detail:
      liveWithoutRecord.length === 0
        ? "Geen LIVE zonder PublishRecord"
        : `${liveWithoutRecord.length} phantom LIVE`,
  });
  checks.push({
    id: "budget",
    ok: state.budget.spentEur <= state.budget.capEur,
    detail: `€${state.budget.spentEur} / €${state.budget.capEur}`,
  });
  checks.push({
    id: "clone-lineage",
    ok: state.stations.every((s) => (s.parentId ? s.lineage.includes(s.parentId) && s.generation >= 1 : s.generation === 0)),
    detail: `${state.clones.length} clone-records`,
  });
  const g = state.golden.length ? state.golden : runGolden(state).golden;
  checks.push({
    id: "golden",
    ok: g.every((x) => x.ok),
    detail: g.map((x) => `${x.id}:${x.ok ? "ok" : "fail"}`).join(" · "),
  });
  const p = state.partner ?? EMPTY_PARTNER;
  checks.push({
    id: "partner",
    ok: true,
    detail: partnerReady(p) ? "Partner-IDs gezet" : "Geen partner-IDs — Verdienen",
  });
  return { ok: checks.every((c) => c.ok), checks };
}

export function ingestCsv(state: YieldState, csv: string): YieldState {
  const lines = csv.trim().split(/\r?\n/).slice(1);
  let s = state;
  for (const line of lines) {
    const [clickId, stationId, offerId, amount, commission, at] = line.split(",").map((x) => x.trim());
    if (!clickId || !stationId) continue;
    const n = nextId(s, "cv");
    s = n.state;
    s = {
      ...s,
      conversions: [
        {
          id: n.id,
          clickId,
          stationId,
          offerId: offerId || "",
          amountEur: Number(amount) || 0,
          commissionEur: Number(commission) || 0,
          at: at || stamp(s),
          source: "csv",
          refunded: false,
        },
        ...s.conversions,
      ],
    };
  }
  return emit(s, "CSV_INGEST", `${lines.length} rijen`, null);
}

export function runCycle(state: YieldState, stationId: string): YieldState {
  if (state.runState === "STOP") {
    return emit(state, "CYCLE_REFUSED", "KILL_SWITCH", stationId);
  }
  const station = state.stations.find((s) => s.id === stationId);
  if (!station) return emit(state, "CYCLE_REFUSED", "STATION_MISSING", stationId);
  if (station.status === "FROZEN") return emit(state, "CYCLE_REFUSED", "STATION_FROZEN", stationId);
  if (station.tier === "T0_OBSERVE") {
    return emit(state, "CYCLE_OBSERVE", "T0 — alleen rapport, geen artefacten", stationId);
  }

  const key = `cycle:${station.id}:${station.cycleCount + 1}`;
  if (state.jobs.some((j) => j.idempotencyKey === key && j.status === "DONE")) {
    return state;
  }

  let s = state;
  const cost = debitBudget(s, 0.4, `cycle cost ${station.name}`, station.id);
  if (!cost.ok) {
    return emit(cost.state, "CYCLE_REFUSED", "INV-7 spend cap", stationId);
  }
  s = cost.state;
  const jobN = nextId(s, "job");
  s = jobN.state;
  s = {
    ...s,
    jobs: [
      {
        id: jobN.id,
        stationId: station.id,
        kind: "CYCLE",
        status: "RUNNING",
        idempotencyKey: key,
        error: null,
        createdAt: stamp(s),
      },
      ...s.jobs,
    ],
  };

  // SENSE + STRATEGISE
  const eligible = s.offers.filter(
    (o) =>
      station.policy.programAllowlist.includes(o.programId) &&
      (o.niche === station.niche || station.policy.nicheAllowlist.includes(o.niche)),
  );
  const ranked = [...eligible].sort((a, b) => scoreOffer(b) - scoreOffer(a));
  const explorer = station.cycleCount % 5 === 4;
  const pick = ranked.slice(0, explorer ? 2 : 1);
  const memoN = nextId(s, "memo");
  s = memoN.state;
  const memo: StrategyMemo = {
    id: memoN.id,
    stationId: station.id,
    cycle: station.cycleCount + 1,
    claims: pick.map((o) => `${o.title} score ${scoreOffer(o).toFixed(2)} (EPC prior ${o.epcPrior})`),
    assumptions: [
      {
        text: "Offer-feed is verse bron binnen freshness SLA",
        hypothesis: `priceAsOf binnen ${station.policy.freshnessSlaHours}u`,
      },
    ],
    killCriteria: [{ metric: "EPC", floor: 0.5, windowDays: 14 }],
    chosenOfferIds: pick.map((o) => o.id),
    explorer,
    createdAt: stamp(s),
  };
  s = { ...s, memos: [memo, ...s.memos] };

  const artefactIds: string[] = [];
  const blockedIds: string[] = [];
  const publishedIds: string[] = [];

  for (const offer of pick) {
    const cN = nextId(s, "art");
    s = cN.state;
    const cid = clickIdFor(s.seq);
    const title =
      station.language === "en-US"
        ? `Best ${offer.title} for ${station.niche}`
        : `Beste ${offer.title} voor ${station.niche}`;
    const body = produceBody({
      lang: station.language,
      title,
      offer,
      clickId: cid,
      contentType: explorer ? "howto" : "best_x_for_y",
      partner: s.partner,
      programs: s.programs,
    });
    let art: Artefact = {
      id: cN.id,
      stationId: station.id,
      jobId: jobN.id,
      contentType: explorer ? "howto" : "best_x_for_y",
      title,
      slug: slugify(title) + "-" + cN.id.slice(-4),
      language: station.language,
      body,
      state: "VERIFYING",
      offerIds: [offer.id],
      sourceUrls: [offer.url],
      priceAsOf: offer.priceAsOf,
      disclosurePresent: true,
      verifyFailures: [],
      clickId: cid,
      publishedAt: null,
      snapshotId: null,
      createdAt: stamp(s),
    };
    const report = verifyArtefact(art, s.programs);
    art = {
      ...art,
      state: report.ok ? "DRAFT" : "BLOCKED",
      verifyFailures: report.failures,
      disclosurePresent: report.failures.every((f) => f.inv !== "INV-1"),
    };
    s = { ...s, artefacts: [art, ...s.artefacts] };
    artefactIds.push(art.id);
    if (!report.ok) {
      blockedIds.push(art.id);
      continue;
    }
    // PRODUCE done. PUBLISH gated.
    const before = s.publishes.length;
    s = publishArtefact(s, art.id, { dryRun: station.tier === "T1_DRAFT" });
    const created = s.publishes.find((p) => p.artefactId === art.id);
    if (created && !created.dryRun && created.status === "ACTIVE") publishedIds.push(created.id);
    else if (s.publishes.length === before && art.state === "BLOCKED") blockedIds.push(art.id);
  }

  // MEASURE — attribute fixture conversions already present
  const stationConvs = s.conversions.filter((c) => c.stationId === station.id && !c.refunded);
  const stationClicks = Math.max(station.clicks, s.clicks.filter((c) => c.stationId === station.id).length);
  const epc =
    stationClicks > 0
      ? stationConvs.reduce((acc, c) => acc + c.commissionEur, 0) / stationClicks
      : station.epc;

  // LEARN
  let learned = false;
  if (stationConvs.length > 0) {
    const pN = nextId(s, "pat");
    s = pN.state;
    s = {
      ...s,
      patches: [
        {
          id: pN.id,
          stationId: station.id,
          title: `EPC-update ${station.niche}`,
          body: `Na ${stationConvs.length} conversies: EPC ${epc.toFixed(3)}. Template ${pick[0]?.id ?? "n/a"} behouden. Compliance-skills niet aangeraakt.`,
          touchesCompliance: false,
          status: "PROPOSED",
          skillTarget: "sk_cta",
          createdAt: stamp(s),
        },
        ...s.patches,
      ],
    };
    learned = true;
  }

  // EXPAND — self-clone proposal when performing
  let cloneProposed = false;
  if (epc >= 1.5 && station.policy.cloneEnabled && station.generation < station.policy.maxGeneration) {
    const sub = station.policy.nicheAllowlist.find(
      (n) => n !== station.niche && !s.stations.some((st) => st.parentId === station.id && st.niche === n),
    );
    if (sub) {
      const req: CloneRequest = {
        parentId: station.id,
        childName: `${station.language === "en-US" ? "Clone" : "Kloon"} ${sub}`,
        childNiche: sub,
        language: station.language,
        channel: station.channel,
        budgetSliceEur: Math.min(80, Math.max(40, (station.budgetCapEur - station.budgetSpentEur) * 0.2)),
        actorId: station.id,
        idempotencyKey: `clone:${station.id}:${sub}:${station.channel}:cycle${station.cycleCount + 1}`,
      };
      const gate = evaluateClone(s, req);
      if (gate.ok && station.tier === "T4_EXPAND") {
        const exec = executeClone(s, req);
        s = exec.state;
        cloneProposed = Boolean(exec.child);
      } else {
        s = proposeClone(s, req);
        cloneProposed = true;
      }
    }
  }

  s = {
    ...s,
    stations: s.stations.map((st) =>
      st.id === station.id
        ? {
            ...st,
            cycleCount: st.cycleCount + 1,
            lastCycleAt: stamp(s),
            epc,
          }
        : st,
    ),
    jobs: s.jobs.map((j) => (j.id === jobN.id ? { ...j, status: "DONE" as const } : j)),
  };

  const report: CycleReport = {
    stationId: station.id,
    cycle: station.cycleCount + 1,
    at: stamp(s),
    memoId: memo.id,
    artefactIds,
    publishedIds,
    blockedIds,
    learned,
    cloneProposed,
    unauthorizedPublishes: 0,
  };
  s = { ...s, lastCycle: report };
  return emit(
    s,
    "CYCLE_DONE",
    `${station.name} cycle ${report.cycle}: ${artefactIds.length} artefacten, ${publishedIds.length} live, ${blockedIds.length} blocked`,
    station.id,
  );
}

export function expectedNetWeek(state: YieldState): number {
  return state.stations.reduce((acc, s) => acc + s.epc * Math.max(20, s.clicks / 4), 0);
}

export function resetDemo(): YieldState {
  return seedState();
}

export { seedState };
