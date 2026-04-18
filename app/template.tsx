/**
 * Next.js template — re-renders on every route change.
 * Used here to apply a subtle fade-in transition between pages.
 * The CSS animation is defined in globals.css (.page-enter) and is disabled under
 * prefers-reduced-motion.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
