import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[10px] select-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-1 focus-visible:ring-offset-[#09090b]",
        "disabled:opacity-40 disabled:pointer-events-none",
        {
          "h-7 px-2.5 text-xs gap-1.5": size === "xs",
          "h-8 px-3 text-xs gap-2": size === "sm",
          "h-8 px-3.5 text-xs gap-2": size === "md",
          "h-9 px-4.5 text-sm gap-2.5": size === "lg",
        },
        {
          "bg-[#10b981] text-[#09090b] font-medium hover:bg-[#34d399] active:bg-[#059669]":
            variant === "primary",

          "bg-transparent text-[#f4f4f5] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.16] active:bg-white/[0.06]":
            variant === "secondary" || variant === "glass" || variant === "outline",

          "bg-transparent text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.04] active:bg-white/[0.06]":
            variant === "ghost",

          "bg-rose-500/10 text-[#f43f5e] border border-rose-500/20 hover:bg-rose-500/20 active:bg-rose-500/25":
            variant === "danger",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}