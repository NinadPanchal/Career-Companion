import clsx from "clsx";

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
  color?: "emerald" | "sky" | "amber" | "rose" | "zinc";
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
  className,
}: ProgressRingProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  // Threshold automatically if color not explicitly passed
  const resolvedColor = color ?? (
    normalizedValue >= 85 ? "emerald" : normalizedValue >= 65 ? "amber" : "zinc"
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const colorMap = {
    emerald: "stroke-[#10b981] text-[#10b981]",
    sky: "stroke-[#38bdf8] text-[#38bdf8]",
    amber: "stroke-[#f59e0b] text-[#f59e0b]",
    rose: "stroke-[#f43f5e] text-[#f43f5e]",
    zinc: "stroke-[#71717a] text-[#71717a]",
  };

  return (
    <div
      className={clsx("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={clsx("transition-all duration-500 ease-out", colorMap[resolvedColor].split(" ")[0])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {showLabel && (
        <span className={clsx("absolute text-[11px] font-mono font-medium tabular-nums", colorMap[resolvedColor].split(" ")[1])}>
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

export function MatchGauge({ score, label, showBar = true, className }: MatchGaugeProps) {
  const normalized = Math.min(100, Math.max(0, score));
  const isHigh = normalized >= 85;
  const isMid = normalized >= 65 && normalized < 85;

  const textColor = isHigh
    ? "text-[#10b981]"
    : isMid
    ? "text-[#f59e0b]"
    : "text-[#71717a]";

  const barColor = isHigh
    ? "bg-[#10b981]"
    : isMid
    ? "bg-[#f59e0b]"
    : "bg-[#71717a]";

  return (
    <div className={clsx("flex flex-col gap-1.5 select-none", className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className={clsx("font-mono font-medium tabular-nums", textColor)}>
          {normalized}% {label ?? "Match Score"}
        </span>
        <span className="font-mono text-[10px] text-[#71717a]">
          {isHigh ? "Strong fit" : isMid ? "Moderate fit" : "Skill gap"}
        </span>
      </div>
      {showBar && (
        <div className="w-full h-[3px] bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all duration-300", barColor)}
            style={{ width: `${normalized}%` }}
          />
        </div>
      )}
    </div>
  );
}
