import { ImageResponse } from "next/og";
import { getWork, works } from "@/lib/works";

export const alt = "Case study by Vishal Maurya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);

  // If the slug is unknown, fall back to a simple branded card instead of
  // throwing. This route still gets hit by crawlers for stale URLs.
  const title = work?.title ?? "Vishal Maurya";
  const tagline =
    work?.tagline ??
    "I design consumer products. Lately: quick-commerce, healthtech, and interfaces that feel alive.";
  const kind = work?.kind ?? "Case study";
  const status = work?.status ?? "";
  const year = work?.year ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "96px",
          background: "#f91ca9",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top: byline + small yellow dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: 24, letterSpacing: "-0.005em" }}>
            Vishal Maurya
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#fdf004",
              marginTop: 4,
            }}
          />
          <span
            style={{
              marginLeft: 14,
              fontSize: 18,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Case study
          </span>
        </div>

        {/* Middle: title + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.28,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.92)",
              maxWidth: 920,
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom: meta — dot separators only, no hairlines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 22,
            color: "rgba(255, 255, 255, 0.88)",
          }}
        >
          <span>{kind}</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>{status}</span>
          {year && (
            <>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>{year}</span>
            </>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
