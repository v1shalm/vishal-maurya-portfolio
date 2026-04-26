import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "yellow" | "pink" | "white";

type Common = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type AnchorProps = Common &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className"> & {
    href: string;
  };

type ButtonElProps = Common &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | ButtonElProps;

const isExternalHref = (href: string) =>
  /^(https?:|mailto:|tel:|#)/i.test(href);

export function Button(props: ButtonProps) {
  const variant: Variant = props.variant ?? "yellow";
  const cls = `btn btn--${variant}${props.className ? ` ${props.className}` : ""}`;

  if ("href" in props && props.href) {
    const { href, variant: _variant, className: _className, children, ...rest } = props;

    if (isExternalHref(href)) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    className: _className,
    children,
    type = "button",
    ...rest
  } = props as ButtonElProps;

  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
