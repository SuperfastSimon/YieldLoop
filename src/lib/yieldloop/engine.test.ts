import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDEN_BODIES, seedState } from "./fixtures.ts";
import { isLive, publicLabel, verifyArtefact } from "./compliance.ts";
import {
  approveProposal,
  doctor,
  evaluateClone,
  executeClone,
  freezeStation,
  goLive,
  issueToken,
  mergePatch,
  publishArtefact,
  recordClick,
  rollbackPublish,
  runCycle,
  runGolden,
  savePartner,
  setRunState,
  setStationTier,
} from "./engine.ts";
import {
  destinationForClickId,
  partnerFromQuery,
  partnerReady,
  rewriteBodyForPublic,
  tagNetworkUrl,
  verdienQuery,
} from "./links.ts";
import type { Artefact, CloneRequest, YieldState } from "./contracts.ts";

function req(over: Partial<CloneRequest> = {}): CloneRequest {
  return {
    parentId: "stn_thuiswerk",
    childName: "NL Laptopstandaards",
    childNiche: "laptopstandaards",
    language: "nl-NL",
    channel: "site",
    budgetSliceEur: 90,
    actorId: "op_yield",
    idempotencyKey: "clone:stn_thuiswerk:laptopstandaards:site:test",
    ...over,
  };
}

function art(over: Partial<Artefact> & { body: string }): Artefact {
  return {
    id: "a",
    stationId: "stn_thuiswerk",
    jobId: "j",
    contentType: "update_post",
    title: "t",
    slug: "t",
    language: "nl-NL",
    state: "DRAFT",
    offerIds: [],
    sourceUrls: [],
    priceAsOf: "2026-08-27T00:00:00.000Z",
    disclosurePresent: false,
    verifyFailures: [],
    clickId: null,
    publishedAt: null,
    snapshotId: null,
    createdAt: "2026-08-28T00:00:00.000Z",
    ...over,
  };
}

const SAMPLE_PARTNER = {
  bolSiteId: "998877",
  awinPublisherId: "445566",
  tradeTrackerCampaignId: "12",
  tradeTrackerAffiliateId: "34",
  configuredAt: null,
};

describe("golden verifier", () => {
  const programs = seedState().programs;

  it("disclosure_missing fails INV-1 and cannot be live", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.disclosure_missing }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-1"));
  });

  it("fabricated_claim fails INV-2", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.fabricated_claim }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-2"));
  });

  it("stale_price fails INV-3 when undated", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.stale_price, priceAsOf: null }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-3"));
  });

  it("allowlist_violation fails INV-5", () => {
    const r = verifyArtefact(art({ body: GOLDEN_BODIES.allowlist_violation }), programs);
    assert.equal(r.ok, false);
    assert.ok(r.failures.some((f) => f.inv === "INV-5"));
  });

  it("runGolden marks all four negatives as correctly blocked", () => {
    const s = runGolden(seedState());
    assert.ok(s.golden.every((g) => g.ok), s.golden.map((g) => g.detail).join("; "));
  });
});

describe("honest UI", () => {
  it("never labels LIVE without an active PublishRecord", () => {
    const s = seedState();
    const phantom: Artefact = {
      ...s.artefacts[0]!,
      id: "art_phantom",
      state: "PUBLISHED",
      snapshotId: null,
    };
    assert.equal(isLive(phantom, s.publishes), false);
    assert.equal(publicLabel(phantom, s.publishes), "PUBLISHED");
    const real = s.artefacts.find((a) => a.id === "art_monitor_live")!;
    assert.equal(isLive(real, s.publishes), true);
    assert.equal(publicLabel(real, s.publishes), "LIVE");
  });
});

