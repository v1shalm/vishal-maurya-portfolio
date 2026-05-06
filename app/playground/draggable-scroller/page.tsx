import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { Wheel } from "@/components/draggable-scroller/Wheel";

export const metadata: Metadata = {
  title: "Draggable scroller · Playground",
  description:
    "A jog wheel that scrolls 3D shapes on an arc. Inertia, snap, compass needle, and clicks that track scroll speed.",
  robots: { index: false, follow: false },
};

export default function DraggableScrollerPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight">
                <span className="hero-block hero-block--yellow">
                  Draggable scroller
                </span>
              </h1>

              <p className="mt-8 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-ink-soft md:mt-10 md:text-[19px]">
                Drag to spin. Flick and it carries, then springs back to
                center. The knob tilts like a compass needle between rows.
                Click sounds track how fast you scroll.
              </p>
            </div>
          </Container>
        </section>

        <section className="mt-16 md:mt-24">
          <Container>
            <div className="flex justify-center">
              <Wheel />
            </div>
          </Container>
        </section>

        <div className="h-40 md:h-56" />
      </main>
    </>
  );
}
