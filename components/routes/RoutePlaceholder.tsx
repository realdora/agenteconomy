import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

type RoutePlaceholderProps = {
  title: string;
  description: string;
  path: string;
};

// On-brand placeholder for nav destinations whose full content isn't built yet.
// Real per-page content replaces this page by page.
export function RoutePlaceholder({ title, description, path }: RoutePlaceholderProps) {
  return (
    <main className="tt-route-page">
      <section className="tt-route-hero">
        <div>
          <div className="tt-route-kicker">{path}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Link href="/" className="tt-route-home-link">
          Back to home
          <ArrowRightIcon />
        </Link>
      </section>

      <div className="mt-16 flex flex-col items-start gap-5 border-t border-white/10 pt-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">Coming soon</span>
        <p className="font-display italic text-white/85 text-2xl leading-snug max-w-2xl">
          This page is on the way. Every number is already live — explore the full dataset now.
        </p>
        <a href="https://agenteconomy.to" className="tt-hero-cta">
          Open agenteconomy.to
          <ArrowRightIcon />
        </a>
      </div>
    </main>
  );
}
