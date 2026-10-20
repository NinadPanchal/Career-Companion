import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  hover?: boolean;
  ambient?: boolean;
  variant?: "glass" | "default" | "elevated" | "subtle";
}

export default function Card({
  children,
  hover = false,
  variant = "default",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-[10px] transition-colors duration-150",
        {
          "bg-[#0f0f12] border border-white/[0.08]": variant === "default" || variant === "glass",
          "bg-[#18181b] border border-white/[0.12] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)]": variant === "elevated",
          "bg-[#09090b] border border-white/[0.06]": variant === "subtle",
        },
        hover && "hover:border-white/[0.16]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}