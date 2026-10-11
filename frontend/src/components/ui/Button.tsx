import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "emerald" | "amber" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variants = {
      primary: "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold shadow-md shadow-teal-600/20 hover:shadow-teal-600/30",
      secondary: "bg-white hover:bg-teal-50/50 text-slate-800 border border-teal-200 shadow-sm",
      outline: "bg-white/80 hover:bg-white text-slate-700 hover:text-teal-700 border border-teal-200/80 shadow-sm",
      ghost: "bg-transparent hover:bg-teal-50/70 text-slate-700 hover:text-teal-800",
      emerald: "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20",
      amber: "bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow-md shadow-amber-500/20",
      destructive: "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
