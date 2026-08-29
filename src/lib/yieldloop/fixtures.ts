import {
  NL_DISCLOSURE,
  EN_DISCLOSURE,
  type Offer,
  type PolicyEnvelope,
  type Program,
  type Skill,
  type YieldState,
} from "./contracts.ts";

export const NOW = "2026-08-28T08:00:00.000Z";

export const ROOT_POLICY: PolicyEnvelope = {
  hash: "pol_a1f3c9",
  languageAllowlist: ["nl-NL", "en-US"],
  nicheAllowlist: [
    "thuiswerk",
    "monitorarmen",
    "bureaus",
    "bureaustoelen",
    "laptopstandaards",
    "toetsenborden",
    "home-espresso",
    "espressomachines",
    "fietsaccessoires",
  ],
  channelAllowlist: ["site"],
  programAllowlist: ["prg_bol", "prg_awin", "prg_tt", "prg_csv"],
  maxPublishesPerDay: 3,
  maxBudgetPerNichePct: 0.4,
  explorerShare: 0.2,
  maxStations: 12,
  maxGeneration: 4,
  minParentReserveEur: 40,
  spendCapEur: 2000,
  freshnessSlaHours: 72,
  cookieMode: "NONE",
  prohibitedVerticals: [
    "health-cure",
    "guaranteed-income",
    "crypto-get-rich",
    "weapons",
    "adult-minors",
    "illegal-goods",
  ],
  cloneEnabled: true,
};

export const PROGRAMS: Program[] = [
  {
    id: "prg_bol",
    name: "Bol Partner",
    network: "bol",
    domainAllowlist: ["partner.bol.com", "bol.com"],
    cookieWindowDays: 30,
    geo: ["NL", "BE"],
    active: true,
  },
  {
    id: "prg_awin",
    name: "Awin",
    network: "awin",
    domainAllowlist: ["awin1.com", "wiki.awin.com"],
    cookieWindowDays: 30,
    geo: ["NL", "DE", "UK"],
    active: true,
  },
  {
    id: "prg_tt",
    name: "TradeTracker",
    network: "tradetracker",
    domainAllowlist: ["tc.tradetracker.net", "tradetracker.com"],
    cookieWindowDays: 14,
    geo: ["NL"],
    active: true,
  },
  {
    id: "prg_csv",
    name: "Generic CSV",
    network: "generic_csv",
    domainAllowlist: ["feeds.yieldloop.local"],
    cookieWindowDays: 21,
    geo: ["NL", "US"],
    active: true,
  },
];

