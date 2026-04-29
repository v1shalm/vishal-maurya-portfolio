type Props = {
  /** 0 to 1. Values outside that range are clamped. */
  progress: number;
  orientation?: "vertical" | "horizontal";
  tone?: "ink" | "accent" | "muted";
};

/**
 * Slim, minimal scroll progress bar. Pair it with a relative-positioned parent
 * that constrains its bounds (e.g. an absolutely-positioned wrapper).
 */
export function ScrollIndicator({
  progress,
  orientation = "vertical",
  tone = "ink",
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const color =
    tone === "accent"
      ? "var(--color-accent)"
      : tone === "muted"
        ? "rgba(12, 12, 16, 0.28)"
        : "var(--color-ink)";
  const track =
    tone === "muted" ? "rgba(12, 12, 16, 0.06)" : "rgba(12, 12, 16, 0.08)";

  if (orientation === "vertical") {
    return (
      <div
        aria-hidden
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ backgroundColor: track }}
      >
        <div
          className="absolute inset-0 origin-top rounded-full will-change-transform"
          style={{
            backgroundColor: color,
            transform: `scaleY(${clamped})`,
            transition: "transform 80ms linear",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-full"
      style={{ backgroundColor: track }}
    >
      <div
        className="absolute inset-0 origin-left rounded-full will-change-transform"
        style={{
          backgroundColor: color,
          transform: `scaleX(${clamped})`,
          transition: "transform 80ms linear",
        }}
      />
    </div>
  );
}
