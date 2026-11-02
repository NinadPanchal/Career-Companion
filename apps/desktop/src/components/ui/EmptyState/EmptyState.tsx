import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import Button, { ButtonProps } from "../Button/Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
    icon?: ReactNode;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-[var(--space-6)] rounded-[var(--radius-lg)] glass ${className}`}
    >
      <div className="w-12 h-12 flex items-center justify-center text-[var(--text-faint)] mb-[var(--space-3)]">
        <Icon size={48} strokeWidth={1.5} />
      </div>

      <h3 className="text-[var(--text-lg)] font-semibold text-[var(--text)] tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-[var(--text-sm)] text-[var(--text-muted)] max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-[var(--space-4)]">
          <Button
            variant={action.variant || "primary"}
            size="sm"
            onClick={action.onClick}
            leftIcon={action.icon}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
