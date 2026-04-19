import Link from "next/link";
import { Container } from "@/components/Container";
import { Signature } from "@/components/Signature";
import { EmailLink } from "@/components/EmailLink";
import { links } from "@/lib/links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto pb-14 pt-40 md:pb-20 md:pt-56">
      <Container>
        <div className="flex flex-col gap-8 border-t border-line pt-12 md:flex-row md:items-baseline md:justify-between md:gap-10 md:pt-14">
          <div className="flex flex-col gap-2 text-[13.5px]">
            <EmailLink
              email={links.emailDisplay}
              className="link-accent"
            />
            <span className="text-muted">Mumbai</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[13.5px] text-muted">
            <a
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              data-cursor-label="Resume"
              className="transition-colors hover:text-ink"
            >
              Resume
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              data-cursor-label="LinkedIn"
              className="transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
            <a
              href={links.dribbble}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              data-cursor-label="Dribbble"
              className="transition-colors hover:text-ink"
            >
              Dribbble
            </a>
            <Link href="/about" className="transition-colors hover:text-ink">
              About
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-8">
          <span className="text-[12px] text-muted">© {year}</span>
          <Signature className="h-16 w-auto text-ink-soft md:h-24" />
        </div>
      </Container>
    </footer>
  );
}
