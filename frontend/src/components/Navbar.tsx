import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Sparkles, LogOut, Menu, X, Bell, User as UserIcon, ArrowRight, Lock } from "lucide-react";
import { Button } from "./ui/Button";

export const Navbar: React.FC = () => {
  const { user, logout, unreadNotifications } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <nav className="mx-auto max-w-7xl rounded-2xl glass-nav px-5 py-3 shadow-2xl flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-900 text-lg">STROMBREAKER 2.0</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                AI FIREWALL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 tracking-wider hidden sm:block font-medium">GUARDRAIL DEFENSE</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/90 border border-teal-100/80 p-1">
          {!user ? (
            <>
              <Link
                to="/"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive("/") ? "bg-white text-teal-900 shadow-sm border border-teal-100 font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive("/dashboard") ? "bg-white text-teal-900 shadow-sm border border-teal-100 font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Dashboard
              </Link>
              <a
                href="/#features"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-900 transition-all"
              >
                Features
              </a>
              <Link
                to="/security-events"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive("/security-events") ? "bg-white text-teal-900 shadow-sm border border-teal-100 font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                AI Firewall
              </Link>
            </>
          ) : user.role === "CUSTOMER" ? (
            <>
              <Link
                to="/dashboard"
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive("/dashboard") ? "bg-teal-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/transfer"
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive("/transfer") ? "bg-teal-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Transfer
              </Link>
              <Link
                to="/transactions"
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive("/transactions") ? "bg-teal-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Transactions
              </Link>
              <Link
                to="/ai-assistant"
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-all ${
                  isActive("/ai-assistant") ? "bg-teal-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                AI Assistant
              </Link>
              <Link
                to="/security-events"
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive("/security-events") ? "bg-teal-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-teal-900"
                }`}
              >
                Firewall Live
              </Link>
            </>
          ) : user.role === "BANKER" ? (
            <>
              <Link
                to="/banker"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive("/banker") ? "bg-amber-500 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-amber-800"
                }`}
              >
                Banker Portal
              </Link>
              <Link
                to="/security-events"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive("/security-events") ? "bg-amber-500 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-amber-800"
                }`}
              >
                Security Events
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/manager"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive("/manager") ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-emerald-900"
                }`}
              >
                Manager Portal
              </Link>
              <Link
                to="/security-events"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive("/security-events") ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-slate-600 hover:text-emerald-900"
                }`}
              >
                Firewall Logs
              </Link>
            </>
          )}
        </div>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications Link with badge */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-teal-900 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-teal-100 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 leading-none">{user.fullName}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5 font-medium">{user.role}</p>
                </div>
              </div>

              {/* Logout button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-rose-600 border-teal-100"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl glass-panel p-4 flex flex-col gap-2">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Dashboard
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Features
              </a>
              <Link
                to="/security-events"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                AI Firewall
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Dashboard
              </Link>
              <Link
                to="/transfer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Transfer Funds
              </Link>
              <Link
                to="/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Transactions
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                AI Assistant
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
              >
                Notifications ({unreadNotifications})
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
