import React, { HTMLAttributes, ReactNode } from "react";

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
  // Padding map
  const paddingClasses = {
    none: "",
    sm: "p-[var(--space-3)]",
    md: "p-[var(--space-4)] sm:p-[var(--space-5)]", // standard 24px per design.md
    lg: "p-[var(--space-6)]",
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
        "bg-[var(--surface-solid)] border border-[var(--divider)] rounded-[var(--radius-lg)] shadow-[var(--glass-shadow)]";
      break;
    case "subtle":
      surfaceClasses =
        "bg-[var(--glass-bg)] border border-[var(--divider)] rounded-[var(--radius-lg)]";
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
