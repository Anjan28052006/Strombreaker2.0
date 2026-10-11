import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await api.login({ email, password });
      login(res.token, res.user);

      // Role-aware redirect
      if (res.user.role === "BANKER") {
        navigate("/banker");
      } else if (res.user.role === "MANAGER") {
        navigate("/manager");
      } else {
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick autofill buttons for evaluation
  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Bankism@1234");
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent flex items-center justify-center p-4">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-200/30 blur-[140px]" />
      </div>

      {/* Central Glass Login Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white/85 backdrop-blur-2xl p-8 sm:p-10 border border-teal-200/80 shadow-2xl shadow-teal-900/10">
        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-3 shadow-md shadow-teal-500/10">
            <Shield className="w-7 h-7 fill-teal-500/15" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">Strombreaker 2.0</h2>
          <p className="text-xs text-slate-600 mt-0.5">AI Firewall for Secure Banking</p>
        </div>

        {/* Form Headings */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Welcome Back</h3>
          <p className="text-xs text-slate-600 mt-1">Sign in to your secure banking account.</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Bankism@1234</span>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-bold shadow-lg shadow-teal-600/20"
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Quick Demo Autofill Controls */}
        <div className="mt-6 pt-5 border-t border-teal-100">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider text-center mb-2.5 font-mono font-medium">
            Fast Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials("alice@bankism.com")}
              className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-teal-900 text-[11px] font-mono transition-colors text-left"
            >
              👤 Alice (Customer)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("bob@bankism.com")}
              className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-teal-900 text-[11px] font-mono transition-colors text-left"
            >
              👤 Bob (Customer)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("banker@bankism.com")}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-mono transition-colors text-left"
            >
              🏦 Banker
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("manager@bankism.com")}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-[11px] font-mono transition-colors text-left"
            >
              👔 Manager
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center text-xs text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-700 hover:text-teal-900 hover:underline font-bold">
            Open Account
          </Link>
        </div>
      </div>
    </div>
  );
};
