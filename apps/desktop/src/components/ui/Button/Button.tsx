import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Base styling per Step 2: height 36-40px, padding 0 16-20px, gap 8px, whitespace-nowrap
  const baseClasses =
    "inline-flex items-center justify-center font-medium whitespace-nowrap select-none transition-all duration-[var(--dur-fast)] ease-[var(--ease)] rounded-[var(--radius-md)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] cursor-pointer disabled:pointer-events-none disabled:active:scale-100 disabled:opacity-40 shrink-0";

  // Size hierarchy
  const sizeClasses = {
    xs: "h-7 px-3 text-[var(--text-xs)] gap-2",
    sm: "h-8.5 px-4 text-[var(--text-sm)] gap-2",
    md: "h-9.5 px-4.5 sm:px-5 text-[var(--text-md)] gap-2", // 38px height, 18-20px padding
    lg: "h-10 px-5 sm:px-6 text-[var(--text-md)] gap-2.5",  // 40px height, 20-24px padding
  }[size];

  // Variant hierarchy per design.md Section 6
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses =
        "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[var(--accent-hover)]";
      break;
    case "secondary":
    case "glass":
    case "outline":
      variantClasses =
        "glass text-[var(--text)] hover:bg-[var(--glass-bg-strong)] hover:border-[var(--glass-highlight)]";
      break;
    case "ghost":
      variantClasses =
        "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] border border-transparent";
      break;
    case "danger":
      variantClasses =
        "bg-[var(--danger)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90";
      break;
  }

  const spinnerSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${
        loading ? "relative cursor-wait" : ""
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2
          size={spinnerSizes[size]}
          className="animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-current"
        />
      )}

      {leftIcon && !loading && (
        <span className="shrink-0 flex items-center justify-center">
          {leftIcon}
        </span>
      )}

      <span className={`inline-block ${loading ? "opacity-0 invisible" : ""}`}>{children}</span>

      {rightIcon && !loading && (
        <span className="shrink-0 flex items-center justify-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

export default Button;
