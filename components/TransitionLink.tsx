"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: string;
  children: ReactNode;
};

/**
 * Link that uses document.startViewTransition() when available so shared
 * `view-transition-name` elements morph between pages. Falls back to a normal
 * Next.js Link on unsupported browsers (Firefox stable, old Safari).
 */
export function TransitionLink({ href, children, onClick, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (typeof document === "undefined") return;
    if (!("startViewTransition" in document)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (
      !href.startsWith("/") ||
      href.startsWith("//") ||
      href.startsWith("/#")
    )
      return;

    e.preventDefault();
    (
      document as unknown as {
        startViewTransition: (cb: () => void) => void;
      }
    ).startViewTransition(() => {
      window.scrollTo(0, 0);
      router.push(href);
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
