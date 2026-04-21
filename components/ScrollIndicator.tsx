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
          className="absolute inset-x-0 top-0 rounded-full"
          style={{
            height: `${clamped * 100}%`,
            backgroundColor: color,
            transition: "height 80ms linear",
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
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${clamped * 100}%`,
          backgroundColor: color,
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}
