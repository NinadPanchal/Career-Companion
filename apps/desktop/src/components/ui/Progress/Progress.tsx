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
  size = 54,
  strokeWidth = 4,
  color = "emerald",
  showLabel = true,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const colorMap = {
    emerald: "stroke-emerald-400 text-emerald-400",
    sky: "stroke-sky-400 text-sky-400",
    amber: "stroke-amber-400 text-amber-400",
    rose: "stroke-rose-400 text-rose-400",
    zinc: "stroke-zinc-400 text-zinc-400",
  };

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
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
          className={clsx("transition-all duration-700 ease-out", colorMap[color])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {showLabel && (
        <span className={clsx("absolute text-xs font-mono font-bold tracking-tighter", colorMap[color].split(" ")[1])}>
          {label ?? `${Math.round(normalizedValue)}%`}
        </span>
      )}
    </div>
  );
}
