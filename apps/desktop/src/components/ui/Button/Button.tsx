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
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
        "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
        {
          "h-7 px-3 text-xs gap-1.5": size === "sm",
          "h-9 px-4 text-sm gap-2": size === "md",
          "h-10 px-5 text-sm gap-2": size === "lg",
        },
        {
          "bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 font-semibold shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-emerald-600 hover:from-emerald-300 hover:to-emerald-400":
            variant === "primary",

          "bg-zinc-800/50 text-zinc-100 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-700 shadow-sm":
            variant === "secondary",

          "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50":
            variant === "ghost",

          "bg-transparent text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50":
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