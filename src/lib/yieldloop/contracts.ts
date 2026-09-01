/** Typed contracts for YieldLoop. Closed enums — no stringly-typed autonomy. */

export const AUTONOMY_TIERS = [
  "T0_OBSERVE",
  "T1_DRAFT",
  "T2_GATED_ACT",
  "T3_BOUNDED_AUTO",
  "T4_EXPAND",
] as const;
export type AutonomyTier = (typeof AUTONOMY_TIERS)[number];

export const ARTEFACT_STATES = [
  "DRAFT",
  "VERIFYING",
  "BLOCKED",
  "APPROVED",
  "PUBLISHED",
  "FAILED",
  "ROLLED_BACK",
  "FROZEN",
] as const;
export type ArtefactState = (typeof ARTEFACT_STATES)[number];

export const RUN_STATES = ["RUN", "STOP"] as const;
export type RunState = (typeof RUN_STATES)[number];

export const LANGUAGES = ["nl-NL", "en-US"] as const;
export type Language = (typeof LANGUAGES)[number];

export const CHANNELS = ["site", "email", "social"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CONTENT_TYPES = [
  "comparison",
  "best_x_for_y",
  "howto",
  "update_post",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const PROHIBITED_VERTICALS = [
  "health-cure",
  "guaranteed-income",
  "crypto-get-rich",
  "weapons",
  "adult-minors",
  "illegal-goods",
] as const;
export type ProhibitedVertical = (typeof PROHIBITED_VERTICALS)[number];

export type InvariantId =
  | "INV-1"
  | "INV-2"
  | "INV-3"
  | "INV-4"
  | "INV-5"
  | "INV-6"
  | "INV-7"
  | "INV-8"
  | "INV-9";

export interface PolicyEnvelope {
  hash: string;
  languageAllowlist: Language[];
  nicheAllowlist: string[];
  channelAllowlist: Channel[];
  programAllowlist: string[];
  maxPublishesPerDay: number;
  maxBudgetPerNichePct: number;
  explorerShare: number;
  maxStations: number;
  maxGeneration: number;
  minParentReserveEur: number;
  spendCapEur: number;
  freshnessSlaHours: number;
  cookieMode: "NONE" | "CONSENT_GATED";
  prohibitedVerticals: ProhibitedVertical[];
  cloneEnabled: boolean;
}

export interface ApprovalToken {
  id: string;
  action: "PUBLISH" | "CLONE_STATION" | "PROMOTE_TIER" | "EXPAND" | "LEARN_MERGE";
  subjectId: string;
  issuedAt: string;
  expiresAt: string;
  actorId: string;
  consumed: boolean;
}

export interface ActionStamp {
  actorId: string;
  tier: AutonomyTier;
  policyHash: string;
  approvalTokenId: string | null;
  budgetDebitEur: number;
  idempotencyKey: string;
}

export interface Program {
  id: string;
  name: string;
  network: "bol" | "awin" | "tradetracker" | "amazon_paapi" | "generic_csv";
  domainAllowlist: string[];
  cookieWindowDays: number;
  geo: string[];
  active: boolean;
}

export interface PartnerConfig {
  bolSiteId: string;
  awinPublisherId: string;
  tradeTrackerCampaignId: string;
  tradeTrackerAffiliateId: string;
  configuredAt: string | null;
}

export interface Offer {
  id: string;
  programId: string;
  title: string;
  merchant: string;
  url: string;
  niche: string;
  commissionPct: number;
  epcPrior: number;
  cookieWindowDays: number;
  geo: string[];
  priceEur: number;
  priceAsOf: string;
  inStock: boolean;
  searchDemand: number;
  conversionPrior: number;
  competitiveGap: number;
  complianceRisk: number;
  costWeight: number;
}

export interface Station {
  id: string;
  name: string;
  parentId: string | null;
  lineage: string[];
  generation: number;
  cloneIndex: number;
  niche: string;
  language: Language;
  channel: Channel;
  tier: AutonomyTier;
  status: "ACTIVE" | "FROZEN" | "DRAFT";
  policy: PolicyEnvelope;
  budgetCapEur: number;
  budgetSpentEur: number;
  cycleCount: number;
  skillIds: string[];
  epc: number;
  clicks: number;
  conversions: number;
  lastCycleAt: string | null;
  createdAt: string;
  clonedFrom: string | null;
}

export interface Artefact {
  id: string;
  stationId: string;
  jobId: string;
  contentType: ContentType;
  title: string;
  slug: string;
  language: Language;
  body: string;
  state: ArtefactState;
  offerIds: string[];
  sourceUrls: string[];
  priceAsOf: string | null;
  disclosurePresent: boolean;
  verifyFailures: VerifyFailure[];
  clickId: string | null;
  publishedAt: string | null;
  snapshotId: string | null;
  createdAt: string;
}

export interface VerifyFailure {
  inv: InvariantId;
  code: string;
  detail: string;
}

export interface VerifyReport {
  ok: boolean;
  failures: VerifyFailure[];
}

export interface PublishRecord {
  id: string;
  artefactId: string;
  stationId: string;
  slug: string;
  status: "ACTIVE" | "ROLLED_BACK" | "DRY_RUN";
  snapshot: string;
  publishedAt: string;
  rolledBackAt: string | null;
  dryRun: boolean;
}

export interface StrategyMemo {
  id: string;
  stationId: string;
  cycle: number;
  claims: string[];
  assumptions: { text: string; hypothesis: string }[];
  killCriteria: { metric: string; floor: number; windowDays: number }[];
  chosenOfferIds: string[];
  explorer: boolean;
  createdAt: string;
}

export interface LearningPatch {
  id: string;
  stationId: string;
  title: string;
  body: string;
  touchesCompliance: boolean;
  status: "PROPOSED" | "MERGED" | "REJECTED";
  skillTarget: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  slug: string;
  title: string;
  body: string;
  version: number;
  frozen: boolean;
  compliance: boolean;
}

export interface ExpansionProposal {
  id: string;
  kind: "CLONE_STATION" | "NEW_NICHE" | "NEW_PROGRAM" | "NEW_TEMPLATE" | "NEW_CHANNEL" | "NEW_SKILL";
  stationId: string;
  title: string;
  rationale: string;
  payload: CloneRequest | Record<string, unknown>;
  status: "PROPOSED" | "APPROVED" | "EXECUTED" | "REJECTED";
  createdAt: string;
}

export interface CloneRequest {
  parentId: string;
  childName: string;
  childNiche: string;
  language: Language;
  channel: Channel;
  budgetSliceEur: number;
  actorId: string;
  idempotencyKey: string;
  approvalTokenId?: string;
}

export interface CloneRecord {
  id: string;
  parentId: string;
  childId: string;
  generation: number;
  budgetSliceEur: number;
  policyHash: string;
  createdAt: string;
  idempotencyKey: string;
}

export interface Conversion {
  id: string;
  clickId: string;
  stationId: string;
  offerId: string;
  amountEur: number;
  commissionEur: number;
  at: string;
  source: "csv" | "webhook" | "fixture";
  refunded: boolean;
}

export interface ClickEvent {
  id: string;
  clickId: string;
  stationId: string;
  artefactId: string;
  offerId: string;
  at: string;
}

export interface EventRecord {
  id: string;
  at: string;
  type: string;
  actorId: string;
  stationId: string | null;
  detail: string;
  payload?: Record<string, unknown>;
}

export interface Job {
  id: string;
  stationId: string;
  kind: "CYCLE" | "VERIFY" | "PUBLISH" | "CLONE" | "LEARN";
  status: "QUEUED" | "RUNNING" | "DONE" | "DEAD_LETTER";
  idempotencyKey: string;
  error: string | null;
  createdAt: string;
}

export interface BudgetLedger {
  capEur: number;
  spentEur: number;
  reservedEur: number;
  entries: {
    id: string;
    at: string;
    amountEur: number;
    reason: string;
    stationId: string | null;
    refused: boolean;
  }[];
}

export interface CycleReport {
  stationId: string;
  cycle: number;
  at: string;
  memoId: string;
  artefactIds: string[];
  publishedIds: string[];
  blockedIds: string[];
  learned: boolean;
  cloneProposed: boolean;
  unauthorizedPublishes: number;
}

export interface DoctorReport {
  ok: boolean;
  checks: { id: string; ok: boolean; detail: string }[];
}

export interface YieldState {
  version: 1;
  now: string;
  seq: number;
  runState: RunState;
  operatorId: string;
  language: Language;
  budget: BudgetLedger;
  policy: PolicyEnvelope;
  stations: Station[];
  programs: Program[];
  offers: Offer[];
  artefacts: Artefact[];
  publishes: PublishRecord[];
  memos: StrategyMemo[];
  events: EventRecord[];
  jobs: Job[];
  skills: Skill[];
  patches: LearningPatch[];
  proposals: ExpansionProposal[];
  tokens: ApprovalToken[];
  conversions: Conversion[];
  clicks: ClickEvent[];
  clones: CloneRecord[];
  lastCycle: CycleReport | null;
  golden: { id: string; ok: boolean; detail: string }[];
  partner: PartnerConfig;
}

export const TIER_RANK: Record<AutonomyTier, number> = {
  T0_OBSERVE: 0,
  T1_DRAFT: 1,
  T2_GATED_ACT: 2,
  T3_BOUNDED_AUTO: 3,
  T4_EXPAND: 4,
};

export const NL_DISCLOSURE =
  "Dit artikel bevat affiliate links. Als je via deze links koopt, kan YieldLoop een commissie ontvangen. Dat kost jou niets extra.";

export const EN_DISCLOSURE =
  "This article contains affiliate links. If you buy through these links, YieldLoop may earn a commission. This costs you nothing extra.";
