import { motion } from "framer-motion";
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

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = "",
  size = "md",
  layoutId = "active-tab-indicator",
}: TabsProps<T>) {
  return (
    <div
      className={`inline-flex items-center rounded-[var(--radius-md)] bg-[var(--glass-bg)] p-1 border border-[var(--glass-border)] select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              size === "sm"
                ? "px-3 py-1.5 text-[var(--text-xs)]"
                : "px-4 py-2 text-[var(--text-sm)]"
            } ${
              isActive
                ? "text-[var(--text)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 rounded-[var(--radius-sm)] glass glass--strong -z-10 shadow-sm"
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--glass-bg-strong)] text-[10px] font-mono text-[var(--text-muted)]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