export const OFFERS: Offer[] = [
  {
    id: "off_monitor_ergo",
    programId: "prg_bol",
    title: "ErgoDesk Pro monitorarm",
    merchant: "ErgoDesk",
    url: "https://partner.bol.com/click/monitor-ergo",
    niche: "monitorarmen",
    commissionPct: 0.08,
    epcPrior: 1.92,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 129,
    priceAsOf: "2026-08-27T10:00:00.000Z",
    inStock: true,
    searchDemand: 0.82,
    conversionPrior: 0.041,
    competitiveGap: 0.7,
    complianceRisk: 0.08,
    costWeight: 0.12,
  },
  {
    id: "off_flexispot",
    programId: "prg_awin",
    title: "Flexispot E7 sta-bureau",
    merchant: "Flexispot",
    url: "https://www.awin1.com/cread.php?awinmid=flexi",
    niche: "bureaus",
    commissionPct: 0.06,
    epcPrior: 2.4,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 449,
    priceAsOf: "2026-08-26T09:00:00.000Z",
    inStock: true,
    searchDemand: 0.74,
    conversionPrior: 0.028,
    competitiveGap: 0.55,
    complianceRisk: 0.1,
    costWeight: 0.18,
  },
  {
    id: "off_secretlab",
    programId: "prg_tt",
    title: "Secretlab Titan Evo 2026",
    merchant: "Secretlab",
    url: "https://tc.tradetracker.net/c?t=secretlab",
    niche: "bureaustoelen",
    commissionPct: 0.05,
    epcPrior: 1.1,
    cookieWindowDays: 14,
    geo: ["NL"],
    priceEur: 519,
    priceAsOf: "2026-08-25T12:00:00.000Z",
    inStock: true,
    searchDemand: 0.9,
    conversionPrior: 0.015,
    competitiveGap: 0.3,
    complianceRisk: 0.12,
    costWeight: 0.22,
  },
  {
    id: "off_keychron",
    programId: "prg_bol",
    title: "Keychron Q1 Max",
    merchant: "Keychron",
    url: "https://partner.bol.com/click/keychron-q1",
    niche: "toetsenborden",
    commissionPct: 0.07,
    epcPrior: 1.4,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 199,
    priceAsOf: "2026-08-27T08:00:00.000Z",
    inStock: true,
    searchDemand: 0.61,
    conversionPrior: 0.033,
    competitiveGap: 0.62,
    complianceRisk: 0.07,
    costWeight: 0.1,
  },
  {
    id: "off_sage",
    programId: "prg_csv",
    title: "Sage Barista Express Impress",
    merchant: "Sage",
    url: "https://feeds.yieldloop.local/sage-impress",
    niche: "espressomachines",
    commissionPct: 0.04,
    epcPrior: 2.8,
    cookieWindowDays: 21,
    geo: ["US", "NL"],
    priceEur: 699,
    priceAsOf: "2026-08-24T00:00:00.000Z",
    inStock: true,
    searchDemand: 0.7,
    conversionPrior: 0.022,
    competitiveGap: 0.48,
    complianceRisk: 0.09,
    costWeight: 0.2,
  },
  {
    id: "off_laptop_stand",
    programId: "prg_bol",
    title: "Rain Design mStand",
    merchant: "Rain Design",
    url: "https://partner.bol.com/click/mstand",
    niche: "laptopstandaards",
    commissionPct: 0.09,
    epcPrior: 1.55,
    cookieWindowDays: 30,
    geo: ["NL"],
    priceEur: 59,
    priceAsOf: "2026-08-27T11:00:00.000Z",
    inStock: true,
    searchDemand: 0.58,
    conversionPrior: 0.05,
    competitiveGap: 0.8,
    complianceRisk: 0.05,
    costWeight: 0.08,
  },
];

export const SKILLS: Skill[] = [
  {
    id: "sk_disclosure",
    slug: "disclosure-first",
    title: "Disclosure altijd eerst",
    body: "Elke publieke aanbeveling opent met het NL/EN disclosure-blok vóór de eerste affiliate-link. Nooit inkorten.",
    version: 3,
    frozen: true,
    compliance: true,
  },
  {
    id: "sk_price_date",
    slug: "dated-prices",
    title: "Prijzen dateren",
    body: "Noem peildatum (YYYY-MM-DD) bij elke prijs. Markeer STALE boven freshness SLA.",
    version: 2,
    frozen: true,
    compliance: true,
  },
  {
    id: "sk_title_nl",
    slug: "nl-comparison-titles",
    title: "NL vergelijkingstitels",
    body: "Patroon: 'Beste {product} {jaar} voor {use-case}' — geen ALL CAPS, geen guaranteed.",
    version: 1,
    frozen: false,
    compliance: false,
  },
  {
    id: "sk_cta",
    slug: "cta-plain",
    title: "CTA in plain language",
    body: "CTA = 'Bekijk bij {merchant}' — geen schaarste-fake, geen 'laatste kans'.",
    version: 1,
    frozen: false,
    compliance: false,
  },
];

function hashPolicy(p: PolicyEnvelope): string {
  return p.hash;
}

