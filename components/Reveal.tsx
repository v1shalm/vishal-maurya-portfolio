"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay in ms before starting (stacked siblings can offset). */
  delay?: number;
  /** Distance in pixels the element slides up from. */
  offset?: number;
  /** Viewport fraction to trigger. 0 = any entry, 0.25 = 25% in view. */
  threshold?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
};

/**
 * Reveals content on scroll: fade + slight y-translate.
 * IntersectionObserver-based; reveals once and disconnects.
 * Respects prefers-reduced-motion (content just appears).
 */
export function Reveal({
  children,
  delay = 0,
  offset = 16,
  threshold = 0.1,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const el = ref.current;
    if (!el) return;

    // If reduced motion, show immediately: no observer needed.
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: React.CSSProperties = reducedMotion
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${offset}px, 0)`,
        transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
