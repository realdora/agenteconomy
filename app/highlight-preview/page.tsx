import type { Metadata } from "next";

import { HighlightVariantA } from "@/components/landing/highlight-variants/HighlightVariantA";
import { HighlightVariantB } from "@/components/landing/highlight-variants/HighlightVariantB";
import { HighlightVariantC } from "@/components/landing/highlight-variants/HighlightVariantC";
import { HighlightVariantD } from "@/components/landing/highlight-variants/HighlightVariantD";

export const metadata: Metadata = {
  title: "Highlight section variants | Agent Economy v4",
};

function VariantHeader({ tag, name, note }: { tag: string; name: string; note: string }) {
  return (
    <div className="px-6 py-4 border-y border-white/10 bg-white/[0.02]">
      <div className="w-[1240px] max-w-full mx-auto px-5 flex items-baseline gap-6 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF88]">{tag}</span>
        <span className="font-medium text-white text-base">{name}</span>
        <span className="text-white/45 text-[13px] font-mono">{note}</span>
      </div>
    </div>
  );
}

export default function HighlightPreviewPage() {
  return (
    <main className="min-h-screen bg-[#060607] text-white">
      <div className="px-6 py-10">
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/45">
          Highlight section variants · /highlight-preview
        </div>
        <div className="mt-2 text-white/55 text-[13px] max-w-2xl">
          4 layout directions for the new highlight section between Trust and Platform. Pick one to promote.
        </div>
      </div>

      <VariantHeader tag="VARIANT A" name="Big stats banner — typography-led, near-static" note="5 / 11+ / 173M+ / 24-7" />
      <HighlightVariantA />

      <VariantHeader tag="VARIANT B" name="5 protocol cards with sparkline + delta" note="per-protocol mini stats, counters tick" />
      <HighlightVariantB />

      <VariantHeader tag="VARIANT C" name="FT-style hero chart + editorial caption" note="30-day series, line draws in on mount" />
      <HighlightVariantC />

      <VariantHeader tag="VARIANT D" name="Live rotating headline ticker" note="6 facts cycle every 4.2s with fade" />
      <HighlightVariantD />

      <div className="px-6 py-10 font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
        end · /highlight-preview · 选 A / B / C / D 告诉我
      </div>
    </main>
  );
}
