import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { MobileNav } from "@/components/MobileNav";

/**
 * Site-wide top bar: wordmark, primary nav (About / Pixels / Playground),
 * yellow Let's Connect CTA on desktop. On mobile the inline links + CTA
 * collapse into a single Menu pill (<MobileNav />) that opens an ink
 * dropdown with all destinations.
 */
export function Nav() {
  return (
    <header className="pt-6 pb-16 md:pt-8 md:pb-28">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-bold tracking-[-0.02em] text-[20px] text-ink md:text-[22px]"
          >
            Vishal Maurya
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-[14px] font-medium text-ink-soft md:flex"
          >
            <Link
              href="/#work"
              className="transition-colors hover:text-ink"
            >
              Work
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-ink"
            >
              About
            </Link>
            <Link
              href="/pixels"
              className="transition-colors hover:text-ink"
            >
              Pixels
            </Link>
            <Link
              href="/playground"
              className="transition-colors hover:text-ink"
            >
              Playground
            </Link>
          </nav>

          <div className="hidden md:inline-flex">
            <Button
              variant="yellow"
              href="mailto:vishalm.designs@gmail.com"
            >
              Let&rsquo;s Connect
            </Button>
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
