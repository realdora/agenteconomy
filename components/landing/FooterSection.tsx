export function FooterSection() {
  return (
    <footer className="border-t border-white/10 py-16 md:py-20 lg:py-24">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Editorial statement */}
          <p className="font-display italic text-white text-[22px] md:text-[28px] leading-snug text-balance max-w-3xl">
            A reference dataset for agentic payments.
            <br />
            Indexed from public chain state.
          </p>

          {/* Bottom — links + copyright */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-10 border-t border-white/10">
            <nav className="flex items-center gap-x-8 gap-y-3 flex-wrap font-mono text-[12px] uppercase tracking-[0.18em]">
              <a
                href="https://github.com/realdora/agenteconomy"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/55 hover:text-white transition"
              >
                GitHub
              </a>
              <a
                href="https://x.com/realdora_eth"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/55 hover:text-white transition"
              >
                X
              </a>
              <span className="text-white/15">·</span>
              <a href="/x402" className="text-white/55 hover:text-white transition">
                x402
              </a>
              <a href="/erc-8004" className="text-white/55 hover:text-white transition">
                ERC-8004
              </a>
              <a href="/virtuals-acp" className="text-white/55 hover:text-white transition">
                Virtuals ACP
              </a>
              <a href="/olas" className="text-white/55 hover:text-white transition">
                Olas
              </a>
              <a href="/tempo-mpp" className="text-white/55 hover:text-white transition">
                Tempo MPP
              </a>
              <span className="text-white/15">·</span>
              <a href="/stats" className="text-white/55 hover:text-white transition">
                Stats
              </a>
              <a href="/reports" className="text-white/55 hover:text-white transition">
                Reports
              </a>
              <a href="/methodology" className="text-white/55 hover:text-white transition">
                Methodology
              </a>
              <a href="/data" className="text-white/55 hover:text-white transition">
                Data
              </a>
              <a href="/about" className="text-white/55 hover:text-white transition">
                About
              </a>
            </nav>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
              © 2026 agent economy
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
