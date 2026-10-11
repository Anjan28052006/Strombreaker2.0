import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "destructive";
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  children,
  onClose,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-[#00D2FF] shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    destructive: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const borderBgs = {
    info: "border-cyan-200 bg-cyan-50/90 text-cyan-950 shadow-sm",
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-950 shadow-sm",
    warning: "border-amber-200 bg-amber-50/90 text-amber-950 shadow-sm",
    destructive: "border-rose-200 bg-rose-50/90 text-rose-950 shadow-sm",
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed backdrop-blur-md font-medium",
        borderBgs[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
