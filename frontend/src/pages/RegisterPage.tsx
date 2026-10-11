import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { CreditCardPreview } from "../components/CreditCardPreview";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; user: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.register({ fullName, email, password });
      setIsSuccess(true);
      setSuccessInfo(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-200/30 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left column: Card Preview & Trust Points */}
        <div className="flex flex-col items-center lg:items-start gap-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight font-mono">STROMBREAKER 2.0</span>
          </Link>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Open Your Secure AI Banking Account
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Every customer account is protected with personal guardrail policies, prompt-injection defense, and isolated balance ledgers.
            </p>
          </div>

          {/* Interactive Card Preview */}
          <div className="w-full flex justify-center lg:justify-start">
            <CreditCardPreview
              holderName={fullName.toUpperCase() || "YOUR NAME"}
              accountNumber="4091 •••• •••• 2026"
              expiryDate="05/31"
            />
          </div>

          <div className="space-y-2 text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Full compliance with integer-paise INR ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Two-phase transfer confirmation tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Blue-team AI Firewall threat neutralization</span>
            </div>
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="rounded-3xl bg-white/85 backdrop-blur-2xl p-8 sm:p-10 border border-teal-200/80 shadow-2xl shadow-teal-900/10">
          {isSuccess ? (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 animate-bounce shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mb-6">
                {successInfo?.message || "Your registration application was created. Under Strombreaker 2.0 security policies, new customer registrations are vetted by bank managers before activation."}
              </p>
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-600 text-left w-full mb-6 font-mono space-y-1">
                <p>Status: <span className="text-amber-700 font-semibold">PENDING_APPROVAL</span></p>
                <p>Email: <span className="text-slate-900 font-semibold">{email}</span></p>
                <p>Role: <span className="text-teal-700 font-semibold">CUSTOMER</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link to="/login" className="flex-1">
                  <Button variant="primary" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
                <Link to="/" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Create Customer Profile</h2>
                <p className="text-xs text-slate-600 mt-1">Enter your details to initiate registration.</p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    icon={<User className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password (min. 8 characters)
                  </label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    icon={<Lock className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
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
                  Submit Registration
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-600">
                Already registered?{" "}
                <Link to="/login" className="text-teal-700 hover:text-teal-900 hover:underline font-bold">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
