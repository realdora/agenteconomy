import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

type MockRoutePageProps = {
  title: string;
  description: string;
  metrics: string[];
  path: string;
};

export function MockRoutePage({ title, description, metrics, path }: MockRoutePageProps) {
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

      <section className="tt-route-grid" aria-label={`${title} mocked capabilities`}>
        {metrics.map((metric) => (
          <article key={metric} className="tt-route-card">
            <span>{metric}</span>
            <p>Mocked content placeholder for the structured route architecture.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
