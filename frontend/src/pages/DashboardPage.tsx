import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { formatINR, formatDate } from "../lib/utils";
import { Transaction } from "../types";
import { Button } from "../components/ui/Button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  CreditCard,
  History,
  Copy,
  Check,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user, login } = useAuth();
  const [balanceData, setBalanceData] = useState<{
    balanceRupees: number;
    balancePaise: number;
    accountNumber: string;
    currency: string;
  } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [operationalRequests, setOperationalRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [switchingUser, setSwitchingUser] = useState(false);

  // Deposit/Withdrawal modal state
  const [showOpModal, setShowOpModal] = useState<"DEPOSIT" | "WITHDRAWAL" | null>(null);
  const [opAmount, setOpAmount] = useState<string>("");
  const [opNotes, setOpNotes] = useState<string>("");
  const [opLoading, setOpLoading] = useState(false);
  const [opFeedback, setOpFeedback] = useState<string | null>(null);

  const loadDashboardData = async () => {
    if (!api.getToken()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [bal, txs, ops] = await Promise.allSettled([
        api.getMyBalance(),
        api.getMyTransactions({ limit: 5 }),
        api.getMyOperationalRequests(),
      ]);
      if (bal.status === "fulfilled" && bal.value) {
        setBalanceData(bal.value);
      }
      if (txs.status === "fulfilled" && txs.value) {
        setRecentTransactions(txs.value.transactions || []);
      }
      if (ops.status === "fulfilled" && ops.value) {
        setOperationalRequests(ops.value || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleQuickLogin = async (email: string) => {
    setSwitchingUser(true);
    try {
      const res = await api.login({ email, password: "Bankism@1234" });
      if (res && res.token && res.user) {
        login(res.token, res.user);
      }
    } catch (err) {
      console.error("Quick login failed:", err);
    } finally {
      setSwitchingUser(false);
    }
  };

  const handleCopyAccount = () => {
    if (balanceData?.accountNumber) {
      navigator.clipboard.writeText(balanceData.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateOperationalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOpModal) return;
    setOpLoading(true);
    setOpFeedback(null);

    try {
      const amt = parseFloat(opAmount);
      if (showOpModal === "DEPOSIT") {
        const res = await api.createDepositRequest({ amount: amt, notes: opNotes });
        setOpFeedback(res.message);
      } else {
        const res = await api.createWithdrawalRequest({ amount: amt, notes: opNotes });
        setOpFeedback(res.message);
      }
      setOpAmount("");
      setOpNotes("");
      loadDashboardData();
      setTimeout(() => setShowOpModal(null), 2500);
    } catch (err: any) {
      setOpFeedback(err.message || "Failed to submit request");
    } finally {
      setOpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user ? `Welcome back, ${user.fullName}` : "Strombreaker 2.0 Banking Operations"}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Account status:{" "}
              <span className="text-teal-700 font-bold font-mono">
                {user?.accountStatus || "ACTIVE (SANDBOX)"}
              </span>{" "}
              • Blue-Team Guardrails Armed
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs text-slate-700 border border-teal-200 font-mono transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-teal-600" : ""}`} />
            Refresh
          </button>
        </div>

        {/* 1-Click Interactive Persona Switcher */}
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-teal-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Live Test Persona Sandbox</p>
              <p className="text-[11px] text-slate-500">
                Click any role to authenticate instantly with real MongoDB ledger records:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => handleQuickLogin("alice@bankism.com")}
              disabled={switchingUser}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                user?.email === "alice@bankism.com"
                  ? "bg-teal-600 text-white font-semibold shadow-sm"
                  : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200"
              }`}
            >
              Alice (₹75,000)
            </button>
            <button
              onClick={() => handleQuickLogin("bob@bankism.com")}
              disabled={switchingUser}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                user?.email === "bob@bankism.com"
                  ? "bg-teal-600 text-white font-semibold shadow-sm"
                  : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200"
              }`}
            >
              Bob (₹30,000)
            </button>
            <button
              onClick={() => handleQuickLogin("banker@bankism.com")}
              disabled={switchingUser}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                user?.email === "banker@bankism.com"
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
              }`}
            >
              Banker
            </button>
            <button
              onClick={() => handleQuickLogin("manager@bankism.com")}
              disabled={switchingUser}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                user?.email === "manager@bankism.com"
                  ? "bg-purple-600 text-white font-semibold shadow-sm"
                  : "bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200"
              }`}
            >
              Manager
            </button>
          </div>
        </div>

        {/* Top Cards: Balance & Primary Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white border border-teal-700/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-400/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-teal-300 font-semibold">
                  TOTAL AVAILABLE BALANCE
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono mt-2 tracking-tight">
                  {isLoading
                    ? "₹••••••"
                    : formatINR(balanceData?.balanceRupees || 0)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-teal-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Account Details & Quick Transfer CTA */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-teal-200" />
                <div>
                  <p className="text-[10px] text-teal-200/80 uppercase tracking-wider">Account Number</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white font-semibold">
                      {balanceData?.accountNumber || "4091 •••• ••••"}
                    </span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-1 text-teal-200 hover:text-white transition-colors"
                      title="Copy account number"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/transfer">
                  <Button variant="primary" size="md">
                    <ArrowUpRight className="w-4 h-4 mr-1.5" />
                    Send Transfer
                  </Button>
                </Link>
                <Link to="/ai-assistant">
                  <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
                    <Sparkles className="w-4 h-4 mr-1.5 text-teal-300" />
                    AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Operations Card */}
          <div className="rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-teal-200 shadow-lg flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Operational Requests</h3>
              <p className="text-xs text-slate-600">
                Submit cash deposits or withdrawals for banker review.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowOpModal("DEPOSIT")}
                className="p-4 rounded-2xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200/80 text-left transition-all group"
              >
                <PlusCircle className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-900">Deposit</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Banker Review</p>
              </button>

              <button
                onClick={() => setShowOpModal("WITHDRAWAL")}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-all group"
              >
                <MinusCircle className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-900">Withdrawal</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Banker Review</p>
              </button>
            </div>

            {/* AI Security Notice */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Transfers require explicit two-phase confirmation tokens issued by the server.</span>
            </div>
          </div>
        </div>

        {/* Operational Requests History (if any) */}
        {operationalRequests.length > 0 && (
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl p-6 border border-teal-200 shadow-lg">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 font-mono">
              Pending & Past Operational Requests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {operationalRequests.map((op) => (
                <div key={op.id} className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{op.type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        op.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" :
                        op.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {op.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">{op.reference}</p>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">{formatINR(op.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions Section */}
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl p-6 sm:p-8 border border-teal-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-600">Authoritative records from your account ledger.</p>
            </div>
            <Link to="/transactions">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading ledger...</p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-teal-50/40 border border-teal-100">
              <History className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-sm text-slate-700 font-medium">No transactions recorded yet</p>
              <p className="text-xs text-slate-500 mt-1">Make your first secure transfer to see it appear here.</p>
              <Link to="/transfer" className="inline-block mt-4">
                <Button variant="primary" size="sm">Start a Transfer</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-teal-100">
              {recentTransactions.map((tx) => {
                const isOutgoing = tx.type === "OUTGOING";
                return (
                  <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isOutgoing ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}>
                        {isOutgoing ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {isOutgoing ? "Sent to " : "Received from "}
                          <span className="font-mono">{tx.counterpartyAccountNumber}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {formatDate(tx.createdAt)} {tx.memo && `• "${tx.memo}"`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono text-sm font-bold ${
                        isOutgoing ? "text-rose-600" : "text-emerald-700"
                      }`}>
                        {isOutgoing ? "-" : "+"}
                        {formatINR(tx.amountRupees)}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Operational Request Modal */}
      {showOpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl p-6 border border-teal-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Request {showOpModal === "DEPOSIT" ? "Cash Deposit" : "Cash Withdrawal"}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Under banking regulations, requests require manual banker review before account balance updates.
            </p>

            {opFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
                {opFeedback}
              </div>
            )}

            <form onSubmit={handleCreateOperationalRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount (in ₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={opAmount}
                  onChange={(e) => setOpAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-11 px-4 rounded-xl bg-white border border-teal-200 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Notes / Reason
                </label>
                <input
                  type="text"
                  value={opNotes}
                  onChange={(e) => setOpNotes(e.target.value)}
                  placeholder="e.g. Cash branch deposit"
                  className="w-full h-11 px-4 rounded-xl bg-white border border-teal-200 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 shadow-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowOpModal(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={opLoading}
                  className="flex-1"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
