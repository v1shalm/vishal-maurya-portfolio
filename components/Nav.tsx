import Link from "next/link";
import { Container } from "@/components/Container";
import { BouncyText } from "@/components/BouncyText";

export function Nav({ variant = "default" }: { variant?: "default" | "minimal" }) {
  return (
    <header className="pt-8 md:pt-14">
      <Container>
        <div className="flex items-baseline justify-between gap-4">
          <Link
            href="/"
            className="group flex items-baseline gap-2 text-[14px] text-ink transition-colors hover:text-ink-soft"
          >
            <span>Vishal Maurya</span>
            <span
              aria-hidden
              className="status-dot translate-y-[-1px]"
              title="Open to product roles"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="-my-2 flex items-baseline gap-3.5 text-[13px] text-muted sm:gap-4 md:gap-6 md:text-[13.5px]"
          >
            {variant === "default" && (
              <>
                <Link
                  href="/#work"
                  className="py-2 transition-colors hover:text-ink"
                >
                  Work
                </Link>
                <Link
                  href="/pixels"
                  className="hidden py-2 transition-colors hover:text-ink md:inline"
                >
                  Pixels
                </Link>
                <Link
                  href="/about"
                  className="py-2 transition-colors hover:text-ink"
                >
                  About
                </Link>
                <Link
                  href="/playground"
                  className="group hidden py-2 transition-colors hover:text-ink md:inline"
                >
                  <BouncyText text="Playground" />
                </Link>
                <a
                  href="mailto:vishalm.designs@gmail.com"
                  data-cursor="email"
                  className="py-2 transition-colors hover:text-ink"
                >
                  Email
                </a>
              </>
            )}
            {variant === "minimal" && (
              <Link
                href="/"
                className="py-2 transition-colors hover:text-ink"
              >
                ← Index
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
