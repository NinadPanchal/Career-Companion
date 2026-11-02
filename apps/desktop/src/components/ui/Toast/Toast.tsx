import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { Button } from "../button";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastMessage, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = "info", duration = 4000 }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => {
        // Enforce max 3 visible toasts per design.md
        const next = [...prev, { id, title, message, type, duration }];
        return next.slice(-3);
      });

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback((message: string, title?: string) => toast({ message, title, type: "success" }), [toast]);
  const error = useCallback((message: string, title?: string) => toast({ message, title, type: "error" }), [toast]);
  const info = useCallback((message: string, title?: string) => toast({ message, title, type: "info" }), [toast]);
  const warning = useCallback((message: string, title?: string) => toast({ message, title, type: "warning" }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      {/* Toast Container: bottom-right per design.md */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
      >
        {toasts.map((t) => {
          const iconMap = {
            success: <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />,
            error: <AlertCircle size={16} className="text-[var(--danger)] shrink-0 mt-0.5" />,
            warning: <AlertCircle size={16} className="text-[var(--warning)] shrink-0 mt-0.5" />,
            info: <Info size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />,
          };

          return (
            <div
              key={t.id}
              className="pointer-events-auto glass rounded-[var(--radius-md)] p-3.5 shadow-[var(--glass-shadow)] flex items-start gap-3 animate-[slide-up_var(--dur-base)_var(--ease)] text-[var(--text)] border border-[var(--glass-border)]"
            >
              {iconMap[t.type || "info"]}
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-[var(--text-sm)] font-semibold leading-tight mb-0.5">
                    {t.title}
                  </p>
                )}
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] leading-relaxed">
                  {t.message}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => dismiss(t.id)}
                className="h-6 w-6 text-[var(--text-faint)] hover:text-[var(--text)]"
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </Button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

