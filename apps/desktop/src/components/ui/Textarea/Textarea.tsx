import React, { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      className = "",
      containerClassName = "",
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[var(--text-sm)] font-medium text-[var(--text-muted)] select-none"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={`w-full rounded-[var(--radius-md)] bg-[var(--glass-bg)] border ${
            error
              ? "border-[var(--danger)] focus:border-[var(--danger)]"
              : "border-[var(--glass-border)] focus:border-[var(--accent)]"
          } p-3.5 text-[var(--text-md)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] resize-y disabled:opacity-40 disabled:cursor-not-allowed leading-relaxed ${className}`}
          {...props}
        />

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

Textarea.displayName = "Textarea";

export default Textarea;

