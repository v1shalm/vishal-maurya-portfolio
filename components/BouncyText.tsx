/**
 * Per-letter bouncy hover text. Each character springs up on hover, staggered
 * left-to-right like a wave. Requires a `group` ancestor on the link/button.
 */
export function BouncyText({
  text,
  staggerMs = 22,
}: {
  text: string;
  staggerMs?: number;
}) {
  return (
    <span aria-label={text} className="inline-flex">
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-transform duration-[260ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-[5px] group-focus-visible:-translate-y-[5px]"
          style={{ transitionDelay: `${i * staggerMs}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
