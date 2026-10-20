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
        "inline-flex items-center rounded-xl bg-[#0d0e13]/80 p-1 border border-white/[0.06] backdrop-blur-md select-none",
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
              "relative z-10 flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer",
              {
                "px-3 py-1 text-xs": size === "sm",
                "px-4 py-1.5 text-xs sm:text-sm": size === "md",
              },
              isActive ? "text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.1] shadow-sm -z-10"
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/[0.05] text-zinc-400"
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
