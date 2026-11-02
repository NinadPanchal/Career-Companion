import { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  hover?: boolean;
  variant?: "glass" | "solid" | "subtle" | "default" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  hover = false,
  variant = "glass",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  // Padding map per 4px grid (padding 20-24px standard per Step 2)
  const paddingClasses = {
    none: "",
    sm: "p-4",       // 16px
    md: "p-5 sm:p-6", // 20px on mobile, 24px on desktop
    lg: "p-6 sm:p-8", // 24px on mobile, 32px on desktop
  }[padding];

  // Variant surface map
  let surfaceClasses = "";
  switch (variant) {
    case "glass":
    case "default":
      surfaceClasses = "glass";
      break;
    case "elevated":
      surfaceClasses = "glass glass--strong";
      break;
    case "solid":
      surfaceClasses =
        "bg-[var(--surface-solid)] border border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--glass-shadow)]";
      break;
    case "subtle":
      surfaceClasses =
        "bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-lg)]";
      break;
  }

  return (
    <div
      className={`relative select-none ${surfaceClasses} ${paddingClasses} ${
        hover ? "glass--interactive cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
