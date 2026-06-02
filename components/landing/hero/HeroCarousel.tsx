"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { heroSlides } from "@/lib/site-data";

import { HeroGridGuides } from "./HeroGridGuides";
import { HeroImageTile } from "./HeroImageTile";
import { HeroPanel } from "./HeroPanels";
import { HeroProgressButton } from "./HeroProgressButton";

const SLIDE_DURATION_MS = 3000;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPlaying]);

  return (
    <section
      className="tt-hero-shell"
      data-slide={activeSlide.id}
      style={
        {
          "--tt-hero-base": activeSlide.palette.base,
          "--tt-hero-glow": activeSlide.palette.glow,
        } as CSSProperties
      }
    >
      <div className="tt-hero-control tt-hero-control-top">
        <HeroProgressButton
          isPlaying={isPlaying}
          activeIndex={activeIndex}
          durationMs={SLIDE_DURATION_MS}
          onToggle={() => setIsPlaying((value) => !value)}
        />
      </div>

      <div className="tt-hero-grid-structured">
        <div className="tt-hero-blockchain-row">
          <span className="tt-hero-heading-word">Agentic</span>
          <HeroImageTile src={activeSlide.images.strip} className="tt-hero-strip-top" />
        </div>

        <div className="tt-hero-data-row">
          <span className="tt-hero-heading-word">data</span>
          <HeroImageTile src={activeSlide.images.secondary} className="tt-hero-small-square" />
        </div>

        <HeroImageTile src={activeSlide.images.secondary} className="tt-hero-large-left" />
        <HeroImageTile src={activeSlide.images.primary} className="tt-hero-large-right" />

        <div className="tt-hero-panel-wrap">
          <HeroPanel slide={activeSlide} />
        </div>

        <div className="tt-hero-you-can">
          <HeroImageTile src={activeSlide.images.strip} className="tt-hero-you-can-strip" />
          <span className="tt-hero-heading-word">made to</span>
        </div>

        <div className="tt-hero-change-row">
          <HeroImageTile src={activeSlide.images.strip} className="tt-hero-strip-bottom" />
          <div
            className="tt-hero-change-mask"
            style={
              {
                "--tt-hero-change-offset": `${15 - activeIndex * 160}px`,
              } as CSSProperties
            }
          >
            <span className="tt-hero-heading-word tt-hero-change-word tt-hero-change-sizer" aria-hidden="true">
              {activeSlide.word}
            </span>
            <div className="tt-hero-change-stack">
              {heroSlides.map((slide) => (
                <span key={slide.id} className="tt-hero-heading-word tt-hero-change-word">
                  {slide.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HeroGridGuides />
      </div>

      <div className="tt-hero-copy-row">
        <p>
          agent economy is the data authority for on-chain agentic payments. We cover 5 protocols, 11+ chains, and
          173M+ events tracked daily — every number traces back to a public smart contract.
        </p>
        <Link href={activeSlide.href} className="tt-hero-cta">
          {activeSlide.cta}
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="tt-hero-action-row">
        <div className="tt-hero-bottom-control">
          <HeroProgressButton
            isPlaying={isPlaying}
            activeIndex={activeIndex}
            durationMs={SLIDE_DURATION_MS}
            onToggle={() => setIsPlaying((value) => !value)}
          />
        </div>
        <Link href={activeSlide.href} className="tt-hero-cta tt-hero-mobile-cta">
          {activeSlide.cta}
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
