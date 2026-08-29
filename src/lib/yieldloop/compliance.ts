import {
  EN_DISCLOSURE,
  NL_DISCLOSURE,
  type Artefact,
  type ArtefactState,
  type InvariantId,
  type Language,
  type Program,
  type PublishRecord,
  type VerifyFailure,
  type VerifyReport,
} from "./contracts.ts";

/** INV-2 fabricated-proof patterns (nl + en). */
export const FABRICATED_PATTERNS: { code: string; re: RegExp }[] = [
  { code: "FAKE_TESTIMONIAL", re: /onze klanten zeggen|dummy review|lorem testimonial/i },
  { code: "FAKE_LAB", re: /lab[- ]?test(?:ed|ed by us)|in ons laboratorium/i },
  { code: "FAKE_TRIAL", re: /wij hebben \d+ dagen getest|we (?:tested|have tested) (?:it )?for \d+ days/i },
  { code: "FAKE_GUARANTEE_INCOME", re: /gegarandeerd inkomen|guaranteed income|word rijk|get rich quick/i },
];

const PROHIBITED_CLAIM_PATTERNS: { code: string; re: RegExp; inv: InvariantId }[] = [
  { code: "HEALTH_CURE", re: /geneest|cures? cancer|wondermiddel|miracle (?:cure|pill)/i, inv: "INV-6" },
  { code: "GUARANTEED_INCOME", re: / gegarandeerd €|guaranteed returns|passive income guaranteed/i, inv: "INV-6" },
  { code: "CRYPTO_GET_RICH", re: /crypto get rich|100x coin| gegarandeerde winst/i, inv: "INV-6" },
];

const PRECONSENT_COOKIE = /document\.cookie\s*=|setCookie\(|tracking pixel before consent|facebook pixel without consent/i;

const PRICE_RE = /€\s?\d+(?:[.,]\d{2})?|\b\d+(?:[.,]\d{2})?\s?EUR/i;
const DATED_PRICE_RE = /(?:as_of|peildatum|prijs per|price as of)\s*[:\-]?\s*\d{4}-\d{2}-\d{2}/i;
const URL_RE = /https?:\/\/[^\s)]+/gi;

export function disclosureFor(lang: Language): string {
  return lang === "en-US" ? EN_DISCLOSURE : NL_DISCLOSURE;
}

export function findDisclosureIndex(body: string, lang: Language): number {
  const d = disclosureFor(lang);
  const idx = body.indexOf(d);
  if (idx >= 0) return idx;
  // plain-language fallback: must mention affiliate + commissie/commission
  const loose =
    lang === "en-US"
      ? /affiliate links[\s\S]{0,120}commission/i
      : /affiliate links[\s\S]{0,160}commissie/i;
  const m = loose.exec(body);
  return m ? m.index : -1;
}

