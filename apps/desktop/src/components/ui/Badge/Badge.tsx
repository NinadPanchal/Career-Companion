import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

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
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = true,
  className,
  ...props
}: BadgeProps) {
  const dotColorMap: Record<BadgeVariant, string> = {
    applied: "bg-[#38bdf8]",
    screening: "bg-[#818cf8]",
    interview: "bg-[#f59e0b]",
    offer: "bg-[#10b981]",
    rejected: "bg-[#f43f5e]",
    discovered: "bg-[#a1a1aa]",
    archived: "bg-[#71717a]",
    emerald: "bg-[#10b981]",
    sky: "bg-[#38bdf8]",
    amber: "bg-[#f59e0b]",
    rose: "bg-[#f43f5e]",
    neutral: "bg-[#a1a1aa]",
  };

  const styleMap: Record<BadgeVariant, string> = {
    applied: "bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20",
    screening: "bg-[#818cf8]/10 text-[#818cf8] border-[#818cf8]/20",
    interview: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
    offer: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    rejected: "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20",
    discovered: "bg-white/[0.04] text-[#a1a1aa] border-white/[0.08]",
    archived: "bg-white/[0.02] text-[#71717a] border-white/[0.06]",
    emerald: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    sky: "bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20",
    amber: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
    rose: "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20",
    neutral: "bg-white/[0.04] text-[#a1a1aa] border-white/[0.08]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[6px] font-medium border select-none transition-colors",
        {
          "h-5 px-2 text-[11px] leading-none": size === "sm",
          "h-6 px-2.5 text-xs leading-none": size === "md",
        },
        styleMap[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColorMap[variant]
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}
