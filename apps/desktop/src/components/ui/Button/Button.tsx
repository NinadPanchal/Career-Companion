import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  // Determine if button is disabled (loading or explicitly disabled)
  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-1 focus-visible:ring-offset-[#09090b]",
        "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
        {
          "h-7 px-2.5 text-xs gap-1.5": size === "xs",
          "h-8 px-3 text-xs gap-2": size === "sm",
          "h-8 px-3.5 text-xs gap-2": size === "md",
          "h-9 px-4.5 text-sm gap-2.5": size === "lg",
        },
        {
          "bg-[#10b981] text-[#09090b] font-medium hover:bg-[#34d399] active:bg-[#059669] shadow-sm hover:shadow-md":
            variant === "primary" && !isDisabled,

          "bg-transparent text-[#f4f4f5] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.16] active:bg-white/[0.06] shadow-sm hover:shadow-md":
            variant === "secondary" || variant === "glass" || variant === "outline",

          "bg-transparent text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.04] active:bg-white/[0.06] shadow-sm hover:shadow-md":
            variant === "ghost",

          "bg-rose-500/10 text-[#f43f5e] border border-rose-500/20 hover:bg-rose-500/20 active:bg-rose-500/25 shadow-sm hover:shadow-md":
            variant === "danger",
        },
        // Loading state styles
        loading && "relative cursor-wait",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading spinner - positioned appropriately */}
      {loading && (
        <Loader2
          className={clsx(
            "animate-spin absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
            size === "xs" ? "h-3 w-3" : size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-4.5 w-4.5"
          )}
        />
      )}

      {/* Left icon with proper spacing */}
      {leftIcon && !loading && (
        <span className="mr-1.5 flex-shrink-0">
          {leftIcon}
        </span>
      )}

      {/* Button content with reduced opacity when loading */}
      <span className={clsx(loading && "opacity-0")}>{children}</span>

      {/* Right icon with proper spacing */}
      {rightIcon && !loading && (
        <span className="ml-1.5 flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
}