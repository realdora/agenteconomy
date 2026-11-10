// Dated analyst notes on known scope limits and concentration in the tracked
// series. These are editorial findings with their method stated, not live
// figures: each one names what was checked and when, and is shown wherever the
// affected number is quoted (protocol page, answer page, monthly report).
// When a note stops being true — the pipeline gains the missing coverage, or a
// re-check finds a different picture — update or remove it here, in one place.

export const NOTES_REVIEWED = "November 10, 2026";

// Virtuals ACP: the pipeline decodes NewMemo events from two Base contracts
// (0x6a1f…0a4a and 0x9c6c…f30c). Virtuals' current SDK (acp-node-v2) targets a
// newer contract generation on Base, Robinhood Chain, Arc and Solana.
export const ACP_SCOPE_NOTE =
  `Scope: this series counts memos on ACP's two legacy contracts on Base. Virtuals has since moved ACP to a newer contract generation — deployed on Base, Robinhood Chain, Arc and Solana, per its acp-node-v2 SDK — which this tracker does not cover yet. Activity on the legacy contracts fell to near zero in early November 2026, so read the recent series as the wind-down of those contracts, not as a measure of all ACP activity. Reviewed ${NOTES_REVIEWED}.`;

// ERC-8004: 14 time windows of Registered events on Base's identity registry
// (0x8004a169…a432), October 14 – November 10, 2026: 18,355 registrations,
// 18,021 of them with agent-card URLs on centralcity.ai.
export const ERC8004_CONCENTRATION_NOTE =
  `Concentration: registering is cheap, and one integration can dominate the count. In an agent economy review of 18,355 registrations on Base's ERC-8004 identity registry, sampled across 14 time windows between October 14 and November 10, 2026, 98% carried agent-card URLs on a single domain (centralcity.ai), each under a different owner address. The October–November surge is best read as one application onboarding accounts rather than broad-based adoption. Other chains were not sampled. Reviewed ${NOTES_REVIEWED}.`;

// Notes attached to a monthly report at render time. The fixed editions in
// monthly-reports.json are never rewritten; these sit beside the numbers.
export const REPORT_ANNOTATIONS: Record<string, string[]> = {
  "2026-10": [
    "ERC-8004 registrations: the October surge is concentrated. In a sample of 18,355 Base registrations between October 14 and November 10, 2026, 98% carried agent-card URLs on a single domain (centralcity.ai). Read the month-over-month figure as one application onboarding accounts, not broad-based adoption.",
    "Virtuals ACP memos: counted on ACP's two legacy Base contracts only. Virtuals has moved ACP to a newer contract generation that this report does not cover, so the decline describes the legacy contracts, not all ACP activity.",
  ],
};
