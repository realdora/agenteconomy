// Per-protocol overview rows for the homepage ProductsSection — the 5 tracked
// standards, each with its real headline total and its real activity series from
// agenteconomy.to/data.json. Server-fetched with hourly ISR + a baked-in fallback
// (real values captured from the 2026-06-05 snapshot).

const DATA_URL = "https://agenteconomy.to/data.json";

export type ProtocolRow = {
  slug: string;
  name: string;
  desc: string;
  href: string;
  color: string;
  logo: string | null; // white-chip mark; null → monogram fallback
  metric: number; // canonical total, raw integer
  unit: string; // what the metric counts
  extra: string | null; // secondary facts, pre-formatted
  spark: number[]; // real activity series (trailing partial bucket trimmed)
  sparkUnit: string; // caption under the cumulative sparkline
};

export type ProtocolIndexData = {
  updatedAt: string | null;
  rows: ProtocolRow[];
  baseAgenticTxs: number; // ecosystem-context aggregate, cited in the section footnote
};

// The last bucket of every series is the in-progress day/week at snapshot time —
// plotting it reads as a crash, so it's trimmed everywhere spark data is built.
const trimPartial = (a: number[]) => a.slice(0, -1);

const round1 = (n: number) => Math.round(n * 10) / 10;

export function formatMetric(n: number): string {
  if (n >= 1e6) return `${round1(n / 1e6)}M`;
  if (n >= 1e3) return `${round1(n / 1e3)}K`;
  return `${n}`;
}

type RowSeed = Omit<ProtocolRow, "metric" | "extra" | "spark"> & {
  metric?: number;
  extra?: string | null;
  spark?: number[];
};

const SEEDS: Record<string, RowSeed> = {
  x402: {
    slug: "x402",
    name: "x402",
    desc: "HTTP 402 payment standard for agents",
    href: "/x402",
    color: "#00FF88",
    logo: "/logos/protocols/x402.png",
    unit: "transactions",
    sparkUnit: "cumulative · daily",
  },
  erc8004: {
    slug: "erc8004",
    name: "ERC-8004",
    desc: "Trust layer for AI agents",
    href: "/erc-8004",
    color: "#7ad7ff",
    logo: null,
    unit: "agents registered",
    sparkUnit: "cumulative · daily",
  },
  virtualsAcp: {
    slug: "virtualsAcp",
    name: "Virtuals ACP",
    desc: "Agent Commerce Protocol",
    href: "/virtuals-acp",
    color: "#9E7BFF",
    logo: "/logos/protocols/virtuals.png",
    unit: "memos",
    sparkUnit: "cumulative · daily",
  },
  olas: {
    slug: "olas",
    name: "Olas",
    desc: "Autonomous agent network",
    href: "/olas",
    color: "#c0c4cc",
    logo: "/logos/protocols/olas.png",
    unit: "transactions",
    sparkUnit: "cumulative · weekly",
  },
  tempoMpp: {
    slug: "tempoMpp",
    name: "Tempo MPP",
    desc: "Machine Payments Protocol",
    href: "/tempo-mpp",
    color: "#ff7ab6",
    logo: "/logos/protocols/tempo.svg",
    unit: "events",
    sparkUnit: "cumulative · daily",
  },
};

function row(slug: keyof typeof SEEDS, metric: number, extra: string | null, spark: number[]): ProtocolRow {
  return { ...SEEDS[slug], metric, extra, spark } as ProtocolRow;
}