export function extractUrls(body: string): string[] {
  return body.match(URL_RE) ?? [];
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isAffiliateUrl(url: string, programs: Program[]): boolean {
  const host = hostOf(url);
  return programs.some((p) => p.domainAllowlist.some((d) => host === d || host.endsWith(`.${d}`)));
}

export function hasClickId(url: string): boolean {
  try {
    return new URL(url).searchParams.has("click_id");
  } catch {
    return /[?&]click_id=/.test(url);
  }
}

export function isAllowlistedUrl(url: string, programs: Program[]): boolean {
  const host = hostOf(url);
  if (!host) return false;
  return programs.some(
    (p) => p.active && p.domainAllowlist.some((d) => host === d || host.endsWith(`.${d}`)),
  );
}

/**
 * INV-1…INV-6 verifier. Gate, not vibe.
 * Enforced at: verifyArtefact (this file) — see SAFETY.md.
 */
export function verifyArtefact(art: Artefact, programs: Program[]): VerifyReport {
  const failures: VerifyFailure[] = [];
  const body = art.body;

  const disclosureIdx = findDisclosureIndex(body, art.language);
  const urls = extractUrls(body);
  const affiliateUrls = urls.filter((u) => isAffiliateUrl(u, programs) || /click_id=/.test(u));
  const firstAffiliateIdx = affiliateUrls.reduce((min, u) => {
    const i = body.indexOf(u);
    return i >= 0 && (min < 0 || i < min) ? i : min;
  }, -1);

  // INV-1 Disclosure before first affiliate link
  if (affiliateUrls.length > 0) {
    if (disclosureIdx < 0) {
      failures.push({
        inv: "INV-1",
        code: "DISCLOSURE_MISSING",
        detail: "Publieke aanbeveling zonder disclosure vóór de eerste affiliate-link.",
      });
    } else if (firstAffiliateIdx >= 0 && disclosureIdx > firstAffiliateIdx) {
      failures.push({
        inv: "INV-1",
        code: "DISCLOSURE_AFTER_LINK",
        detail: "Disclosure staat ná de eerste affiliate-link.",
      });
    }
  }

  // INV-2 No fabricated proof
  for (const p of FABRICATED_PATTERNS) {
    if (p.re.test(body)) {
      failures.push({
        inv: "INV-2",
        code: p.code,
        detail: "Verzonnen bewijs of testimonial zonder operator-evidence.",
      });
    }
  }

  // INV-3 Prices dated
  if (PRICE_RE.test(body)) {
    const dated = Boolean(art.priceAsOf) || DATED_PRICE_RE.test(body);
    if (!dated) {
      failures.push({
        inv: "INV-3",
        code: "UNDATED_PRICE",
        detail: "Prijs zonder as_of / peildatum.",
      });
    }
  }

  // INV-4 Consent boundary
  if (PRECONSENT_COOKIE.test(body) || /cookie-stuff|pixel pre-consent/i.test(body)) {
    failures.push({
      inv: "INV-4",
      code: "PRECONSENT_TRACKING",
      detail: "Tracking/cookie vóór consent is verboden.",
    });
  }

  // INV-5 Allowlist + click_id
  for (const url of affiliateUrls) {
    if (!isAllowlistedUrl(url, programs)) {
      failures.push({
        inv: "INV-5",
        code: "ALLOWLIST_VIOLATION",
        detail: `URL niet op program-allowlist: ${url}`,
      });
    }
    if (!hasClickId(url)) {
      failures.push({
        inv: "INV-5",
        code: "MISSING_CLICK_ID",
        detail: `Affiliate-URL mist click_id: ${url}`,
      });
    }
  }

  // INV-6 Prohibited verticals / claims
  for (const p of PROHIBITED_CLAIM_PATTERNS) {
    if (p.re.test(body)) {
      failures.push({
        inv: p.inv,
        code: p.code,
        detail: "Verboden claim of vertical.",
      });
    }
  }

  return { ok: failures.length === 0, failures };
}

/** Honest UI: never "Live" without an active PublishRecord. */
export function isLive(artefact: Artefact, publishes: PublishRecord[]): boolean {
  if (artefact.state !== "PUBLISHED") return false;
  return publishes.some(
    (p) => p.artefactId === artefact.id && p.status === "ACTIVE" && !p.dryRun,
  );
}

export function publicLabel(artefact: Artefact, publishes: PublishRecord[]): ArtefactState | "LIVE" {
  return isLive(artefact, publishes) ? "LIVE" : artefact.state;
}

export function canTransitionToPublished(
  artefact: Artefact,
  publishes: PublishRecord[],
  report: VerifyReport,
): { ok: boolean; reason: string } {
  if (!report.ok) return { ok: false, reason: "VERIFY_FAILED" };
  if (artefact.state === "FROZEN") return { ok: false, reason: "FROZEN" };
  if (artefact.verifyFailures.some((f) => f.inv === "INV-1")) {
    return { ok: false, reason: "DISCLOSURE_GATE" };
  }
  void publishes;
  return { ok: true, reason: "OK" };
}

export const SAFETY_MAP: { inv: InvariantId; title: string; file: string; symbol: string }[] = [
  { inv: "INV-1", title: "Disclosure", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-2", title: "No fabricated proof", file: "src/lib/yieldloop/compliance.ts", symbol: "FABRICATED_PATTERNS" },
  { inv: "INV-3", title: "Prices are dated", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-4", title: "Consent boundary", file: "src/lib/yieldloop/compliance.ts", symbol: "verifyArtefact" },
  { inv: "INV-5", title: "Allowlist only", file: "src/lib/yieldloop/compliance.ts", symbol: "isAllowlistedUrl" },
  { inv: "INV-6", title: "Prohibited verticals", file: "src/lib/yieldloop/compliance.ts", symbol: "PROHIBITED_CLAIM_PATTERNS" },
  { inv: "INV-7", title: "Spend cap", file: "src/lib/yieldloop/engine.ts", symbol: "debitBudget" },
  { inv: "INV-8", title: "Human override", file: "src/lib/yieldloop/engine.ts", symbol: "setRunState" },
  { inv: "INV-9", title: "Station clone gates", file: "src/lib/yieldloop/engine.ts", symbol: "evaluateClone" },
];
