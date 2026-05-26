import type { Metadata } from "next";

import { TrustSection } from "@/components/landing/TrustSection";

export const metadata: Metadata = {
  title: "TrustSection preview | Agent Economy v4",
};

export default function PreviewPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-stone-900 text-stone-400 font-mono text-[11px] uppercase tracking-[0.2em] px-6 py-3 border-b border-stone-700">
        preview · TrustSection · /preview
      </div>
      <TrustSection />
      <div className="bg-stone-900 text-stone-500 font-mono text-[11px] uppercase tracking-[0.2em] px-6 py-3 border-t border-stone-700">
        end preview · 等你 feedback
      </div>
    </main>
  );
}
