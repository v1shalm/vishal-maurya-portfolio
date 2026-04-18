import Link from "next/link";
import { Container } from "@/components/Container";
import { LiveTime } from "@/components/LiveTime";

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
            <span className="hidden text-muted md:inline"> · </span>
            <span className="hidden text-[12.5px] text-muted md:inline">
              <LiveTime />
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="-my-2 flex items-baseline gap-4 text-[13.5px] text-muted md:gap-6"
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
                  className="py-2 transition-colors hover:text-ink"
                >
                  Pixels
                </Link>
                <Link
                  href="/about"
                  className="py-2 transition-colors hover:text-ink"
                >
                  About
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
