import React from "react";
import { Shield, Lock, Terminal, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-teal-200/70 bg-white/70 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8 text-slate-700 shadow-sm">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-wider text-base font-mono">STROMBREAKER 2.0</span>
          </div>
          <p className="text-xs text-slate-600 max-w-md text-center md:text-left leading-relaxed">
            Blue-Team AI Firewall & Guardrail Defense for AI-Powered Banking. Deterministic policy enforcement, prompt-injection defense, and atomic financial integrity.
          </p>
        </div>

        {/* Guardrail Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>BLUE-TEAM FIREWALL ACTIVE • LATENCY &lt; 15MS</span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <Link to="/" className="hover:text-teal-700 transition-colors">Home</Link>
          <a href="/#features" className="hover:text-teal-700 transition-colors">Features</a>
          <Link to="/security-events" className="hover:text-teal-700 transition-colors">Firewall Center</Link>
          <Link to="/login" className="hover:text-teal-700 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-teal-700 transition-colors">Open Account</Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-8 pt-6 border-t border-teal-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 Strombreaker 2.0 Financial Technologies Ltd. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span>All monetary operations validated server-side in integer paise (INR).</span>
        </p>
      </div>
    </footer>
  );
};
