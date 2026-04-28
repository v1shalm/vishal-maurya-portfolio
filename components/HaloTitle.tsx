type Props = {
  /** The word(s) to render with the halo. */
  text: string;
  /** Halo color shade. Defaults to "yellow". */
  color?: "yellow" | "magenta";
  /** Entrance animation. Defaults to "drop". Pass "none" to render statically. */
  enter?: "drop" | "none";
  /**
   * Optional className passed to the inner halo span — useful if a page
   * wants to override sizing or font weight on this single word.
   */
  className?: string;
};

/**
 * Page-title halo word. Wraps the existing `.y-hl` text-shadow halo
 * treatment in a reusable shell, so any page can drop it into an
 * `.hero-y2k`-scoped heading without re-implementing markup.
 *
 * Must be rendered inside a parent that has the `hero-y2k` class — the
 * halo CSS lives under `.hero-y2k .y-hl` in `globals.css`. Sizing,
 * tracking, and weight come from the parent heading; this component
 * only controls the halo treatment + entrance animation.
 *
 * Animation runs on first paint via CSS keyframes (no JS), and is
 * skipped when `prefers-reduced-motion: reduce` is set.
 */
export function HaloTitle({
  text,
  color = "yellow",
  enter = "drop",
  className = "",
}: Props) {
  const enterClass = enter === "drop" ? "halo-title-enter" : "";
  return (
    <span
      className={`y-hl y-hl--${color} ${enterClass} ${className}`.trim()}
      data-text={text}
    >
      {text}
    </span>
  );
}
