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
    applied: "bg-sky-400",
    screening: "bg-indigo-400",
    interview: "bg-amber-400",
    offer: "bg-emerald-400",
    rejected: "bg-rose-400",
    discovered: "bg-zinc-400",
    archived: "bg-zinc-500",
    emerald: "bg-emerald-400",
    sky: "bg-sky-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    neutral: "bg-zinc-400",
  };

  const styleMap: Record<BadgeVariant, string> = {
    applied: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    screening: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    discovered: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    archived: "bg-zinc-800/40 text-zinc-400 border-zinc-700/30",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    neutral: "bg-white/[0.04] text-zinc-300 border-white/[0.08]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium border font-mono tracking-tight",
        {
          "px-2 py-0.5 text-[10px]": size === "sm",
          "px-2.5 py-1 text-xs": size === "md",
        },
        styleMap[variant] || styleMap.neutral,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            "rounded-full shrink-0",
            size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
            dotColorMap[variant] || dotColorMap.neutral
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