// Real values from the 2026-06-05 data.json snapshot (series pre-trimmed).
export const FALLBACK: ProtocolIndexData = {
  updatedAt: "2026-06-05T02:24:11.586Z",
  baseAgenticTxs: 1124261,
  rows: [
    row("x402", 150005139, "$40.7M settled · 7 chains", [171365, 164849, 165442, 163380, 165076, 165275, 157945, 163457, 159395, 162183, 166606, 170264, 166936, 164109, 167682, 165186, 167914, 166531, 173756, 168600, 161187, 167101, 169794, 165888, 165355, 159054, 166031, 167010, 165350, 167805, 160439, 166198, 165761, 163292, 158250, 159084, 155470, 148903, 163078, 160155, 160086, 160339, 165805, 165112, 175166, 182763, 183310, 184323, 182457, 179932, 182124, 182280, 183402, 183771, 182960, 224434, 199489, 191399, 175659]),
    row("erc8004", 216746, "24 chains", [614, 2477, 639, 13955, 605, 3329, 400, 548, 765, 3222, 1740, 5516, 3883, 310, 381, 621, 8886, 434, 205, 735, 1962, 1558, 743, 916, 5458, 5758, 7734, 6672, 2903, 2413, 2601, 2219, 2357, 2502, 1669, 2004, 1990, 1954, 4186, 3991, 2407, 2748, 1783, 1863, 1755, 1749, 1402, 3459, 1603, 1434, 2485, 3508, 1078, 1265, 1096, 1039, 1021, 938, 613, 739, 996, 5928, 794, 823, 767, 852, 827, 1144, 1221, 1501, 1364, 1114, 1272, 1590, 1098, 1672, 1360, 1084, 1109, 791, 960, 1090, 1043, 963, 808, 854, 1069, 1043, 915]),
    row("virtualsAcp", 12314057, null, [107750, 58919, 65916, 148377, 176625, 192341, 147788, 81173, 118729, 108371, 110442, 78992, 111070, 130169, 106781, 48622, 100898, 111060, 113684, 90253, 39075, 19282, 14907, 20366, 30335, 34959, 30989, 31605, 38759, 26770, 30392, 18788, 20625, 17369, 24281, 26349, 29081, 32823, 25477, 18676, 14147, 16916, 28510, 19435, 18600, 10247, 12134, 14662, 12789, 10321, 10374, 10164, 13651, 11588, 10056, 6167, 4899, 8407, 8972, 4786, 2857, 2361, 2070, 3301, 3398, 2984, 4757, 4169, 1359, 1184, 1099, 1223, 1929, 1417, 1157, 1337, 1057, 2025, 1349, 755, 1106, 759, 289, 389, 415, 377, 1437, 706, 386]),
    row("olas", 16449330, "8 chains", [160392, 135265, 171800, 163870, 142262, 229170, 202915, 243990, 232670, 194248, 166044, 145760, 140442, 202999, 186052, 166546, 182906, 226489, 186094, 212017, 185254, 209169, 201856, 176599, 223673, 212574, 281935, 203423, 261701, 212634, 208147, 234509, 254522, 211407, 225627, 187315, 172233, 166536, 158369, 146546, 120574, 128477, 131571, 126166, 171801, 180943, 203504, 316492, 222897, 180874, 197258]),
    row("tempoMpp", 26457, "653 payers", [1418, 10127, 565, 778, 406, 423, 347, 518, 433, 377, 288, 134, 279, 369, 493, 393, 474, 274, 312, 172, 287, 202, 144, 379, 210, 429, 392, 201, 289, 642, 1680, 474, 224, 75, 302, 251, 637, 422]),
  ],
};

export async function getProtocolIndex(): Promise<ProtocolIndexData> {
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    const d = await res.json();
    const num = (v: unknown) => (typeof v === "number" ? v : 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series = (arr: any, field: string): number[] =>
      Array.isArray(arr) ? trimPartial(arr.map((e) => num(e?.[field]))) : [];

    const x = d.x402 ?? {};
    const rows = [
      row(
        "x402",
        num(x.totalTxs),
        `$${round1(num(x.totalVolume) / 1e6)}M settled · ${num(x.chainsTracked)} chains`,
        series(x.daily, "txs"),
      ),
      row("erc8004", num(d.erc8004Registry?.totalAgents), `${num(d.erc8004Registry?.chainsTracked)} chains`, series(d.erc8004Registry?.daily, "agents")),
      row("virtualsAcp", num(d.virtualsAcp?.totalMemos), null, series(d.virtualsAcp?.daily, "memos")),
      row("olas", num(d.olas?.totalTxs), `${Array.isArray(d.olas?.chains) ? d.olas.chains.length : 0} chains`, series(d.olas?.weekly, "txs")),
      row("tempoMpp", num(d.tempoMpp?.totalEvents), `${num(d.tempoMpp?.uniquePayers)} payers`, series(d.tempoMpp?.daily, "events")),
    ];
    // Any empty metric/series means the source moved under us — fall back whole.
    if (rows.some((r) => !r.metric || r.spark.length < 2)) return FALLBACK;
    return {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      rows,
      baseAgenticTxs: num(d.baseAgentic?.totalTxs) || FALLBACK.baseAgenticTxs,
    };
  } catch {
    return FALLBACK;
  }
}
