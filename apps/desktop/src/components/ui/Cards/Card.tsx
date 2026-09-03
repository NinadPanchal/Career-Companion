import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-white/[0.06] bg-[#0f0f12] shadow-sm",
        hover && "transition-colors duration-200 hover:border-white/[0.12]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}