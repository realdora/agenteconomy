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
      className="ae-hero-progress"
      aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
      aria-pressed={!isPlaying}
      onClick={onToggle}
      style={{ "--ae-hero-duration": `${durationMs}ms` } as CSSProperties}
    >
      <span className="ae-hero-progress-icon">{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
      <svg className="ae-hero-progress-ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="ae-hero-progress-track" cx="22" cy="22" r="20" />
        <circle key={activeIndex} className="ae-hero-progress-value" data-playing={isPlaying} cx="22" cy="22" r="20" />
      </svg>
    </button>
  );
}
