import Link from "next/link";

import type { NavPanel as NavPanelData } from "@/lib/site-data";

type NavPanelProps = {
  panel: NavPanelData;
  onNavigate?: () => void;
};

export function NavPanel({ panel, onNavigate }: NavPanelProps) {
  return (
    <div className="tt-nav-panel">
      <div className="tt-nav-panel-grid">
        {panel.items.map((item) => (
          <Link key={item.href} href={item.href} className="tt-nav-panel-card group" onClick={onNavigate}>
            <div className={`tt-nav-panel-card-art bg-gradient-to-t ${item.accent ?? "from-neutral-500/20"} to-transparent`}>
              <div className="tt-nav-panel-card-line" />
              <div className="tt-nav-panel-card-orbit" />
            </div>
            <div>
              <div className="tt-nav-panel-card-title">{item.title}</div>
              <div className="tt-nav-panel-card-copy">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
