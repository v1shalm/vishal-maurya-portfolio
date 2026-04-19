import { ImageResponse } from "next/og";

export const alt = "Vishal Maurya · Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "#FF4A05",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top: name + small white dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: 26, letterSpacing: "-0.005em" }}>
            Vishal Maurya
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#ffffff",
              marginTop: 4,
            }}
          />
        </div>

        {/* Middle: tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.12,
            letterSpacing: "-0.018em",
            maxWidth: 960,
          }}
        >
          I design consumer products. Lately: quick-commerce, healthtech, and
          interfaces that feel alive.
        </div>

        {/* Bottom: meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 22,
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <span
            style={{
              width: 40,
              height: 1,
              background: "#ffffff",
              opacity: 0.6,
            }}
          />
          <span>Product Designer</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>Mumbai</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
