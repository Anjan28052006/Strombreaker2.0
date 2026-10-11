import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "cyan" | "outline" | "amber" | "teal" | "purple";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold",
    warning: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    destructive: "bg-rose-50 text-rose-800 border-rose-300 font-semibold",
    cyan: "bg-teal-50 text-teal-800 border-teal-300 font-semibold",
    teal: "bg-teal-100 text-teal-900 border-teal-300 font-bold",
    purple: "bg-purple-50 text-purple-900 border-purple-300 font-semibold",
    amber: "bg-orange-50 text-orange-800 border-orange-300 font-semibold",
    outline: "bg-white/80 text-slate-700 border-teal-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
