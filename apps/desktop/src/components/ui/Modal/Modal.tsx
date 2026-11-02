import React, { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]"
    >
      {/* Backdrop: rgba(0,0,0,0.4) with blur(6px) per design.md */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[6px] transition-opacity duration-[var(--dur-base)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface: .glass--strong, radius-lg, open animation scale from 0.97 */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full ${sizeClasses} glass glass--strong rounded-[var(--radius-lg)] p-[var(--space-5)] shadow-[var(--glass-shadow)] animate-[scale-in_var(--dur-base)_var(--ease)] overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 pb-[var(--space-3)] mb-[var(--space-4)] border-b border-[var(--divider)]">
            <div className="flex flex-col gap-1">
              {typeof title === "string" ? (
                <h2 className="text-[var(--text-lg)] font-semibold text-[var(--text)] tracking-tight">
                  {title}
                </h2>
              ) : (
                title
              )}
              {description && (
                <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] border border-transparent transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
