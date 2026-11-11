// Scope and concentration notes for the tracked series, shown wherever the
// affected number is quoted (protocol page, answer page, monthly report).
//
// The figures in these notes come from the coverage-extensions feed
// (lib/coverage-feed.ts) and are computed at render time. The STATIC_* texts
// are the dated fallbacks used only when that feed is unreachable: they state
// what was checked and when, and carry no figure that could go stale silently.

import type { CoverageSummary, SourceWindow } from "./coverage-feed";

export const NOTES_REVIEWED = "November 11, 2026";

const fmt = (v: number): string => v.toLocaleString("en-US");
const pct = (share: number): string => `${Math.round(share * 1000) / 10}%`;
const longDay = (day: string): string =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const chainName = (c: string): string => ({ base: "Base", robinhood: "Robinhood Chain", arc: "Arc" })[c] ?? c;
const list = (items: string[]): string => (items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

const STATIC_ERC8004_NOTE =
  `Concentration: registering is cheap, and one integration can dominate the count. An agent economy scan of the agent-card URL in every Registered event found that a single domain (centralcity.ai) accounted for the large majority of registrations from mid-October 2026 onward, each under a different owner address. Read the October–November surge as one application onboarding accounts rather than broad-based adoption. Reviewed ${NOTES_REVIEWED}.`;

const STATIC_ACP_NOTE =
  `Scope: the memo series counts ACP's two legacy contracts on Base, where activity fell to near zero in early November 2026. Virtuals' current ACP contract is deployed on Base, Robinhood Chain, Arc and Solana; this site tracks its EVM deployments separately, in jobs, and does not cover Solana. Read the memo series as the wind-down of the legacy contracts, not as a measure of all ACP activity. Reviewed ${NOTES_REVIEWED}.`;

const windowSentence = (w: SourceWindow, period: string): string =>
  `${period}, ${pct(w.largestShare)} of ${fmt(w.total)} registrations across all tracked chains carried agent-card URLs on a single domain (${w.largestSource}); excluding it leaves ${fmt(w.exLargest)}.`;

export function erc8004Note(c: CoverageSummary | null): string {
  const e = c?.erc;
  if (!e) return STATIC_ERC8004_NOTE;
  return `Concentration: registering is cheap, and one integration can dominate the count. ${windowSentence(e.last7, `In the seven days to ${longDay(e.last7.to)}`)} Each of those registrations sits under a different owner address, so the count says little about how many operators are behind it. Measured daily from the agent-card URL in every Registered event.`;
}

export function acpNote(c: CoverageSummary | null): string {
  const a = c?.acp;
  if (!a) return STATIC_ACP_NOTE;
  return `Scope: the memo series counts ACP's two legacy contracts on Base, where activity fell to near zero in early November 2026. Virtuals' current ACP contract is tracked separately, in jobs: ${fmt(a.last7.created)} jobs were created on it in the seven days to ${longDay(a.last7.to)} (${fmt(a.last7.completed)} completed), on ${list(a.chains.map(chainName))}, and it has averaged about ${fmt(a.perDay)} a day since this series starts on ${longDay(a.since)}. That contract was already live before the legacy contracts went quiet, so the decline in memos is not simply activity moving to it. ACP on Solana is not covered. Jobs and memos are different units and are never added together.`;
}

// Notes attached to a monthly report at render time. The fixed editions in
// monthly-reports.json are never rewritten; these sit beside the numbers.
export function reportAnnotations(ym: string, c: CoverageSummary | null): string[] {
  if (ym < "2026-10") return [];
  const notes: string[] = [];
  const month = c?.erc?.month(ym) ?? null;
  if (month && month.largestShare >= 0.5) {
    notes.push(`ERC-8004 registrations are concentrated. ${windowSentence(month, "Across the month")} Read the month-over-month figure as one application onboarding accounts, not broad-based adoption.`);
  } else if (!month && ym === "2026-10") {
    notes.push("ERC-8004 registrations: the October surge is concentrated in a single application (agent cards hosted on centralcity.ai). Read the month-over-month figure as one application onboarding accounts, not broad-based adoption.");
  }
  notes.push("Virtuals ACP memos: counted on ACP's two legacy Base contracts only. Activity on Virtuals' current ACP contract is tracked separately in jobs and is not part of this figure, so the change describes the legacy contracts, not all ACP activity.");
  return notes;
}
