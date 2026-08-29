import { Badge } from "@/components/ui/badge";
import type { Artefact, ArtefactState, AutonomyTier, PublishRecord, RunState } from "@/lib/yieldloop/contracts";
import { publicLabel } from "@/lib/yieldloop/compliance";

const STATE_TONE: Record<ArtefactState | "LIVE", "muted" | "accent" | "ok" | "warn" | "danger"> = {
  DRAFT: "muted",
  VERIFYING: "accent",
  BLOCKED: "danger",
  APPROVED: "accent",
  PUBLISHED: "muted",
  LIVE: "ok",
  FAILED: "danger",
  ROLLED_BACK: "warn",
  FROZEN: "danger",
};

const STATE_NL: Record<ArtefactState | "LIVE", string> = {
  DRAFT: "Concept",
  VERIFYING: "Toetsing",
  BLOCKED: "Geblokkeerd",
  APPROVED: "Goedgekeurd",
  PUBLISHED: "Gepubliceerd",
  LIVE: "Live",
  FAILED: "Mislukt",
  ROLLED_BACK: "Teruggedraaid",
  FROZEN: "Bevroren",
};

export function StateBadge({
  artefact,
  publishes,
}: {
  artefact: Artefact;
  publishes: PublishRecord[];
}) {
  const label = publicLabel(artefact, publishes);
  return <Badge tone={STATE_TONE[label]}>{STATE_NL[label]}</Badge>;
}

export function RawStateBadge({ state }: { state: ArtefactState | "LIVE" }) {
  return <Badge tone={STATE_TONE[state]}>{STATE_NL[state]}</Badge>;
}

const TIER_NL: Record<AutonomyTier, string> = {
  T0_OBSERVE: "T0 Observatie",
  T1_DRAFT: "T1 Concept",
  T2_GATED_ACT: "T2 Gated",
  T3_BOUNDED_AUTO: "T3 Auto",
  T4_EXPAND: "T4 Expansie",
};

export function TierBadge({ tier }: { tier: AutonomyTier }) {
  const tone = tier === "T0_OBSERVE" || tier === "T1_DRAFT" ? "muted" : tier === "T4_EXPAND" ? "ok" : "accent";
  return <Badge tone={tone}>{TIER_NL[tier]}</Badge>;
}

export function RunBadge({ run }: { run: RunState }) {
  return <Badge tone={run === "RUN" ? "ok" : "danger"}>{run === "RUN" ? "RUN" : "STOP"}</Badge>;
}

export { TIER_NL, STATE_NL };
