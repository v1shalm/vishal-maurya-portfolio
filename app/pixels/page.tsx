import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Pixels — Vishal Maurya",
  description: "Personal UI screens, explorations, and side quests.",
};

type PlaygroundItem = {
  slug: string;
  title: string;
  tag: string;
  year: string;
  thumbnail?: string;
  /** Aspect ratio for the tile — varied aspects create the masonry rhythm. */
  aspect: string;
};

const items: PlaygroundItem[] = [
  { slug: "frozen-cosmos", title: "Frozen Cosmos", tag: "Concept UI", year: "2025", aspect: "4/5" },
  {
    slug: "providence",
    title: "Providence",
    tag: "Concept UI",
    year: "2025",
    thumbnail: "/works/providence.png",
    aspect: "3/2",
  },
  { slug: "eternal-dunes", title: "Eternal Dunes", tag: "Concept UI", year: "2025", aspect: "1/1" },
  { slug: "untitled-04", title: "Untitled 04", tag: "Sketch", year: "—", aspect: "4/5" },
  { slug: "untitled-05", title: "Untitled 05", tag: "Sketch", year: "—", aspect: "3/4" },
  { slug: "untitled-06", title: "Untitled 06", tag: "Sketch", year: "—", aspect: "16/10" },
  { slug: "untitled-07", title: "Untitled 07", tag: "Sketch", year: "—", aspect: "1/1" },
  { slug: "untitled-08", title: "Untitled 08", tag: "Sketch", year: "—", aspect: "4/5" },
];

export default function PixelsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="pt-16 md:pt-24">
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[11px] uppercase tracking-[0.18em] text-muted">
                Pixels
              </h1>

              <p className="mt-8 max-w-[54ch] text-[17px] leading-[1.7] text-ink md:text-[18px]">
                Interfaces without briefs. A sketchbook — some become
                products, most stay themselves.
              </p>
            </div>

            <section className="mt-20 md:mt-24">
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  All — {items.length}
                </span>
              </div>

              {/* Masonry via CSS columns */}
              <div className="mt-8 columns-1 gap-4 sm:columns-2 md:columns-3 md:gap-5">
                {items.map((item) => (
                  <figure
                    key={item.slug}
                    className="group mb-4 break-inside-avoid md:mb-5"
                  >
                    <div
                      className="relative w-full overflow-hidden bg-bg-elevated"
                      style={{ aspectRatio: item.aspect }}
                    >
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={`${item.title} — ${item.tag}`}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                    <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                      <span className="text-[14px] text-ink">
                        {item.title}
                      </span>
                      <span className="text-[10.5px] uppercase tracking-[0.14em] text-muted">
                        {item.tag} · {item.year}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
