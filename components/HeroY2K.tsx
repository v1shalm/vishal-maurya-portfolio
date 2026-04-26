import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { PhoneMockup } from "@/components/PhoneMockup";

export function HeroY2K() {
  return (
    <section className="hero-y2k bg-bg">
      <Nav />
      <Container>
        {/* Body — two columns from md+. On mobile we render text only, no
            phone mockup or stickers, so the page stays light and fast.
            Top spacing comes from the global Nav `pb` rule, so this
            block sits flush against the gap. */}
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-start md:gap-12 lg:gap-16">
          {/* === Left: headline + subtitle === */}
          <div>
            <h1 className="y-display text-[clamp(2.25rem,7.5vw,6.5rem)]">
              <span className="y-line">
                <span className="y-hl y-hl--yellow" data-text="I design">
                  I design
                </span>
              </span>
              <span className="y-line">
                <span className="y-hl y-hl--yellow" data-text="products">
                  products
                </span>
              </span>
              <span className="y-line">
                <span className="y-hl y-hl--magenta" data-text="that feel">
                  that feel
                </span>
              </span>
              <span className="y-line">
                <span className="y-hl y-hl--magenta" data-text="alive.">
                  alive.
                </span>
              </span>
            </h1>

            <p className="mt-10 max-w-[460px] text-[16px] font-bold leading-[1.5] text-[color:var(--color-y-ink)] md:mt-16 md:text-[20px] md:leading-[1.45]">
              Product designer crafting quick-commerce, healthtech, and playful
              interfaces that create{" "}
              <span className="y-underline y-underline--yellow">impact</span>{" "}
              and{" "}
              <span className="y-underline y-underline--magenta">delight</span>.
            </p>
          </div>

          {/* === Right: Nexus phone + floating 3D stickers ===
              Hidden on mobile (text-only hero); md+ only.
              Swap each data-stk placeholder for a real 3D PNG when assets land. */}
          <div
            aria-hidden
            className="relative hidden md:flex md:min-h-[700px] md:items-center md:justify-end"
          >
            <PhoneMockup
              src="/works/nexus-247/homepage_light_tall.png"
              alt="Nexus 247 home screen, a quick-commerce app designed by Vishal Maurya"
              tilt={4}
              width={300}
              priority
              className="relative z-10"
            />

            {/* Decorations only render at md+ to keep mobile clean. */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {/* Chrome asterisk — top-left of phone */}
              <span
                data-stk="chrome-asterisk"
                className="absolute left-[6%] top-[14%] text-[68px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
              >
                ✳️
              </span>

              {/* "1x" blue app icon — top-right */}
              <div
                data-stk="oneX-icon"
                className="absolute right-[8%] top-[6%] flex h-[58px] w-[58px] items-center justify-center rounded-[14px] bg-gradient-to-br from-sky-100 to-sky-300 text-[20px] font-bold tracking-tight text-sky-700 shadow-[0_10px_24px_-8px_rgba(2,132,199,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]"
              >
                1x
              </div>

              {/* Peace sign — mid-right */}
              <span
                data-stk="peace"
                className="absolute right-[2%] top-[34%] text-[68px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
              >
                ☮️
              </span>

              {/* Clover — far-right upper */}
              <span
                data-stk="clover"
                className="absolute right-[8%] top-[48%] text-[60px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
              >
                🍀
              </span>

              {/* Clock / sky widget — right side */}
              <div
                data-stk="clock-widget"
                className="absolute right-[6%] top-[60%] flex h-[88px] w-[110px] flex-col items-center justify-center rounded-[18px] bg-gradient-to-br from-sky-200 via-sky-100 to-white text-[22px] font-bold tracking-tight text-sky-900 shadow-[0_14px_30px_-10px_rgba(2,132,199,0.5),inset_0_1px_0_rgba(255,255,255,0.7)]"
              >
                23:58:12
              </div>

              {/* Orange swirl — bottom-right */}
              <span
                data-stk="swirl"
                className="absolute right-[2%] bottom-[2%] text-[88px] drop-shadow-[0_10px_22px_rgba(255,74,5,0.35)]"
              >
                🌀
              </span>

              {/* App-icon collage — left of phone, bottom */}
              <div
                data-stk="app-collage"
                className="absolute left-[2%] bottom-[18%] h-[120px] w-[110px] -rotate-[8deg] overflow-hidden rounded-[18px] bg-gradient-to-br from-emerald-300 via-pink-300 to-amber-200 shadow-[0_18px_36px_-10px_rgba(0,0,0,0.25)]"
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[56px] font-bold text-pink-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                  +
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
