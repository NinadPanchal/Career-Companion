import React, { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "discovered"
  | "archived"
  | "emerald"
  | "sky"
  | "amber"
  | "rose"
  | "neutral"
  | "primary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = true,
  className = "",
  ...props
}: BadgeProps) {
  // Dot styling using semantic status tokens
  const dotColorClasses: Record<BadgeVariant, string> = {
    applied: "bg-[var(--status-applied)]",
    screening: "bg-[var(--accent)]",
    interview: "bg-[var(--status-interview)]",
    offer: "bg-[var(--status-offer)]",
    rejected: "bg-[var(--status-rejected)]",
    discovered: "bg-[var(--status-discovered)]",
    archived: "bg-[var(--text-faint)]",
    emerald: "bg-[var(--status-offer)]",
    sky: "bg-[var(--status-applied)]",
    amber: "bg-[var(--status-interview)]",
    rose: "bg-[var(--status-rejected)]",
    neutral: "bg-[var(--text-muted)]",
    primary: "bg-[var(--accent)]",
  };

  // Badge surface styling using token color-mix
  const badgeStyleClasses: Record<BadgeVariant, string> = {
    applied:
      "bg-[color-mix(in_srgb,var(--status-applied)_12%,transparent)] text-[var(--status-applied)] border-[color-mix(in_srgb,var(--status-applied)_25%,transparent)]",
    screening:
      "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_25%,transparent)]",
    interview:
      "bg-[color-mix(in_srgb,var(--status-interview)_12%,transparent)] text-[var(--status-interview)] border-[color-mix(in_srgb,var(--status-interview)_25%,transparent)]",
    offer:
      "bg-[color-mix(in_srgb,var(--status-offer)_12%,transparent)] text-[var(--status-offer)] border-[color-mix(in_srgb,var(--status-offer)_25%,transparent)]",
    rejected:
      "bg-[color-mix(in_srgb,var(--status-rejected)_12%,transparent)] text-[var(--status-rejected)] border-[color-mix(in_srgb,var(--status-rejected)_25%,transparent)]",
    discovered:
      "bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)]",
    archived:
      "bg-[var(--glass-bg)] text-[var(--text-faint)] border-[var(--divider)]",
    emerald:
      "bg-[color-mix(in_srgb,var(--status-offer)_12%,transparent)] text-[var(--status-offer)] border-[color-mix(in_srgb,var(--status-offer)_25%,transparent)]",
    sky:
      "bg-[color-mix(in_srgb,var(--status-applied)_12%,transparent)] text-[var(--status-applied)] border-[color-mix(in_srgb,var(--status-applied)_25%,transparent)]",
    amber:
      "bg-[color-mix(in_srgb,var(--status-interview)_12%,transparent)] text-[var(--status-interview)] border-[color-mix(in_srgb,var(--status-interview)_25%,transparent)]",
    rose:
      "bg-[color-mix(in_srgb,var(--status-rejected)_12%,transparent)] text-[var(--status-rejected)] border-[color-mix(in_srgb,var(--status-rejected)_25%,transparent)]",
    neutral:
      "bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)]",
    primary:
      "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_25%,transparent)]",
  };

  const sizeClasses = {
    sm: "h-5 px-2 text-[11px] gap-1.5",
    md: "h-6 px-2.5 text-[var(--text-xs)] gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-[var(--radius-sm)] border select-none transition-colors leading-none ${sizeClasses} ${badgeStyleClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default Badge;
