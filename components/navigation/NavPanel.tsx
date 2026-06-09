import Link from "next/link";

import type { NavPanel as NavPanelData } from "@/lib/site-data";

type NavPanelProps = {
  panel: NavPanelData;
  onNavigate?: () => void;
};

export function NavPanel({ panel, onNavigate }: NavPanelProps) {
  return (
    <div className="ae-nav-panel">
      <div className="ae-nav-panel-grid">
        {panel.items.map((item) => (
          <Link key={item.href} href={item.href} className="ae-nav-panel-card group" onClick={onNavigate}>
            <span className="ae-nav-panel-card-mark">
              {item.logo ? (
                <img src={item.logo} alt="" />
              ) : (
                <span className="ae-nav-panel-card-monogram">{item.mark ?? item.title.charAt(0)}</span>
              )}
            </span>
            <span className="ae-nav-panel-card-body">
              <span className="ae-nav-panel-card-title">{item.title}</span>
              <span className="ae-nav-panel-card-copy">{item.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
