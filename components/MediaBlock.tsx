import type { Media, MediaItem } from "@/lib/works";

export function MediaBlock({ media }: { media: Media }) {
  if (media.kind === "single") {
    // `fullBleed` is intentionally a no-op now — everything stays within the
    // global container margins. Kept in the type so existing data still works.
    return (
      <figure>
        <MediaFrame item={media.item} defaultAspect="16/10" />
        {media.caption && <Caption>{media.caption}</Caption>}
      </figure>
    );
  }

  if (media.kind === "pair") {
    return (
      <figure>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {media.items.map((item, i) => (
            <MediaFrame key={i} item={item} defaultAspect="4/3" />
          ))}
        </div>
        {media.caption && <Caption>{media.caption}</Caption>}
      </figure>
    );
  }

  // triptych + row — vertical stack, each image full column width.
  return (
    <figure>
      <div className="flex flex-col gap-5 md:gap-6">
        {media.items.map((item, i) => (
          <MediaFrame key={i} item={item} defaultAspect="16/10" />
        ))}
      </div>
      {media.caption && <Caption>{media.caption}</Caption>}
    </figure>
  );
}

function MediaFrame({
  item,
  defaultAspect,
}: {
  item: MediaItem;
  defaultAspect: string;
}) {
  // Real image: render at natural dimensions — no cropping, no zoom.
  if (item.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    );
  }

  // Placeholder: use the specified aspect so the section still has visual weight.
  const aspect = item.aspect ?? defaultAspect;
  return (
    <div
      className="relative overflow-hidden bg-bg-elevated"
      style={{ aspectRatio: aspect }}
    >
      <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
          Placeholder
        </span>
        {item.alt && (
          <span className="mt-1 max-w-[32ch] text-[12.5px] leading-[1.4] text-ink-soft">
            {item.alt}
          </span>
        )}
      </div>
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">
      {children}
    </figcaption>
  );
}
