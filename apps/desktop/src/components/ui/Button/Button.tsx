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
        "inline-flex items-center justify-center font-medium transition-all duration-180 ease-out rounded-xl active:scale-[0.98] select-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080a]",
        "disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100",
        {
          "h-7 px-2.5 text-xs gap-1.5": size === "xs",
          "h-8 px-3.5 text-xs gap-2": size === "sm",
          "h-10 px-4.5 text-sm gap-2.5": size === "md",
          "h-12 px-6 text-base gap-3 font-semibold": size === "lg",
        },
        {
          "bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-zinc-950 font-semibold shadow-[0_2px_10px_rgba(16,185,129,0.25),inset_0px_1px_0px_rgba(255,255,255,0.35)] hover:from-emerald-300 hover:to-emerald-500 hover:shadow-[0_4px_16px_rgba(16,185,129,0.35)]":
            variant === "primary",

          "bg-zinc-800/60 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-white/[0.08] hover:border-white/[0.14] shadow-sm":
            variant === "secondary",

          "bg-white/[0.04] text-zinc-200 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] backdrop-blur-md shadow-sm":
            variant === "glass",

          "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]":
            variant === "ghost",

          "bg-transparent text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04]":
            variant === "outline",

          "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50":
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