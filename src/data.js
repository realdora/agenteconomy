export const SOURCES = {
  x402: [
    { label: '@thechriscen / x402 Payment Analytics', href: 'https://dune.com/thechriscen/x402-payment-analytics' },
    { label: '@hashed_official / x402 Analytics', href: 'https://dune.com/hashed_official/x402-analytics' },
  ],
  erc8004: [
    { label: '@ax1research / BASE Agentic Ecosystem', href: 'https://dune.com/ax1research/base-agentic-ecosystem' },
    { label: '@hashed_official / ERC-8004 Registry', href: 'https://dune.com/hashed_official/erc8004' },
  ],
  acp: [
    { label: '@hashed_official / Virtuals ACP', href: 'https://dune.com/hashed_official/acp-virtuals' },
  ],
  olas: [
    { label: '@adrian0x / Olas Ecosystem', href: 'https://dune.com/adrian0x/autonolas-ecosystem-activity' },
  ],
  tempo: [
    { label: 'Tempo RPC indexer', href: '/tempo-data.json' },
  ],
}

export const FB = {
  updatedAt: '2026-04-04T00:00:00Z',
  x402: {
    totalTxs: 139277505,
    totalVolume: 38843631,
    facilitatorsTracked: 15,
    chainsTracked: 7,
    monthly: [
      { month: "Oct '25", txs: 28400000, vol: 8200000 },
      { month: "Nov '25", txs: 61200000, vol: 14300000 },
      { month: "Dec '25", txs: 22800000, vol: 7100000 },
      { month: "Jan '26", txs: 14600000, vol: 4800000 },
      { month: "Feb '26", txs: 8100000, vol: 2900000 },
      { month: "Mar '26", txs: 4177505, vol: 1543631 },
    ],
    daily: [],
    protocols: [
      { name: 'Coinbase', share: 45.4, color: '#0052FF' },
      { name: 'Dexter', share: 15.0, color: '#6366F1' },
      { name: 'PayAI', share: 13.6, color: '#10B981' },
      { name: 'DayDreams', share: 11.6, color: '#F59E0B' },
      { name: 'ThirdWeb', share: 7.1, color: '#A855F7' },
      { name: 'Other', share: 7.3, color: '#9CA3AF' },
    ],
    chains: [
      { name: 'Base', txs: 72058130, color: '#0052FF' },
      { name: 'Solana', txs: 47231681, color: '#9945FF' },
      { name: 'Polygon', txs: 7184927, color: '#8247E5' },
      { name: 'BNB', txs: 658610, color: '#F0B90B' },
      { name: 'Avalanche', txs: 4612, color: '#E84142' },
      { name: 'Arbitrum', txs: 522, color: '#12AAFF' },
      { name: 'SEI', txs: 142, color: '#9D4EDD' },
    ],
  },
  baseAgentic: { totalTxs: 709494, daily: [] },
  virtualsAcp: { totalMemos: 0, daily: [] },
  tempoMpp: { totalEvents: 0, uniquePayers: 0, uniquePayees: 0, byType: {}, daily: [] },
  erc8004Registry: { totalAgents: 0, chainsTracked: 0, chains: [], daily: [] },
  olas: { totalTxs: 0, chains: [], weekly: [] },
}
