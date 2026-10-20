import { motion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  size?: "sm" | "md";
  layoutId?: string;
}

export default function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
  layoutId = "active-tab-indicator",
}: TabsProps<T>) {
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-[8px] bg-[#09090b] p-0.5 border border-white/[0.08] select-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={clsx(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-[6px] font-medium transition-colors cursor-pointer",
              {
                "px-2.5 py-1 text-xs": size === "sm",
                "px-3 py-1.5 text-xs": size === "md",
              },
              isActive ? "text-[#f4f4f5] font-semibold" : "text-[#71717a] hover:text-[#a1a1aa]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 rounded-[6px] bg-[#18181b] border border-white/[0.12] -z-10"
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  "font-mono text-[10px] px-1 rounded-[4px]",
                  isActive
                    ? "bg-[#10b981]/15 text-[#10b981]"
                    : "bg-white/[0.04] text-[#71717a]"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
