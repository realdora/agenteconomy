type IconProps = {
  className?: string;
};

export function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M232.4 114.49 88.32 26.35A16 16 0 0 0 64 40v176a16 16 0 0 0 24.32 13.65l144.08-88.14a16 16 0 0 0 0-27.02Z" />
    </svg>
  );
}
