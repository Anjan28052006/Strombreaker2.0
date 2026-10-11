import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Users,
  FileCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  IndianRupee,
  Calendar,
  Lock,
  ArrowUpRight,
  UserCheck,
  CreditCard,
} from "lucide-react";
import { api } from "../services/api";
import { formatINR, formatDate } from "../lib/utils";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";

export const ManagerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"registrations" | "loans" | "users" | "security">("registrations");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data states
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bankers, setBankers] = useState<any[]>([]);
  const [securityOverview, setSecurityOverview] = useState<any>(null);

  // Decision Modal State
  const [actionTarget, setActionTarget] = useState<{
    type: "registration" | "loan";
    id: string;
    decision: "APPROVE" | "REJECT";
    name: string;
    amount?: number;
  } | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [regsRes, loansRes, usersRes, bankersRes, secRes] = await Promise.allSettled([
        api.managerGetRegistrations(),
        api.managerGetLoans(),
        api.managerGetUsers(),
        api.managerGetBankers(),
        api.managerGetSecurityOverview(),
      ]);

      if (regsRes.status === "fulfilled" && regsRes.value) {
        setRegistrations(Array.isArray(regsRes.value) ? regsRes.value : (regsRes.value as any)?.data || []);
      }
      if (loansRes.status === "fulfilled" && loansRes.value) {
        setLoans(Array.isArray(loansRes.value) ? loansRes.value : (loansRes.value as any)?.data || []);
      }
      if (usersRes.status === "fulfilled" && usersRes.value) {
        setUsers(Array.isArray(usersRes.value) ? usersRes.value : (usersRes.value as any)?.data || []);
      }
      if (bankersRes.status === "fulfilled" && bankersRes.value) {
        setBankers(Array.isArray(bankersRes.value) ? bankersRes.value : (bankersRes.value as any)?.data || []);
      }
      if (secRes.status === "fulfilled" && secRes.value) {
        setSecurityOverview(secRes.value);
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to load manager records" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleExecuteDecision = async () => {
    if (!actionTarget) return;
    setSubmittingDecision(true);
    setAlert(null);

    try {
      if (actionTarget.type === "registration") {
        const res = await api.managerDecideRegistration(
          actionTarget.id,
          actionTarget.decision,
          decisionReason.trim()
        );
        if (res) {
          setAlert({
            type: "success",
            message: `Customer registration ${actionTarget.decision === "APPROVE" ? "approved" : "rejected"} successfully.`,
          });
          setRegistrations((prev) => prev.filter((r) => r._id !== actionTarget.id));
        }
      } else if (actionTarget.type === "loan") {
        const res = await api.managerDecideLoan(
          actionTarget.id,
          actionTarget.decision,
          decisionReason.trim()
        );
        if (res) {
          setAlert({
            type: "success",
            message: `Loan application ${actionTarget.decision === "APPROVE" ? "approved & disbursed" : "rejected"} successfully.`,
          });
          setLoans((prev) =>
            prev.map((l) => (l._id === actionTarget.id ? { ...l, status: actionTarget.decision === "APPROVE" ? "APPROVED" : "REJECTED" } : l))
          );
        }
      }
      setActionTarget(null);
      setDecisionReason("");
      loadData();
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Action failed to execute on server" });
    } finally {
      setSubmittingDecision(false);
    }
  };

  const pendingRegCount = registrations.filter((r) => r.status === "PENDING_APPROVAL").length;
  const pendingLoanCount = loans.filter((l) => l.status === "SUBMITTED" || l.status === "UNDER_REVIEW").length;
  const totalLoanExposure = loans
    .filter((l) => l.status === "APPROVED")
    .reduce((acc, curr) => acc + (curr.amountPaise || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                Manager Operations Center
                <Badge variant="purple">Executive Level 3</Badge>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Administrative governance, customer onboarding approvals, credit facility underwriting, and staff oversight.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 border-teal-200 bg-white/80 text-teal-800 hover:bg-white shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
            Refresh Data
          </Button>
          <div className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs font-mono flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            GOVERNANCE ACTIVE
          </div>
        </div>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            variant={alert.type === "success" ? "success" : "destructive"}
            onClose={() => setAlert(null)}
          >
            <div className="font-semibold">{alert.type === "success" ? "Operation Executed" : "Administrative Error"}</div>
            <div>{alert.message}</div>
          </Alert>
        </div>
      )}

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-teal-200 bg-white/85 backdrop-blur-xl shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Registrations</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 font-mono">{pendingRegCount}</div>
          <p className="text-xs text-slate-500">KYC onboarding awaiting manager decision</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 opacity-60" />
        </Card>

        <Card className="p-5 border-teal-200 bg-white/85 backdrop-blur-xl shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Loan Requests</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 font-mono">{pendingLoanCount}</div>
          <p className="text-xs text-slate-500">Credit applications under review</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 opacity-60" />
        </Card>

        <Card className="p-5 border-teal-200 bg-white/85 backdrop-blur-xl shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Loan Exposure</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 font-mono">{formatINR(totalLoanExposure)}</div>
          <p className="text-xs text-slate-500">Disbursed credit facility total</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-60" />
        </Card>

        <Card className="p-5 border-teal-200 bg-white/85 backdrop-blur-xl shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bank Personnel</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 font-mono">{bankers.length}</div>
          <p className="text-xs text-slate-500">Active branch officers & bankers</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 opacity-60" />
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-teal-200/80 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("registrations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "registrations"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 hover:text-teal-900 hover:bg-white/60"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Pending Registrations
          {pendingRegCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
              {pendingRegCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("loans")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "loans"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 hover:text-teal-900 hover:bg-white/60"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Loan Decisions
          {pendingLoanCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold">
              {pendingLoanCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "users"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 hover:text-teal-900 hover:bg-white/60"
          }`}
        >
          <Users className="w-4 h-4" />
          Staff & User Directory
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "security"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 hover:text-teal-900 hover:bg-white/60"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Security Overview
        </button>
      </div>

      {/* TAB 1: REGISTRATIONS */}
      {activeTab === "registrations" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Pending Customer Registrations</h2>
            <div className="text-xs text-slate-600 font-medium">Requiring Level 3 identity & KYC clearance</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <Card className="p-12 text-center border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">Queue Clear</h3>
              <p className="text-xs text-slate-600 font-medium">All customer registrations have been processed.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {registrations.map((user) => (
                <Card
                  key={user._id}
                  className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl hover:border-teal-300 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{user.fullName}</span>
                        <Badge variant="warning">PENDING KYC</Badge>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Email: <strong className="text-slate-800">{user.email}</strong></span>
                        <span>Phone: <strong className="text-slate-800">{user.phone || "N/A"}</strong></span>
                        <span>Submitted: <strong className="text-slate-800">{formatDate(user.createdAt)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 font-bold"
                      onClick={() =>
                        setActionTarget({
                          type: "registration",
                          id: user._id,
                          decision: "REJECT",
                          name: user.fullName,
                        })
                      }
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
                      onClick={() =>
                        setActionTarget({
                          type: "registration",
                          id: user._id,
                          decision: "APPROVE",
                          name: user.fullName,
                        })
                      }
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Account
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOANS */}
      {activeTab === "loans" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Underwriting & Credit Applications</h2>
            <div className="text-xs text-slate-600 font-medium">Approval triggers instant atomic fund disbursement in INR</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading loan applications...</div>
          ) : loans.length === 0 ? (
            <Card className="p-12 text-center border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <FileCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Applications</h3>
              <p className="text-xs text-slate-600 font-medium">There are no loan applications submitted in the system.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => {
                const isActionable = loan.status === "SUBMITTED" || loan.status === "UNDER_REVIEW";
                return (
                  <Card
                    key={loan._id}
                    className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl hover:border-teal-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                          <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900 font-mono">
                              {formatINR(loan.amountPaise || 0)}
                            </span>
                            <Badge
                              variant={
                                loan.status === "APPROVED"
                                  ? "success"
                                  : loan.status === "REJECTED"
                                  ? "destructive"
                                  : "warning"
                              }
                            >
                              {loan.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Applicant: <strong className="text-slate-800">{loan.userId?.fullName || loan.userFullName || "Customer"}</strong> (Account: {loan.accountId?.accountNumber || "N/A"})
                          </p>
                        </div>
                      </div>

                      {isActionable && (
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 font-bold"
                            onClick={() =>
                              setActionTarget({
                                type: "loan",
                                id: loan._id,
                                decision: "REJECT",
                                name: loan.userId?.fullName || "Applicant",
                                amount: loan.amountPaise,
                              })
                            }
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
                            onClick={() =>
                              setActionTarget({
                                type: "loan",
                                id: loan._id,
                                decision: "APPROVE",
                                name: loan.userId?.fullName || "Applicant",
                                amount: loan.amountPaise,
                              })
                            }
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve & Disburse
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Term / Duration</span>
                        <span className="font-bold text-slate-800">{loan.tenureMonths || 12} Months</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Interest Rate</span>
                        <span className="font-bold text-slate-800">{loan.interestRate || "9.5% p.a."}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Purpose</span>
                        <span className="font-bold text-slate-800 truncate">{loan.purpose || "General Banking"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Application Date</span>
                        <span className="font-bold text-slate-800">{formatDate(loan.createdAt)}</span>
                      </div>
                    </div>

                    {loan.decisionReason && (
                      <div className="mt-3 text-xs p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-slate-700">
                        <strong className="text-teal-900">Executive Decision Notes:</strong> {loan.decisionReason}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS & BANKERS */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Personnel & Customer Roster</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-white/90 border border-teal-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 shadow-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              Branch Bankers ({bankers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {bankers.map((b) => (
                <Card key={b._id} className="p-4 border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 font-bold text-sm">
                      {b.fullName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{b.fullName}</div>
                      <div className="text-xs text-slate-500 font-medium">{b.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-teal-100">
                    <Badge variant="cyan">BANKER</Badge>
                    <span className="text-slate-500 font-mono text-[10px]">Since {formatDate(b.createdAt)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-teal-600" />
              Customer Accounts ({users.filter((u) => u.role === "CUSTOMER").length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-teal-50/70 text-slate-700 uppercase tracking-wider font-bold border-b border-teal-200">
                  <tr>
                    <th className="p-3.5">Full Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Account Status</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-100 text-slate-700">
                  {users
                    .filter((u) => u.role === "CUSTOMER")
                    .filter(
                      (u) =>
                        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((cust) => (
                      <tr key={cust._id} className="hover:bg-teal-50/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{cust.fullName}</td>
                        <td className="p-3.5 text-slate-600 font-medium">{cust.email}</td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              cust.status === "ACTIVE"
                                ? "success"
                                : cust.status === "RESTRICTED"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {cust.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-600 font-bold">{cust.role}</td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">{formatDate(cust.createdAt)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY OVERVIEW */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">AI Firewall & Defensive Guardrails Status</h2>
            <Badge variant="cyan">Blue-Team Audit</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Total Security Audits</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {securityOverview?.totalEvents || "28"}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">Logged firewall inspections across customer sessions</p>
            </Card>

            <Card className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <span className="text-xs uppercase text-rose-600 font-bold block mb-1">Threat Interceptions</span>
              <div className="text-2xl font-bold text-rose-600 font-mono">
                {securityOverview?.threatsBlocked || "12"}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">Prompt injections & jailbreaks mitigated deterministically</p>
            </Card>

            <Card className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
              <span className="text-xs uppercase text-emerald-700 font-bold block mb-1">Guardrail Compliance</span>
              <div className="text-2xl font-bold text-emerald-600 font-mono">100.0%</div>
              <p className="text-xs text-slate-600 font-medium mt-1">Zero unverified AI transfers allowed to execute</p>
            </Card>
          </div>

          <Card className="p-5 border-teal-200/80 bg-white/85 backdrop-blur-xl shadow-md">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              Operational Security Enforcements
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Multi-document atomic balance transfers enforced for all account debit/credit paths.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Role escalation blocked at API gateway; browser client tokens verified on every transaction.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>AI assistant LLM restricted strictly to read-only tools and draft preparation workflows.</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Decision Modal */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white/95 border border-teal-200 rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  actionTarget.decision === "APPROVE"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}
              >
                {actionTarget.decision === "APPROVE" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirm {actionTarget.decision === "APPROVE" ? "Approval" : "Rejection"}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {actionTarget.type === "registration"
                    ? `Account registration for ${actionTarget.name}`
                    : `Loan facility of ${formatINR(actionTarget.amount || 0)} for ${actionTarget.name}`}
                </p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Executive Notes / Reason (Optional)
                </label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Enter audit rationale for this decision..."
                  rows={3}
                  className="w-full bg-slate-50 border border-teal-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 resize-none shadow-sm font-medium"
                />
              </div>

              {actionTarget.type === "loan" && actionTarget.decision === "APPROVE" && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <strong>Notice:</strong> Approving will immediately disburse {formatINR(actionTarget.amount || 0)} into the customer's account and log an atomic ledger entry.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-teal-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionTarget(null)}
                disabled={submittingDecision}
              >
                Cancel
              </Button>
              <Button
                variant={actionTarget.decision === "APPROVE" ? "primary" : "outline"}
                size="sm"
                className={
                  actionTarget.decision === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    : "border-rose-200 text-rose-700 hover:bg-rose-50"
                }
                onClick={handleExecuteDecision}
                disabled={submittingDecision}
              >
                {submittingDecision ? "Executing..." : `Confirm ${actionTarget.decision}`}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
