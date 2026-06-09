"use client";

import Link from "next/link";

import { navMenus } from "@/lib/site-data";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <nav className="ae-mobile-menu lg:hidden" aria-label="Mobile navigation">
      <div className="ae-mobile-menu-content">
        {navMenus.map((menu) => {
          if (menu.href) {
            return (
              <Link key={menu.label} href={menu.href} className="ae-mobile-nav-link" onClick={onClose}>
                {menu.label}
              </Link>
            );
          }

          return (
            <div key={menu.label} className="py-2">
              <div className="px-2 pb-2 text-sm font-medium text-fg-default">{menu.label}</div>
              <div className="grid gap-2">
                {menu.panel?.items.map((item) => (
                  <Link key={item.href} href={item.href} className="ae-mobile-nav-card" onClick={onClose}>
                    <span className="font-medium text-fg-default">{item.title}</span>
                    <span className="text-sm text-fg-secondary">{item.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
