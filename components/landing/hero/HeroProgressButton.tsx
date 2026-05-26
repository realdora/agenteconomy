"use client";

import type { CSSProperties } from "react";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";

type HeroProgressButtonProps = {
  isPlaying: boolean;
  activeIndex: number;
  durationMs: number;
  onToggle: () => void;
};

export function HeroProgressButton({ isPlaying, activeIndex, durationMs, onToggle }: HeroProgressButtonProps) {
  return (
    <button
      type="button"
      className="tt-hero-progress"
      aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
      aria-pressed={!isPlaying}
      onClick={onToggle}
      style={{ "--tt-hero-duration": `${durationMs}ms` } as CSSProperties}
    >
      <span className="tt-hero-progress-icon">{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
      <svg className="tt-hero-progress-ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="tt-hero-progress-track" cx="22" cy="22" r="20" />
        <circle key={activeIndex} className="tt-hero-progress-value" data-playing={isPlaying} cx="22" cy="22" r="20" />
      </svg>
    </button>
  );
}
