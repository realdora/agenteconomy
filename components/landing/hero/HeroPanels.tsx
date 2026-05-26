import Image from "next/image";

import type { HeroSlide } from "@/lib/site-data";

type HeroPanelProps = {
  slide: HeroSlide;
};

export function HeroPanel({ slide }: HeroPanelProps) {
  if (slide.panel.kind === "asset") {
    return <AssetManagementPanel panel={slide.panel} />;
  }

  if (slide.panel.kind === "pipeline") {
    return <PipelinePanel panel={slide.panel} />;
  }

  return <FinancialPanel panel={slide.panel} />;
}

function FinancialPanel({ panel }: { panel: Extract<HeroSlide["panel"], { kind: "financial" }> }) {
  const months = ["Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024"];

  return (
    <div className="tt-hero-data-card tt-hero-financial-card">
      <div className="tt-hero-financial-surface">
        <div className="tt-hero-financial-heading">
          <Image src="/images/ethereum.png" alt="" width={32} height={32} className="rounded-full" />
          <div className="flex flex-col items-start gap-0">
            <div className="text-lg font-medium text-fg-default">{panel.title}</div>
            <div className="text-sm text-fg-secondary">{panel.subtitle}</div>
          </div>
        </div>
        <div className="tt-hero-financial-separator" />
        <table className="tt-hero-financial-table">
          <thead>
            <tr>
              <th>Income statement</th>
              {months.map((month) => (
                <th key={month}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {panel.rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.values.slice(0, months.length).map((value, index) => (
                  <td key={`${row.label}-${index}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetManagementPanel({ panel }: { panel: Extract<HeroSlide["panel"], { kind: "asset" }> }) {
  const bars = panel.series[0]?.values.map((_, index) => index) ?? [];

  return (
    <div className="tt-hero-data-card tt-hero-chart-card">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-lg font-medium text-fg-default md:text-xl">{panel.title}</div>
          <div className="text-sm text-fg-secondary md:text-base">{panel.subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-fg-default">
          {panel.series.slice(0, 2).map((series) => (
            <div key={series.name} className="flex items-center gap-2">
              <span className="size-3 rounded-sm" style={{ background: series.color }} />
              {series.name}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex h-[145px] items-end gap-3">
        {bars.map((barIndex) => (
          <div key={barIndex} className="flex flex-1 flex-col justify-end overflow-hidden rounded-t-sm">
            {panel.series.map((series) => (
              <div
                key={`${series.name}-${barIndex}`}
                style={{ height: `${series.values[barIndex]}%`, background: series.color }}
                className="min-h-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelinePanel({ panel }: { panel: Extract<HeroSlide["panel"], { kind: "pipeline" }> }) {
  return (
    <div className="tt-hero-pipeline-card">
      <div className="absolute left-8 top-8 max-w-[240px]">
        <div className="text-lg font-medium text-white">{panel.title}</div>
        <div className="text-sm text-white/55">{panel.subtitle}</div>
      </div>
      <div className="tt-hero-code-rain" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index}>0xdf1c26ee54465efdc29822e950118e212340</span>
        ))}
      </div>
      <div className="tt-hero-mini-card">
        <div className="grid grid-cols-3 gap-1">
          <span />
          <span />
          <span />
          <span />
          <span className="col-span-2" />
          <span />
          <span />
          <span />
        </div>
        <div className="mt-3 text-xs font-medium text-white/60">TT_</div>
      </div>
      <div className="tt-hero-chip-cloud">
        {panel.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  );
}
