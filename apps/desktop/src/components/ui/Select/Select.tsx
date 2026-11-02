import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      children,
      className = "",
      containerClassName = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-[var(--text-sm)] font-medium text-[var(--text-muted)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`h-9.5 w-full appearance-none rounded-[var(--radius-md)] bg-[var(--glass-bg)] border ${
              error
                ? "border-[var(--danger)] focus:border-[var(--danger)]"
                : "border-[var(--glass-border)] focus:border-[var(--accent)]"
            } pl-3.5 pr-10 text-[var(--text-md)] text-[var(--text)] outline-none transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[var(--surface-solid)] text-[var(--text)]"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 pointer-events-none text-[var(--text-muted)] shrink-0"
          />
        </div>

        {(error || helperText) && (
          <p
            className={`text-[var(--text-xs)] ${
              error ? "text-[var(--danger)]" : "text-[var(--text-faint)]"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

