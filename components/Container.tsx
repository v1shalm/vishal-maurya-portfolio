import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** `default` = global 1440px width · `prose` narrows contents via max-w-[58ch] */
  variant?: "default" | "prose";
};

export function Container({
  children,
  variant = "default",
  className = "",
  ...rest
}: ContainerProps) {
  const proseClass = variant === "prose" ? " max-w-[58ch]" : "";
  return (
    <div
      className={`page-container${proseClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
