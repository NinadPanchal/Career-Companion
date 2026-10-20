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
  ambient = false,
  variant = "glass",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-2xl transition-all duration-200",
        {
          "glass-panel shadow-sm": variant === "glass",
          "bg-[#0d0e12] border border-white/[0.08] shadow-sm": variant === "default",
          "bg-[#14151b] border border-white/[0.1] shadow-md": variant === "elevated",
          "bg-white/[0.02] border border-white/[0.05]": variant === "subtle",
        },
        ambient && "ambient-border",
        hover && "glass-panel-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}