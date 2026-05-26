type TokenLogoMarkProps = {
  className?: string;
};

const SIGNAL_GREEN = "#00FF88";

export function TokenLogoMark({ className }: TokenLogoMarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: 0,
        whiteSpace: "nowrap",
        display: "inline-block",
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      [agenteconomy<span style={{ color: SIGNAL_GREEN }}>.to</span>]
    </span>
  );
}
