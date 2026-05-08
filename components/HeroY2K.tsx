import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { AliveBlock } from "@/components/AliveBlock";

export function HeroY2K() {
  return (
    <section className="bg-bg">
      <Nav />
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="hero-blocks">
            <span className="hero-blocks__row">
              <span className="hero-block hero-block--purple">I design</span>
              <span className="hero-block hero-block--orange">products</span>
            </span>
            <span className="hero-blocks__row">
              <span className="hero-block hero-block--yellow">that feel</span>
              <AliveBlock>alive.</AliveBlock>
            </span>
          </h1>

          <p className="hero-blocks__sub mx-auto mt-10 max-w-[560px] text-balance text-[17px] font-medium leading-[1.5] text-[color:var(--color-y-ink)] md:mt-14 md:text-[20px]">
            I&rsquo;m Vishal. Product designer in Mumbai. 2+ years
            across quick-commerce, healthtech, fintech.
            <br />
            Looking for full-time roles.
          </p>
        </div>
      </Container>
    </section>
  );
}
