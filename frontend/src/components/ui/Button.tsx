import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "emerald" | "amber" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer tracking-wide";

    const variants = {
      primary:
        "bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white shadow-lg shadow-teal-700/25 border border-teal-400/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-700/35",
      secondary:
        "bg-white/95 hover:bg-white text-slate-800 border border-teal-200/90 shadow-md shadow-slate-900/5 hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5",
      outline:
        "bg-white/80 hover:bg-white text-teal-800 border-2 border-teal-300 hover:border-teal-500 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      ghost:
        "bg-transparent hover:bg-teal-50 text-slate-700 hover:text-teal-900 font-semibold",
      emerald:
        "bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40 hover:-translate-y-0.5 hover:shadow-xl",
      amber:
        "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-600/25 border border-amber-300/40 hover:-translate-y-0.5 hover:shadow-xl",
      destructive:
        "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/25 border border-rose-300/40 hover:-translate-y-0.5 hover:shadow-xl",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs gap-1.5 rounded-lg",
      md: "h-11 px-5 text-sm gap-2 rounded-xl",
      lg: "h-13 px-7 text-base gap-2.5 rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