describe("station clone", () => {
  it("without token writes a proposal and does not create a station", () => {
    const before = seedState();
    const n = before.stations.length;
    const { state, child, gate } = executeClone(before, req());
    assert.equal(gate.ok, false);
    if (!gate.ok) assert.equal(gate.code, "NEEDS_APPROVAL");
    assert.equal(child, null);
    assert.equal(state.stations.length, n);
    assert.ok(state.proposals.some((p) => p.kind === "CLONE_STATION" && p.status === "PROPOSED"));
  });

  it("with token creates a T1 child, generation+1, tightened policy, transferred budget", () => {
    let s: YieldState = seedState();
    const parent = s.stations.find((x) => x.id === "stn_thuiswerk")!;
    const parentCap = parent.budgetCapEur;
    const issued = issueToken(s, "CLONE_STATION", parent.id);
    s = issued.state;
    const { state, child, gate } = executeClone(s, req({ approvalTokenId: issued.token.id }));
    assert.equal(gate.ok, true);
    assert.ok(child);
    assert.equal(child!.tier, "T1_DRAFT");
    assert.equal(child!.generation, parent.generation + 1);
    assert.equal(child!.parentId, parent.id);
    assert.ok(child!.lineage.includes(parent.id));
    assert.equal(child!.budgetCapEur, 90);
    assert.ok(child!.policy.nicheAllowlist.includes("laptopstandaards"));
    assert.ok(child!.skillIds.includes("sk_disclosure"));
    const afterParent = state.stations.find((x) => x.id === parent.id)!;
    assert.equal(afterParent.budgetCapEur, parentCap - 90);
    assert.ok(state.clones.some((c) => c.childId === child!.id));
  });

  it("is idempotent on the same key", () => {
    let s = seedState();
    const issued = issueToken(s, "CLONE_STATION", "stn_thuiswerk");
    s = issued.state;
    const r1 = executeClone(s, req({ approvalTokenId: issued.token.id }));
    const r2 = executeClone(r1.state, req({ approvalTokenId: issued.token.id }));
    assert.equal(r1.child!.id, r2.child!.id);
    assert.equal(r2.state.stations.filter((x) => x.clonedFrom === "stn_thuiswerk").length, 3);
  });

  it("refuses when kill-switch is STOP", () => {
    const s = setRunState(seedState(), "STOP");
    const g = evaluateClone(s, req());
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "KILL_SWITCH");
  });

  it("refuses over-budget slices that starve the parent reserve", () => {
    const s = seedState();
    const g = evaluateClone(s, req({ budgetSliceEur: 790 }));
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "BUDGET_INSUFFICIENT");
  });

  it("refuses niches off the parent allowlist", () => {
    const g = evaluateClone(seedState(), req({ childNiche: "health-cure" }));
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.code, "NICHE_NOT_ALLOWLISTED");
  });

  it("approveProposal executes a pending clone", () => {
    const s = seedState();
    const pending = s.proposals.find((p) => p.id === "exp_clone_laptop")!;
    const after = approveProposal(s, pending.id);
    assert.ok(after.stations.some((st) => st.niche === "laptopstandaards"));
    assert.equal(after.proposals.find((p) => p.id === pending.id)?.status, "EXECUTED");
  });
});

describe("publish gates", () => {
  it("T1 cycle produces artefacts and zero unauthorized publishes", () => {
    const before = seedState();
    const pubs = before.publishes.filter((p) => !p.dryRun && p.status === "ACTIVE").length;
    const after = runCycle(before, "stn_monitor");
    assert.ok(after.lastCycle);
    assert.equal(after.lastCycle!.unauthorizedPublishes, 0);
    assert.ok(after.lastCycle!.artefactIds.length >= 1);
    const live = after.publishes.filter((p) => !p.dryRun && p.status === "ACTIVE").length;
    assert.equal(live, pubs);
    const created = after.artefacts.find((a) => a.id === after.lastCycle!.artefactIds[0]);
    assert.ok(created);
    assert.ok(created!.state === "DRAFT" || created!.state === "APPROVED");
    assert.notEqual(created!.state, "PUBLISHED");
  });

  it("blocked golden artefact cannot be published", () => {
    const s = seedState();
    const after = publishArtefact(s, "art_blocked_golden");
    const art = after.artefacts.find((a) => a.id === "art_blocked_golden")!;
    assert.equal(art.state, "BLOCKED");
    assert.ok(!after.publishes.some((p) => p.artefactId === art.id && p.status === "ACTIVE" && !p.dryRun));
  });

  it("T2 token publishes an approved artefact to LIVE", () => {
    const s = seedState();
    const after = publishArtefact(s, "art_chair_approved", { tokenId: "tok_pub_chair" });
    const art = after.artefacts.find((a) => a.id === "art_chair_approved")!;
    assert.equal(art.state, "PUBLISHED");
    assert.equal(isLive(art, after.publishes), true);
  });

  it("rollback removes LIVE", () => {
    const s = rollbackPublish(seedState(), "pub_001");
    const art = s.artefacts.find((a) => a.id === "art_monitor_live")!;
    assert.equal(art.state, "ROLLED_BACK");
    assert.equal(isLive(art, s.publishes), false);
  });
});

