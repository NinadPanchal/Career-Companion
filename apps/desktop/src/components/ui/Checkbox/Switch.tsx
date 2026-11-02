import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      disabled,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const switchId =
      id || (typeof label === "string" ? `switch-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div
        className={`inline-flex items-center justify-between gap-3 select-none ${
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
        } ${containerClassName}`}
      >
        {(label || description) && (
          <div className="flex flex-col cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
            {label && (
              <span className="text-[var(--text-sm)] font-medium text-[var(--text)]">
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

        <button
          id={switchId}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-[var(--dur-base)] ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
            checked ? "bg-[var(--accent)]" : "bg-[var(--glass-bg-strong)] border-[var(--glass-border)]"
          } ${className}`}
          {...props}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-[var(--dur-base)] ease-[var(--ease)] ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;

