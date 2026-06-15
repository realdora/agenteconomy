"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { formatEvents, type AgentData } from "@/lib/agent-data";
import { heroSlides } from "@/lib/site-data";

import { HeroGridGuides } from "./HeroGridGuides";
import { HeroImageTile } from "./HeroImageTile";
import { HeroPanel } from "./HeroPanels";
import { HeroProgressButton } from "./HeroProgressButton";

const SLIDE_DURATION_MS = 3000;

export function HeroCarousel({ data }: { data: AgentData }) {
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
      className="ae-hero-shell"
      data-slide={activeSlide.id}
      style={
        {
          "--ae-hero-base": activeSlide.palette.base,
          "--ae-hero-glow": activeSlide.palette.glow,
        } as CSSProperties
      }
    >
      <div className="ae-hero-control ae-hero-control-top">
        <HeroProgressButton
          isPlaying={isPlaying}
          activeIndex={activeIndex}
          durationMs={SLIDE_DURATION_MS}
          onToggle={() => setIsPlaying((value) => !value)}
        />
      </div>

      <div className="ae-hero-grid-structured">
        <div className="ae-hero-blockchain-row">
          <span className="ae-hero-heading-word">Agentic</span>
          <HeroImageTile src={activeSlide.images.strip} className="ae-hero-strip-top" />
        </div>

        <div className="ae-hero-data-row">
          <span className="ae-hero-heading-word">data</span>
          <HeroImageTile src={activeSlide.images.secondary} className="ae-hero-small-square" />
        </div>

        <HeroImageTile src={activeSlide.images.secondary} className="ae-hero-large-left" />
        <HeroImageTile src={activeSlide.images.primary} className="ae-hero-large-right" />

        <div className="ae-hero-panel-wrap">
          <HeroPanel slide={activeSlide} data={data} />
        </div>

        <div className="ae-hero-you-can">
          <HeroImageTile src={activeSlide.images.strip} className="ae-hero-you-can-strip" />
          <span className="ae-hero-heading-word">made to</span>
        </div>

        <div className="ae-hero-change-row">
          <HeroImageTile src={activeSlide.images.strip} className="ae-hero-strip-bottom" />
          <div
            className="ae-hero-change-mask"
            style={
              {
                "--ae-hero-change-offset": `${15 - activeIndex * 160}px`,
              } as CSSProperties
            }
          >
            <span className="ae-hero-heading-word ae-hero-change-word ae-hero-change-sizer" aria-hidden="true">
              {activeSlide.word}
            </span>
            <div className="ae-hero-change-stack">
              {heroSlides.map((slide) => (
                <span key={slide.id} className="ae-hero-heading-word ae-hero-change-word">
                  {slide.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HeroGridGuides />
      </div>

      <div className="ae-hero-copy-row">
        <p>
          agent economy is the data authority for on-chain agentic payments. We cover 5 protocols, 11+ chains, and{" "}
          {formatEvents(data.totalEvents)}+ events tracked, every number built from public on-chain activity.
        </p>
        <Link href={activeSlide.href} className="ae-hero-cta">
          {activeSlide.cta}
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="ae-hero-action-row">
        <div className="ae-hero-bottom-control">
          <HeroProgressButton
            isPlaying={isPlaying}
            activeIndex={activeIndex}
            durationMs={SLIDE_DURATION_MS}
            onToggle={() => setIsPlaying((value) => !value)}
          />
        </div>
        <Link href={activeSlide.href} className="ae-hero-cta ae-hero-mobile-cta">
          {activeSlide.cta}
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
