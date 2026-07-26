import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
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
        "rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg",
        hover && "transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}