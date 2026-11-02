import React from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "", ...props }: SpinnerProps) {
  const sizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 24,
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center text-[var(--text-muted)] ${className}`}
      {...props}
    >
      <Loader2
        size={sizeMap[size]}
        className="animate-spin text-current"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;

