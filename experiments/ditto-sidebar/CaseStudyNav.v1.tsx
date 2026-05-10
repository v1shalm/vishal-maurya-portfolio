"use client";

import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/works";

/**
 * Replica of dittowords.com's homepage sticky scroll process sidebar.
 *
 * Mental model (matching Ditto's actual Webflow markup):
 * - The column is a sticky vertical strip with a cream gradient bg.
 *   Rows distribute themselves with `justify-content: space-between`,
 *   so the row count determines the spacing — no manual gap math.
 * - Every row has FOUR pieces, in order:
 *     1. top branch wrap   (height: 0; height: 13vh on active)
 *     2. link / dot body   (40×17 inactive; 80×auto active)
 *     3. bottom branch wrap (mirror of #1)
 *     4. label              (absolutely positioned to the right)
 * - Branch wraps stay collapsed except on the active row, where they
 *   grow into the cream hourglass-half tiles that make the spine bulge
 *   around the active dot.
 * - The two branch SVGs are taken verbatim from Ditto's site
 *   (branch-top.svg + sticky-branch.svg, fill #ECE9E5).
 * - Active link bg switches to the step's color and the row body grows.
 *   Width/height transitions are .6s cubic-bezier(.23, 1, .32, 1)
 *   (EaseOutQuint); branch wrap height transitions .4s
 *   cubic-bezier(.165, .84, .44, 1) — exact values from Ditto's CSS.
 */

const STEP_COLORS = [
  "#aa7e2e", // brown
  "#b26dc2", // purple
  "#3e6b15", // green
  "#0097e6", // blue
  "#ff6137", // red
  "#bbb809", // olive
  "#f5c4cc", // pink
];

const SPINE_FILL = "#ECE9E5";
const PAGE_BG = "#f7f5f3"; // warm-white from Ditto
const BEIGE = "#dcd8cf"; // dimmed label color

// Easings copied from Ditto's CSS.
const EASE_LINK = "cubic-bezier(.23, 1, .32, 1)"; // EaseOutQuint
const EASE_BRANCH = "cubic-bezier(.165, .84, .44, 1)";

// Branch wrap target heights (from Ditto: clamp(30px, 13vh, 116px)).
const BRANCH_HEIGHT_ACTIVE = "clamp(30px, 13vh, 116px)";

// branch-top.svg: narrow at top (x=22.88..58.32), wide at bottom (x=0.6..80.6).
// Used ABOVE the active row so the spine widens INTO the active row.
const BRANCH_TOP_PATH =
  "M58.317 0.98819C58.317 91.8255 80.5983 99.6376 80.5983 132.244L0.598267 132.244C0.598267 99.6376 22.8795 91.8255 22.8795 0.98819L58.317 0.98819Z";

// sticky-branch.svg: wide at top (x=0.6..80.6), narrow at bottom (x=22.88..58.32).
// Used BELOW the active row so the spine narrows AWAY from the active row.
const BRANCH_BOTTOM_PATH =
  "M22.8795 132C22.8795 41.1626 0.59828 33.3506 0.598282 0.743893L80.5983 0.743896C80.5983 33.3506 58.3171 41.1627 58.3171 132L22.8795 132Z";

export function CaseStudyNav({ sections }: { sections: CaseSection[] }) {
  const items = sections.map((s, i) => ({
    id: `section-${i}`,
    label: s.label,
    color: STEP_COLORS[i % STEP_COLORS.length],
  }));

  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Case study contents"
      style={{
        // Ditto: width 40px, height 85vh, sticky, cream gradient bg.
        width: 40,
        height: "85vh",
        paddingTop: "6vh",
        paddingBottom: "6vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundImage: `linear-gradient(180deg, ${PAGE_BG}, ${SPINE_FILL} 5%, ${SPINE_FILL} 90%, ${PAGE_BG})`,
      }}
    >
      <style>{`
        /* Tappable link gets a 40×40 minimum hit area via ::before, so
           the inactive 40×17 dot is still easy to tap without changing
           the visual footprint. */
        .ditto-sticky-link::before {
          content: "";
          position: absolute;
          inset: -12px -4px;
          min-width: 40px;
          min-height: 40px;
        }
        /* Tactile feedback on press. 0.96 is the lower bound below
           which the press starts to feel exaggerated. */
        .ditto-sticky-link:active {
          transform: scale(0.96);
        }
        /* Label sits at translateY(-50%) so we compose with that. */
        .ditto-sticky-text:active {
          transform: translateY(-50%) scale(0.96);
        }
      `}</style>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <StickyItem
            key={item.id}
            id={item.id}
            label={item.label}
            color={item.color}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
}

function StickyItem({
  id,
  label,
  color,
  isActive,
}: {
  id: string;
  label: string;
  color: string;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        paddingTop: "1vh",
        paddingBottom: "1vh",
        // The item itself doesn't shrink — it lets its children expand
        // and the parent's space-between redistributes the rest.
      }}
    >
      {/* Top branch — narrow→wide hourglass-half. Collapsed unless active. */}
      <BranchWrap shape="top" expanded={isActive} />

      {/* Link / dot body. The visible area is 40×17 inactive / 80×80
         active, but a transparent ::before extends the hit area to at
         least 40×40 so taps on the dot are reliable. */}
      <a
        href={`#${id}`}
        className="ditto-sticky-link"
        style={{
          display: "block",
          position: "relative",
          width: isActive ? 80 : 40,
          height: isActive ? 80 : 17,
          padding: isActive ? 12 : 0,
          background: isActive ? color : SPINE_FILL,
          color: isActive ? "#000" : color,
          transitionProperty: "width, height, background-color, padding, transform",
          transitionDuration: ".6s",
          transitionTimingFunction: EASE_LINK,
          boxSizing: "border-box",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 17 17"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={{ display: "block" }}
        >
          <circle cx="8.5" cy="8.5" r="8.5" fill="currentColor" />
        </svg>
      </a>

      {/* Bottom branch — wide→narrow hourglass-half. Collapsed unless active. */}
      <BranchWrap shape="bottom" expanded={isActive} />

      {/* Label, positioned to the right of the column */}
      <a
        href={`#${id}`}
        className="ditto-sticky-text"
        style={{
          position: "absolute",
          top: "50%",
          left: isActive ? 120 : 80,
          transform: "translateY(-50%)",
          color: isActive ? "#000" : BEIGE,
          fontWeight: isActive ? 700 : 400,
          fontSize: isActive ? "1.625rem" : "1rem",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textDecoration: "none",
          transitionProperty: "left, color, font-size, transform",
          transitionDuration: ".4s, .2s, .2s, .15s",
          transitionTimingFunction: `${EASE_BRANCH}, linear, linear, ${EASE_LINK}`,
          padding: "8px 12px",
          margin: "-8px -12px",
        }}
      >
        {label}
      </a>
    </div>
  );
}

function BranchWrap({
  shape,
  expanded,
}: {
  shape: "top" | "bottom";
  expanded: boolean;
}) {
  const d = shape === "top" ? BRANCH_TOP_PATH : BRANCH_BOTTOM_PATH;
  return (
    <div
      aria-hidden
      style={{
        display: "block",
        width: "100%",
        height: expanded ? BRANCH_HEIGHT_ACTIVE : 0,
        overflow: "hidden",
        transition: `height .4s ${EASE_BRANCH}`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={shape === "top" ? "0 0 81 133" : "0 0 81 132"}
        preserveAspectRatio="none"
        fill="none"
        style={{ display: "block" }}
      >
        <path d={d} fill={SPINE_FILL} />
      </svg>
    </div>
  );
}
