import type { CSSProperties } from "react";

type HeroImageTileProps = {
  src: string;
  className?: string;
  position?: string;
};

export function HeroImageTile({ src, className = "", position }: HeroImageTileProps) {
  const style = {
    backgroundImage: `url(${src})`,
    ...(position ? { backgroundPosition: position } : {}),
  } as CSSProperties;

  return (
    <div className={`tt-hero-image-tile ${className}`}>
      <div className="tt-hero-image" style={style} />
    </div>
  );
}
