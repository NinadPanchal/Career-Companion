import React, { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = "", containerClassName = "", id, checked, defaultChecked, disabled, onChange, ...props }, ref) => {
    const checkboxId = id || (typeof label === "string" ? `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-start gap-2.5 select-none cursor-pointer group ${
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
        } ${containerClassName}`}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="w-[18px] h-[18px] rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[var(--bg)] transition-all duration-[var(--dur-fast)] ease-[var(--ease)] flex items-center justify-center text-[var(--accent-contrast)]" />
          <Check
            size={12}
            strokeWidth={3}
            className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-[var(--dur-fast)] text-[var(--accent-contrast)]"
          />
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-[var(--text-sm)] font-medium text-[var(--text)] group-hover:text-[var(--text)] transition-colors">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
