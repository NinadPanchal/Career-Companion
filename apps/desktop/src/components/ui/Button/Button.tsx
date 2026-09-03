import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
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
        "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
        "disabled:opacity-50 disabled:pointer-events-none",
        {
          "px-3 py-1.5 text-xs gap-1.5": size === "sm",
          "px-4 py-2 text-sm gap-2": size === "md",
          "px-5 py-2.5 text-sm gap-2": size === "lg",
        },
        {
          "bg-emerald-500 text-black font-semibold hover:bg-emerald-400":
            variant === "primary",

          "bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1] border border-white/[0.06]":
            variant === "secondary",

          "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]":
            variant === "ghost",

          "bg-transparent text-zinc-300 border border-white/[0.1] hover:border-white/[0.16] hover:bg-white/[0.03]":
            variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}