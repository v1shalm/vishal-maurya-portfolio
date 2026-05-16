"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { SignatureLetters } from "@/components/SignatureLetters";
import { EmailLink } from "@/components/EmailLink";
import { Confetti } from "@/components/Confetti";
import { play } from "@/lib/sounds";
import { links } from "@/lib/links";

/**
 * Footer is the contact page. Every page on the site reveals it as
 * the user scrolls past their last section, and it carries the only
 * email + socials in the product. No other surface should repeat
 * what lives here.
 *
 * Layout:
 *   - mobile: email → tagline → socials, all stacked. Signature sits
 *     to the right of the social row at smaller scale so it shares a
 *     line with the icons.
 *   - md+: email + tagline + socials on the left column, signature
 *     vertically centered on the right column at full scale.
 *
 * Hierarchy:
 *   1. Email — primary call, underlined, medium weight.
 *   2. Tagline — what kind of work I'm open to + where I am.
 *   3. Social row — icons (LinkedIn, Dribbble) + Resume label.
 *   4. Signature — wordmark balancing the email.
 *   5. Bottom strip — © year + Made with Claude credit.
 */
export function Footer() {
  const year = new Date().getFullYear();
  // Bump to fire a confetti burst (e.g. when the email is copied).
  const [confettiRun, setConfettiRun] = useState(0);
  // True once the user has scrolled into the footer reveal zone, used
  // to stagger fade-in animations on the email, tagline, and links.
  const [revealed, setRevealed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  function celebrateCopy() {
    play("confetti");
    setConfettiRun((n) => n + 1);
  }

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fdf004] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a] rounded-sm";

  // Shared entrance class. Each element overrides --d to stagger.
  // Sits at translateY(12px) + opacity 0 until `revealed` flips, then
  // settles into place over 600ms ease-out-quint.
  const enterBase =
    "transition-[opacity,transform] duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
  const enterStateClass = revealed
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  return (
    <footer
      ref={footerRef}
      className="flex h-full flex-col justify-between pb-10 pt-12 md:pb-14 md:pt-16"
      style={{ color: "#f5f5f5" }}
    >
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
          {/* Left: email + tagline + socials */}
          <div className="flex min-w-0 flex-col gap-6 md:gap-8">
            <div
              className={`${enterBase} ${enterStateClass}`}
              style={{ transitionDelay: revealed ? "0ms" : "0ms" }}
            >
              <EmailLink
                email={links.emailDisplay}
                onCopied={celebrateCopy}
                className={`footer-email-link inline-block max-w-full break-words text-[clamp(1.5rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] md:whitespace-nowrap ${FOCUS_RING}`}
              />
            </div>

            <p
              className={`max-w-[42ch] text-[14px] leading-[1.55] md:text-[16px] [text-wrap:pretty] ${enterBase} ${enterStateClass}`}
              style={{ color: "#a0a0a0", transitionDelay: revealed ? "120ms" : "0ms" }}
            >
              Open to senior product design roles. Mumbai,
              remote-friendly.
            </p>

            {/* Social row. Mobile shows icons + Resume; the signature
               tucks in on the right at small scale so the whole row
               stays one line on phone. md+ moves the signature out
               to the right column. */}
            <div
              className={`flex items-center justify-between gap-6 ${enterBase} ${enterStateClass}`}
              style={{ transitionDelay: revealed ? "220ms" : "0ms" }}
            >
              <div
                className="flex items-center gap-2 text-[15px] font-medium md:gap-3"
                style={{ color: "#a0a0a0" }}
              >
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="LinkedIn"
                  aria-label="LinkedIn"
                  className={`inline-flex h-11 w-11 items-center justify-center transition-[color,transform] duration-200 ease-out hover:-translate-y-[2px] hover:text-white ${FOCUS_RING}`}
                >
                  <svg
                    aria-hidden
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18V9.99H5.67V18h2.67ZM7 8.86a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1ZM18.34 18v-4.39c0-2.55-1.36-3.73-3.18-3.73-1.47 0-2.13.81-2.5 1.38V9.99h-2.67c.04.75 0 8.01 0 8.01h2.67v-4.47c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.79V18h2.88Z" />
                  </svg>
                </a>
                <a
                  href={links.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="Dribbble"
                  aria-label="Dribbble"
                  className={`inline-flex h-11 w-11 items-center justify-center transition-[color,transform] duration-200 ease-out hover:-translate-y-[2px] hover:text-white ${FOCUS_RING}`}
                >
                  <svg
                    aria-hidden
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.62 4.62a8.5 8.5 0 0 1 1.86 5.18c-.27-.06-2.96-.6-5.66-.26-.06-.14-.12-.29-.18-.43-.17-.4-.36-.81-.55-1.2 3-1.22 4.37-2.99 4.53-3.29Zm-1.15-1.06c-.13.18-1.36 1.85-4.27 2.93-1.34-2.47-2.82-4.49-3.05-4.8 2.5-.6 5.18.07 7.32 1.87ZM8.55 4.38c.22.29 1.68 2.32 3.03 4.74-3.81 1.02-7.18 1-7.54.99.53-2.5 2.22-4.59 4.51-5.73ZM3.82 12.01v-.26c.35.01 4.31.06 8.38-1.16.23.46.45.92.66 1.39-.1.03-.21.06-.31.09-4.2 1.36-6.43 5.07-6.62 5.39A8.46 8.46 0 0 1 3.82 12Zm3.16 6.45c.13-.27 1.7-3.27 6.28-4.86.02-.01.04-.01.05-.02 1.15 2.96 1.62 5.45 1.74 6.16a8.5 8.5 0 0 1-8.07-1.28Zm9.71.42c-.09-.51-.52-2.89-1.59-5.81 2.55-.41 4.78.26 5.06.35a8.51 8.51 0 0 1-3.47 5.46Z" />
                  </svg>
                </a>
                <a
                  href={links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="Resume"
                  className={`inline-flex h-11 items-center px-2 transition-[color,transform] duration-200 ease-out hover:-translate-y-[2px] hover:text-white ${FOCUS_RING}`}
                >
                  Resume
                </a>
              </div>

              {/* Mobile-only signature, small scale, inline with
                 socials so it doesn't push tagline up. Hidden on md+
                 where it lives in the right column at full size. */}
              <div className="shrink-0 md:hidden">
                <SignatureLetters className="opacity-90 [&_svg]:!h-10" />
              </div>
            </div>
          </div>

          {/* Right: signature on tablet+. Hidden on mobile (rendered
             inline with socials above). */}
          <div
            className={`hidden shrink-0 md:block ${enterBase} ${enterStateClass}`}
            style={{ transitionDelay: revealed ? "180ms" : "0ms" }}
          >
            <SignatureLetters className="opacity-90" />
          </div>
        </div>
      </Container>

      {/* Bottom strip — quietest tier. Year on the left, credit on
         the right. Both small body, no uppercase, no tracking. */}
      <Container>
        <div
          className={`mt-8 flex items-center justify-between text-[12px] md:text-[13px] ${enterBase} ${enterStateClass}`}
          style={{ color: "#7a7a7a", transitionDelay: revealed ? "320ms" : "0ms" }}
        >
          <span className="tabular-nums">© {year} Vishal Maurya</span>
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
            data-cursor-label="Claude"
            className={`transition-colors hover:text-white ${FOCUS_RING}`}
          >
            Made with Claude
          </a>
        </div>
      </Container>

      {/* Confetti burst on email copy. Fixed full-viewport overlay
         renders at z-200 so it spans across the lifted page edge
         and the revealed footer alike. */}
      <Confetti runId={confettiRun} />
    </footer>
  );
}
