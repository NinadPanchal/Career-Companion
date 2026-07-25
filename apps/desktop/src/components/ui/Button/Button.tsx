import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  rounded = "lg",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500",
        {
          "px-3 py-2 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-7 py-3.5 text-lg": size === "lg",
        },
        {
          "rounded-sm": rounded === "sm",
          "rounded-md": rounded === "md",
          "rounded-lg": rounded === "lg",
          "rounded-full": rounded === "full",
        },
        {
          "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95":
            variant === "primary",

          "bg-zinc-800 text-white hover:bg-zinc-700":
            variant === "secondary",

          "bg-transparent text-zinc-300 hover:bg-zinc-800":
            variant === "ghost",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}