import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — pink Y2K square with "VM" wordmark in brand yellow.
 * Mirrors the colors used on .y-hl yellow halos and primary CTAs.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f91ca9",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: "-0.05em",
          color: "#fdf004",
        }}
      >
        VM
      </div>
    ),
    { ...size },
  );
}
