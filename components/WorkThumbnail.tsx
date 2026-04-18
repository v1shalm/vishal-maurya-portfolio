"use client";

import Image from "next/image";
import type { SyntheticEvent } from "react";

type Props = {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
};

/**
 * Autoplaying, muted, looped video thumbnail — or an optimised <Image /> for
 * non-video srcs. Fills its aspect-ratio parent with object-cover.
 * Muted+looped video is allowed by all major browsers; `onCanPlay` is a belt-
 * and-suspenders fallback that calls play() explicitly once the browser has
 * enough data (protects against HMR quirks and stale states).
 */
export function WorkThumbnail({ src, alt, poster, className = "" }: Props) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  if (!isVideo) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw"
        className={`object-cover ${className}`}
      />
    );
  }

  const handleCanPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.play().catch(() => {});
  };

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      controls={false}
      preload="metadata"
      aria-label={alt}
      onCanPlay={handleCanPlay}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
