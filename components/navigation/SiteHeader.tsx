"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MenuIcon } from "@/components/icons/MenuIcon";
import { TokenLogoMark } from "@/components/icons/TokenLogoMark";
import { navMenus } from "@/lib/site-data";

import { MobileMenu } from "./MobileMenu";
import { NavPanel } from "./NavPanel";

export function SiteHeader() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const currentMenu = navMenus.find((menu) => menu.label === activePanel && menu.panel);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActivePanel(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePanel(null);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-[100] w-full border-b border-transparent bg-bg-default/85 backdrop-blur-xl">
      <div className="mx-auto w-[1240px] max-w-full px-5">
        <div className="hidden items-center justify-between gap-2 py-4 lg:flex">
          <div className="flex flex-1 justify-start">
            <Link href="/" className="rounded-md text-fg-default outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
              <span className="sr-only">agent economy home</span>
              <TokenLogoMark />
            </Link>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-8 p-2">
            {navMenus.map((menu) => {
              if (menu.href) {
                return (
                  <Link key={menu.label} href={menu.href} className="tt-nav-link" onMouseEnter={() => setActivePanel(null)}>
                    {menu.label}
                  </Link>
                );
              }

              const isOpen = activePanel === menu.label;
              return (
                <button
                  key={menu.label}
                  type="button"
                  className="tt-nav-link"
                  data-is-open={isOpen}
                  aria-expanded={isOpen}
                  onClick={() => setActivePanel(isOpen ? null : menu.label)}
                  onMouseEnter={() => setActivePanel(menu.label)}
                >
                  {menu.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end">
            <a href="https://agenteconomy.to" className="tt-explorer-button">
              Go to Explorer
            </a>
          </div>
        </div>

        <div className="mx-[-20px] flex px-5 py-3 lg:hidden">
          <div className="flex flex-1 items-center">
            <Link href="/" className="text-fg-default">
              <span className="sr-only">agent economy home</span>
              <TokenLogoMark />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              type="button"
              className="tt-icon-control"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              onClick={() => setIsMobileOpen((value) => !value)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {currentMenu?.panel ? <NavPanel panel={currentMenu.panel} onNavigate={() => setActivePanel(null)} /> : null}
      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </header>
  );
}
