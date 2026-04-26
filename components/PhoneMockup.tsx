import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Optional rotation, in degrees. Positive tilts clockwise. */
  tilt?: number;
  /** Width of the device, in px. Phone scales proportionally. */
  width?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Static iPhone-style mockup. Outer rounded rect frame in black, with a
 * dynamic-island notch and a screen image sized to fill via next/image.
 *
 * Frame proportions are tuned to read as iPhone 15 Pro: 9/19.5 aspect,
 * 44px outer radius, 34px inner radius (outer - 10px padding).
 */
export function PhoneMockup({
  src,
  alt,
  tilt = 0,
  width = 280,
  className = "",
  priority = false,
}: Props) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width,
        aspectRatio: "9 / 19.5",
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        filter:
          "drop-shadow(0 30px 50px rgba(12,12,16,0.18)) drop-shadow(0 8px 16px rgba(12,12,16,0.10))",
      }}
    >
      <div className="relative h-full w-full rounded-[44px] bg-black p-[10px]">
        {/* Dynamic island */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[14px] z-20 h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black"
        />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-white">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`${width}px`}
            className="object-cover object-top"
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
}
