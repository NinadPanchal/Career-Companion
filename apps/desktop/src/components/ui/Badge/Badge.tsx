import { HTMLAttributes, ReactNode } from "react";

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
  | "primary"
  | "success";

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
    success: "bg-[var(--success)]",
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
    success:
      "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] border-[color-mix(in_srgb,var(--success)_25%,transparent)]",
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

  // Step 2 Spacing: padding 6px 12px (small ones 4px 10px), whitespace-nowrap, gap 6-8px
  const sizeClasses = {
    sm: "py-1 px-2.5 text-[11px] gap-1.5", // 4px 10px
    md: "py-1.5 px-3 text-[var(--text-xs)] gap-2", // 6px 12px
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-[var(--radius-sm)] border select-none transition-colors whitespace-nowrap leading-none shrink-0 ${sizeClasses} ${badgeStyleClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}

export default Badge;