export function seedState(): YieldState {
  const policy = { ...ROOT_POLICY, hash: hashPolicy(ROOT_POLICY) };

  const bodyLive = `${NL_DISCLOSURE}

## Beste monitorarm 2026 voor thuiswerk

Een monitorarm houdt je scherm op ooghoogte en maakt bureau-ruimte vrij. We vergelijken op bereik, klembreedte en kabelgeleiding. Prijs per 2026-08-27 (peildatum).

### ErgoDesk Pro — €129 (peildatum 2026-08-27)
Stevig, 120° kantel, past op bladen tot 3,2 cm.

[Bekijk bij Bol](https://partner.bol.com/click/monitor-ergo?click_id=clk_1001)
`;

  const bodyDraft = `${NL_DISCLOSURE}

## Beste sta-bureau voor kleine kamers

Flexispot E7 is een stevig frame voor bladen tot 160 cm. Prijs €449 (peildatum 2026-08-26).

[Bekijk bij Awin](https://www.awin1.com/cread.php?awinmid=flexi&click_id=clk_1002)
`;

  const bodyBlocked = `## Wondermiddel voor focus

Wij hebben 30 dagen getest. Onze klanten zeggen dat ze 3× productiever zijn. Koop nu via https://shady-redirect.example/go?x=1

document.cookie = "aff=1";
`;

  const bodyEn = `${EN_DISCLOSURE}

## Best home espresso machine for small kitchens

Sage Barista Express Impress — €699 (price as of 2026-08-24). Built-in tamper, 15 bar.

[View at Sage](https://feeds.yieldloop.local/sage-impress?click_id=clk_1003)
`;

  return {
    version: 1,
    now: NOW,
    seq: 40,
    runState: "RUN",
    operatorId: "op_yield",
    language: "nl-NL",
    budget: {
      capEur: 2000,
      spentEur: 540,
      reservedEur: 0,
      entries: [
        {
          id: "led_001",
          at: "2026-08-20T09:00:00.000Z",
          amountEur: 400,
          reason: "station seed thuiswerk",
          stationId: "stn_thuiswerk",
          refused: false,
        },
        {
          id: "led_002",
          at: "2026-08-22T09:00:00.000Z",
          amountEur: 140,
          reason: "clone slice monitorarmen",
          stationId: "stn_monitor",
          refused: false,
        },
      ],
    },
    policy,
    stations: [
      {
        id: "stn_thuiswerk",
        name: "NL Thuiswerk",
        parentId: null,
        lineage: [],
        generation: 0,
        cloneIndex: 0,
        niche: "thuiswerk",
        language: "nl-NL",
        channel: "site",
        tier: "T2_GATED_ACT",
        status: "ACTIVE",
        policy,
        budgetCapEur: 800,
        budgetSpentEur: 220,
        cycleCount: 4,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl", "sk_cta"],
        epc: 1.82,
        clicks: 640,
        conversions: 18,
        lastCycleAt: "2026-08-27T16:00:00.000Z",
        createdAt: "2026-08-01T08:00:00.000Z",
        clonedFrom: null,
      },
      {
        id: "stn_monitor",
        name: "NL Monitorarmen",
        parentId: "stn_thuiswerk",
        lineage: ["stn_thuiswerk"],
        generation: 1,
        cloneIndex: 1,
        niche: "monitorarmen",
        language: "nl-NL",
        channel: "site",
        tier: "T1_DRAFT",
        status: "ACTIVE",
        policy: { ...policy, nicheAllowlist: ["monitorarmen", "thuiswerk"], hash: "pol_mon_01" },
        budgetCapEur: 200,
        budgetSpentEur: 48,
        cycleCount: 2,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl", "sk_cta"],
        epc: 2.1,
        clicks: 210,
        conversions: 9,
        lastCycleAt: "2026-08-27T11:00:00.000Z",
        createdAt: "2026-08-12T08:00:00.000Z",
        clonedFrom: "stn_thuiswerk",
      },
      {
        id: "stn_desk",
        name: "NL Bureaus",
        parentId: "stn_thuiswerk",
        lineage: ["stn_thuiswerk"],
        generation: 1,
        cloneIndex: 2,
        niche: "bureaus",
        language: "nl-NL",
        channel: "site",
        tier: "T1_DRAFT",
        status: "ACTIVE",
        policy: { ...policy, nicheAllowlist: ["bureaus", "thuiswerk"], hash: "pol_desk_01" },
        budgetCapEur: 180,
        budgetSpentEur: 36,
        cycleCount: 1,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_title_nl"],
        epc: 0.94,
        clicks: 88,
        conversions: 2,
        lastCycleAt: "2026-08-26T10:00:00.000Z",
        createdAt: "2026-08-18T08:00:00.000Z",
        clonedFrom: "stn_thuiswerk",
      },
      {
        id: "stn_espresso",
        name: "EN Home Espresso",
        parentId: null,
        lineage: [],
        generation: 0,
        cloneIndex: 0,
        niche: "home-espresso",
        language: "en-US",
        channel: "site",
        tier: "T3_BOUNDED_AUTO",
        status: "ACTIVE",
        policy: {
          ...policy,
          languageAllowlist: ["en-US"],
          nicheAllowlist: ["home-espresso", "espressomachines"],
          hash: "pol_esp_01",
        },
        budgetCapEur: 300,
        budgetSpentEur: 80,
        cycleCount: 3,
        skillIds: ["sk_disclosure", "sk_price_date", "sk_cta"],
        epc: 2.8,
        clicks: 190,
        conversions: 7,
        lastCycleAt: "2026-08-27T18:00:00.000Z",
        createdAt: "2026-08-08T08:00:00.000Z",
        clonedFrom: null,
      },
    ],
    programs: PROGRAMS,
    offers: OFFERS,
    artefacts: [
      {
        id: "art_monitor_live",
        stationId: "stn_monitor",
        jobId: "job_001",
        contentType: "best_x_for_y",
        title: "Beste monitorarm 2026 voor thuiswerk",
        slug: "beste-monitorarm-2026",
        language: "nl-NL",
        body: bodyLive,
        state: "PUBLISHED",
        offerIds: ["off_monitor_ergo"],
        sourceUrls: ["https://partner.bol.com/click/monitor-ergo"],
        priceAsOf: "2026-08-27T10:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1001",
        publishedAt: "2026-08-27T12:00:00.000Z",
        snapshotId: "pub_001",
        createdAt: "2026-08-27T10:30:00.000Z",
      },
      {
        id: "art_desk_draft",
        stationId: "stn_desk",
        jobId: "job_002",
        contentType: "comparison",
        title: "Beste sta-bureau voor kleine kamers",
        slug: "sta-bureau-kleine-kamers",
        language: "nl-NL",
        body: bodyDraft,
        state: "DRAFT",
        offerIds: ["off_flexispot"],
        sourceUrls: ["https://www.awin1.com/cread.php?awinmid=flexi"],
        priceAsOf: "2026-08-26T09:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1002",
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-26T11:00:00.000Z",
      },
      {
        id: "art_blocked_golden",
        stationId: "stn_thuiswerk",
        jobId: "job_003",
        contentType: "update_post",
        title: "Golden: disclosure ontbreekt",
        slug: "golden-disclosure-missing",
        language: "nl-NL",
        body: bodyBlocked,
        state: "BLOCKED",
        offerIds: [],
        sourceUrls: [],
        priceAsOf: null,
        disclosurePresent: false,
        verifyFailures: [
          { inv: "INV-1", code: "DISCLOSURE_MISSING", detail: "Geen disclosure." },
          { inv: "INV-2", code: "FAKE_TRIAL", detail: "Verzonnen 30-dagen test." },
          { inv: "INV-5", code: "ALLOWLIST_VIOLATION", detail: "shady-redirect.example" },
          { inv: "INV-4", code: "PRECONSENT_TRACKING", detail: "document.cookie" },
          { inv: "INV-6", code: "HEALTH_CURE", detail: "wondermiddel" },
        ],
        clickId: null,
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-21T09:00:00.000Z",
      },
      {
        id: "art_espresso",
        stationId: "stn_espresso",
        jobId: "job_004",
        contentType: "best_x_for_y",
        title: "Best home espresso machine for small kitchens",
        slug: "best-home-espresso-small-kitchens",
        language: "en-US",
        body: bodyEn,
        state: "PUBLISHED",
        offerIds: ["off_sage"],
        sourceUrls: ["https://feeds.yieldloop.local/sage-impress"],
        priceAsOf: "2026-08-24T00:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1003",
        publishedAt: "2026-08-24T15:00:00.000Z",
        snapshotId: "pub_002",
        createdAt: "2026-08-24T14:00:00.000Z",
      },
      {
        id: "art_chair_approved",
        stationId: "stn_thuiswerk",
        jobId: "job_005",
        contentType: "comparison",
        title: "Bureaustoel vs. knieststoel — wat past bij lang zitten",
        slug: "bureaustoel-vergelijking",
        language: "nl-NL",
        body: `${NL_DISCLOSURE}

## Bureaustoel vergelijken

Secretlab Titan Evo 2026 — €519 (peildatum 2026-08-25).

[Bekijk bij TradeTracker](https://tc.tradetracker.net/c?t=secretlab&click_id=clk_1005)
`,
        state: "APPROVED",
        offerIds: ["off_secretlab"],
        sourceUrls: ["https://tc.tradetracker.net/c?t=secretlab"],
        priceAsOf: "2026-08-25T12:00:00.000Z",
        disclosurePresent: true,
        verifyFailures: [],
        clickId: "clk_1005",
        publishedAt: null,
        snapshotId: null,
        createdAt: "2026-08-28T07:10:00.000Z",
      },
    ],
    publishes: [
      {
        id: "pub_001",
        artefactId: "art_monitor_live",
        stationId: "stn_monitor",
        slug: "beste-monitorarm-2026",
        status: "ACTIVE",
        snapshot: bodyLive,
        publishedAt: "2026-08-27T12:00:00.000Z",
        rolledBackAt: null,
        dryRun: false,
      },
      {
        id: "pub_002",
        artefactId: "art_espresso",
        stationId: "stn_espresso",
        slug: "best-home-espresso-small-kitchens",
        status: "ACTIVE",
        snapshot: bodyEn,
        publishedAt: "2026-08-24T15:00:00.000Z",
        rolledBackAt: null,
        dryRun: false,
      },
    ],
    memos: [
      {
        id: "memo_001",
        stationId: "stn_thuiswerk",
        cycle: 4,
        claims: [
          "Monitorarmen hebben hogere EPC-prior dan stoelen in NL thuiswerk.",
          "Sta-bureaus converteren trager maar AOV dekt commissie.",
        ],
        assumptions: [
          {
            text: "Cookie-window 30d is genoeg voor overwogen aankoop",
            hypothesis: "assisted-click share ≥ 25% binnen 30 dagen",
          },
        ],
        killCriteria: [{ metric: "EPC", floor: 0.6, windowDays: 14 }],
        chosenOfferIds: ["off_monitor_ergo", "off_flexispot"],
        explorer: false,
        createdAt: "2026-08-27T16:00:00.000Z",
      },
    ],
    events: [
      {
        id: "evt_001",
        at: "2026-08-12T08:00:00.000Z",
        type: "STATION_CLONED",
        actorId: "op_yield",
        stationId: "stn_monitor",
        detail: "NL Monitorarmen gekloond uit NL Thuiswerk",
      },
      {
        id: "evt_002",
        at: "2026-08-18T08:00:00.000Z",
        type: "STATION_CLONED",
        actorId: "op_yield",
        stationId: "stn_desk",
        detail: "NL Bureaus gekloond uit NL Thuiswerk",
      },
      {
        id: "evt_003",
        at: "2026-08-27T12:00:00.000Z",
        type: "PUBLISHED",
        actorId: "op_yield",
        stationId: "stn_monitor",
        detail: "beste-monitorarm-2026 live (PublishRecord pub_001)",
      },
      {
        id: "evt_004",
        at: "2026-08-21T09:05:00.000Z",
        type: "VERIFY_BLOCKED",
        actorId: "verifier",
        stationId: "stn_thuiswerk",
        detail: "Golden-set: disclosure_missing + fabricated + allowlist",
      },
      {
        id: "evt_005",
        at: "2026-08-28T07:12:00.000Z",
        type: "AWAITING_APPROVAL",
        actorId: "producer",
        stationId: "stn_thuiswerk",
        detail: "Bureaustoel-vergelijking APPROVED, wacht op T2-token",
      },
    ],
    jobs: [],
    skills: SKILLS,
    patches: [
      {
        id: "pat_001",
        stationId: "stn_monitor",
        title: "Korte titels converteren beter op monitorarmen",
        body: "Gewicht +0.12 op template best_x_for_y × niche monitorarmen. Compliance-skills ongemoeid.",
        touchesCompliance: false,
        status: "PROPOSED",
        skillTarget: "sk_title_nl",
        createdAt: "2026-08-27T17:00:00.000Z",
      },
    ],
    proposals: [
      {
        id: "exp_clone_laptop",
        kind: "CLONE_STATION",
        stationId: "stn_thuiswerk",
        title: "Kloon naar NL Laptopstandaards",
        rationale:
          "Hoge competitive gap (0.80) en lage compliance-risk. Explorer-slot deze week nog vrij.",
        payload: {
          parentId: "stn_thuiswerk",
          childName: "NL Laptopstandaards",
          childNiche: "laptopstandaards",
          language: "nl-NL",
          channel: "site",
          budgetSliceEur: 90,
          actorId: "stn_thuiswerk",
          idempotencyKey: "clone:stn_thuiswerk:laptopstandaards:site",
        },
        status: "PROPOSED",
        createdAt: "2026-08-28T06:40:00.000Z",
      },
    ],
    tokens: [
      {
        id: "tok_pub_chair",
        action: "PUBLISH",
        subjectId: "art_chair_approved",
        issuedAt: NOW,
        expiresAt: "2026-08-29T08:00:00.000Z",
        actorId: "op_yield",
        consumed: false,
      },
    ],
    conversions: [
      {
        id: "cv_001",
        clickId: "clk_1001",
        stationId: "stn_monitor",
        offerId: "off_monitor_ergo",
        amountEur: 129,
        commissionEur: 10.32,
        at: "2026-08-27T19:00:00.000Z",
        source: "fixture",
        refunded: false,
      },
      {
        id: "cv_002",
        clickId: "clk_1003",
        stationId: "stn_espresso",
        offerId: "off_sage",
        amountEur: 699,
        commissionEur: 27.96,
        at: "2026-08-25T10:00:00.000Z",
        source: "fixture",
        refunded: false,
      },
    ],
    clicks: [
      {
        id: "cl_001",
        clickId: "clk_1001",
        stationId: "stn_monitor",
        artefactId: "art_monitor_live",
        offerId: "off_monitor_ergo",
        at: "2026-08-27T14:10:00.000Z",
      },
    ],
    clones: [
      {
        id: "clo_001",
        parentId: "stn_thuiswerk",
        childId: "stn_monitor",
        generation: 1,
        budgetSliceEur: 200,
        policyHash: "pol_mon_01",
        createdAt: "2026-08-12T08:00:00.000Z",
        idempotencyKey: "clone:stn_thuiswerk:monitorarmen:site",
      },
      {
        id: "clo_002",
        parentId: "stn_thuiswerk",
        childId: "stn_desk",
        generation: 1,
        budgetSliceEur: 180,
        policyHash: "pol_desk_01",
        createdAt: "2026-08-18T08:00:00.000Z",
        idempotencyKey: "clone:stn_thuiswerk:bureaus:site",
      },
    ],
    lastCycle: null,
    golden: [],
  };
}

export const GOLDEN_BODIES = {
  disclosure_missing: `## Beste toetsenbord

Koop de Keychron via https://partner.bol.com/click/keychron-q1?click_id=clk_x
`,
  fabricated_claim: `${NL_DISCLOSURE}

Wij hebben 30 dagen getest. Onze klanten zeggen dat het perfect is.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
`,
  stale_price: `${NL_DISCLOSURE}

De Keychron Q1 Max kost €199.

[Bekijk](https://partner.bol.com/click/keychron-q1?click_id=clk_x)
`,
  allowlist_violation: `${NL_DISCLOSURE}

[Bekijk](https://evil.example/go?click_id=clk_x)
`,
};