describe("sentinel + learner", () => {
  it("freeze blocks further cycles", () => {
    const s = freezeStation(seedState(), "stn_monitor");
    const after = runCycle(s, "stn_monitor");
    assert.ok(after.events[0]?.type === "CYCLE_REFUSED");
  });

  it("learner rejects compliance-weakening patches", () => {
    let s = seedState();
    s = {
      ...s,
      patches: [
        {
          id: "pat_bad",
          stationId: "stn_monitor",
          title: "skip disclosure",
          body: "drop INV-1",
          touchesCompliance: true,
          status: "PROPOSED",
          skillTarget: "sk_disclosure",
          createdAt: s.now,
        },
        ...s.patches,
      ],
    };
    const after = mergePatch(s, "pat_bad");
    assert.equal(after.patches.find((p) => p.id === "pat_bad")?.status, "REJECTED");
    assert.equal(after.skills.find((k) => k.id === "sk_disclosure")?.version, 3);
  });

  it("T3 promotion without token is refused", () => {
    const s = setStationTier(seedState(), "stn_monitor", "T3_BOUNDED_AUTO");
    assert.equal(s.stations.find((x) => x.id === "stn_monitor")?.tier, "T1_DRAFT");
  });

  it("doctor is green on seed + golden", () => {
    const s = runGolden(seedState());
    const d = doctor(s);
    assert.equal(d.ok, true, d.checks.filter((c) => !c.ok).map((c) => c.id + ":" + c.detail).join("; "));
  });
});

describe("income path", () => {
  it("tags Bol URLs with site id and keeps click_id", () => {
    const s = seedState();
    const tagged = tagNetworkUrl(
      "https://partner.bol.com/click/monitor-ergo?click_id=clk_1001",
      s.programs,
      SAMPLE_PARTNER,
      "clk_1001",
    );
    const u = new URL(tagged);
    assert.equal(u.searchParams.get("s"), "998877");
    assert.equal(u.searchParams.get("click_id"), "clk_1001");
  });

  it("goLive without partner IDs refuses", () => {
    const after = goLive(seedState(), "art_chair_approved");
    const art = after.artefacts.find((a) => a.id === "art_chair_approved")!;
    assert.notEqual(art.state, "PUBLISHED");
    assert.equal(after.events[0]?.type, "PUBLISH_REFUSED");
  });

  it("goLive with partner IDs publishes APPROVED artefact to LIVE and tags the body", () => {
    let s = savePartner(seedState(), SAMPLE_PARTNER);
    assert.equal(partnerReady(s.partner), true);
    s = goLive(s, "art_chair_approved");
    const art = s.artefacts.find((a) => a.id === "art_chair_approved")!;
    assert.equal(art.state, "PUBLISHED");
    assert.equal(isLive(art, s.publishes), true);
    assert.ok(art.body.includes("c=12") || art.body.includes("a=34"));
  });

  it("recordClick returns tagged destination and appends a click", () => {
    const s = savePartner(seedState(), SAMPLE_PARTNER);
    const before = s.clicks.length;
    const { state, destination } = recordClick(s, "clk_1001");
    assert.ok(destination);
    assert.ok(destination!.includes("s=998877"));
    assert.equal(state.clicks.length, before + 1);
  });

  it("destination without partner still returns the stored URL", () => {
    const dest = destinationForClickId(seedState(), "clk_1001");
    assert.ok(dest);
    assert.ok(dest!.includes("partner.bol.com"));
    assert.equal(new URL(dest!).searchParams.get("s"), null);
  });

  it("rewriteBodyForPublic turns affiliate markdown into first-party /go links", () => {
    const s = seedState();
    const live = s.artefacts.find((a) => a.id === "art_monitor_live")!;
    const rewritten = rewriteBodyForPublic(live.body, s.programs);
    assert.ok(rewritten.includes("](/go/clk_1001)"));
    assert.equal(rewritten.includes("partner.bol.com"), false);
  });

  it("verdienQuery round-trips through partnerFromQuery", () => {
    const q = verdienQuery(SAMPLE_PARTNER);
    const parsed = partnerFromQuery(q);
    assert.equal(parsed.bolSiteId, "998877");
    assert.equal(parsed.awinPublisherId, "445566");
  });
});
