"use client";

export type Client = {
  name: string;
  /** Path under /public, e.g. "/logos/outcomes-ai.png". If missing, name renders as text. */
  logo?: string;
  /** Optional Tailwind height classes to override the default "h-10 md:h-14". Used to visually match logos of different optical weights. */
  heightClass?: string;
};

type Props = { clients: Client[] };

/**
 * Infinite horizontal marquee of client logos/names.
 * Logos render grayscale + muted by default, return to full color on hover.
 * Pauses on hover. Left/right edges fade via a CSS mask.
 * Respects prefers-reduced-motion (animation paused via CSS).
 */
export function ClientMarquee({ clients }: Props) {
  // Duplicate once so the -50% translate loops seamlessly.
  const doubled = [...clients, ...clients];

  return (
    <div className="marquee-mask overflow-hidden">
      <ul
        className="marquee-track flex items-center"
        aria-label="Selected clients"
      >
        {doubled.map((client, i) => (
          <li
            key={i}
            aria-hidden={i >= clients.length}
            className="flex shrink-0 items-center pr-8 md:pr-10"
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                decoding="async"
                className={`${
                  client.heightClass ?? "h-10 md:h-14"
                } w-auto select-none opacity-60 grayscale transition-[filter,opacity] duration-300 ease-out hover:opacity-100 hover:grayscale-0`}
              />
            ) : (
              <span className="whitespace-nowrap text-[15px] text-muted transition-colors duration-200 hover:text-ink md:text-[16px]">
                {client.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
