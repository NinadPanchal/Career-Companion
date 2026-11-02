import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 font-medium text-sm leading-none select-none rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_60%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_35%,transparent)]",
        secondary:
          "glass bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-[var(--text)] border border-[var(--glass-border)] hover:border-[var(--glass-highlight)] backdrop-blur-xl shadow-sm",
        ghost:
          "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg-strong)] border border-transparent",
        outline:
          "bg-transparent border border-[var(--glass-border)] text-[var(--text)] hover:bg-[var(--glass-bg)] hover:border-[var(--glass-highlight)]",
        destructive:
          "bg-[var(--danger)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--danger)_35%,transparent)]",
        danger:
          "bg-[var(--danger)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--danger)_35%,transparent)]",
        glass:
          "glass bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-[var(--text)] border border-[var(--glass-border)] hover:border-[var(--glass-highlight)] backdrop-blur-xl shadow-sm",
        link:
          "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto bg-transparent border-0 font-medium",
      },
      size: {
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        xs: "h-7 px-2.5 text-xs [&_svg]:size-3",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base [&_svg]:size-4.5",
        icon: "h-10 w-10 p-0 shrink-0",
        "icon-sm": "h-8 w-8 p-0 shrink-0 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(props as any)}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
