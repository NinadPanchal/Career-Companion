import React from "react";

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
  color?: "emerald" | "sky" | "amber" | "rose" | "zinc" | "accent";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressRing({
  value,
  size = 40,
  strokeWidth = 3,
  color,
  showLabel = true,
  label,
  className = "",
}: ProgressRingProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  // Threshold automatically if color not explicitly passed
  const resolvedColor =
    color ?? (normalizedValue >= 85 ? "emerald" : normalizedValue >= 65 ? "amber" : "zinc");

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const colorClasses = {
    emerald: "stroke-[var(--success)] text-[var(--success)]",
    sky: "stroke-[var(--accent)] text-[var(--accent)]",
    amber: "stroke-[var(--warning)] text-[var(--warning)]",
    rose: "stroke-[var(--danger)] text-[var(--danger)]",
    zinc: "stroke-[var(--text-muted)] text-[var(--text-muted)]",
    accent: "stroke-[var(--accent)] text-[var(--accent)]",
  }[resolvedColor];

  const strokeColorClass = colorClasses.split(" ")[0];
  const textColorClass = colorClasses.split(" ")[1];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`transition-all duration-500 ease-out ${strokeColorClass}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {showLabel && (
        <span
          className={`absolute text-[11px] font-mono font-medium tabular-nums ${textColorClass}`}
        >
          {label ?? `${Math.round(normalizedValue)}%`}
        </span>
      )}
    </div>
  );
}

export interface MatchGaugeProps {
  score: number;
  label?: string;
  showBar?: boolean;
  className?: string;
}

export function MatchGauge({ score, label, showBar = true, className = "" }: MatchGaugeProps) {
  const normalized = Math.min(100, Math.max(0, score));
  const isHigh = normalized >= 85;
  const isMid = normalized >= 65 && normalized < 85;

  const textColor = isHigh
    ? "text-[var(--success)]"
    : isMid
    ? "text-[var(--warning)]"
    : "text-[var(--text-muted)]";

  const barColor = isHigh
    ? "bg-[var(--success)]"
    : isMid
    ? "bg-[var(--warning)]"
    : "bg-[var(--text-muted)]";

  return (
    <div className={`flex flex-col gap-1.5 select-none ${className}`}>
      <div className="flex items-center justify-between gap-3 text-[var(--text-xs)]">
        <span className={`font-mono font-medium tabular-nums ${textColor}`}>
          {normalized}% {label ?? "Match Score"}
        </span>
        <span className="font-mono text-[10px] text-[var(--text-faint)]">
          {isHigh ? "Strong fit" : isMid ? "Moderate fit" : "Skill gap"}
        </span>
      </div>
      {showBar && (
        <div className="w-full h-[3px] bg-[var(--glass-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${normalized}%` }}
          />
        </div>
      )}
    </div>
  );
}
