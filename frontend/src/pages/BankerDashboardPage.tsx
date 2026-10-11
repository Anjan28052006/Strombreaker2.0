import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { formatINR, formatDate } from "../lib/utils";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/Table";
import {
  Users,
  Search,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
} from "lucide-react";

export const BankerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"CUSTOMERS" | "OPERATIONAL" | "SECURITY">("OPERATIONAL");

  // Customers state
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Operational requests state
  const [opRequests, setOpRequests] = useState<any[]>([]);
  const [loadingOps, setLoadingOps] = useState(false);

  // Action modals
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [warningReason, setWarningReason] = useState("");
  const [restrictionReason, setRestrictionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadOperationalRequests = async () => {
    setLoadingOps(true);
    try {
      const res = await api.bankerGetOperationalRequests();
      setOpRequests(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOps(false);
    }
  };

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await api.bankerGetCustomers(1, 30, customerSearch);
      setCustomers(res.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadOperationalRequests();
    loadCustomers();
  }, []);

  const handleDecideOpRequest = async (requestId: string, decision: "APPROVE" | "REJECT") => {
    const reason = window.prompt(`Enter decision reason for ${decision}:`) || "";
    try {
      await api.bankerDecideOperationalRequest(requestId, decision, reason);
      loadOperationalRequests();
      loadCustomers();
    } catch (err: any) {
      alert(`Decision failed: ${err.message}`);
    }
  };

  const handleIssueWarning = async (customerId: string) => {
    if (!warningReason.trim()) return;
    setActionLoading(true);
    try {
      await api.bankerIssueWarning(customerId, warningReason);
      setWarningReason("");
      setSelectedCustomer(null);
      loadCustomers();
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetRestriction = async (customerId: string, restriction: string) => {
    const reason = window.prompt(`Reason for updating account to ${restriction}:`) || "Banker operational decision";
    try {
      await api.bankerSetRestriction(customerId, restriction, reason);
      loadCustomers();
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 text-slate-800 flex flex-col selection:bg-amber-500/20 selection:text-slate-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono uppercase tracking-wider mb-2 shadow-sm font-semibold">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              Banker Operational Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bank Operations Dashboard</h1>
            <p className="text-xs text-slate-600 mt-1">
              Review cash deposits, authorizations, issue warnings, and inspect flagged customer profiles.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm">
            <button
              onClick={() => setActiveTab("OPERATIONAL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "OPERATIONAL"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Operational Requests ({opRequests.filter((r) => r.status === "PENDING").length})
            </button>
            <button
              onClick={() => setActiveTab("CUSTOMERS")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "CUSTOMERS"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Customer Accounts ({customers.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Operational Requests */}
        {activeTab === "OPERATIONAL" && (
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending Deposits & Withdrawals</h2>
              <p className="text-xs text-slate-600">
                Banker review is required before customer balances update on the core ledger.
              </p>
            </div>

            {loadingOps ? (
              <div className="text-center py-12 text-xs text-slate-500">Loading operational requests...</div>
            ) : opRequests.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No operational requests found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opRequests.map((req) => (
                    <TableRow key={req._id || req.id}>
                      <TableCell className="font-mono text-xs text-slate-900 font-semibold">
                        {req.reference}
                      </TableCell>
                      <TableCell className="text-xs">
                        <p className="text-slate-900 font-semibold">{req.userId?.fullName || "Customer"}</p>
                        <p className="text-[11px] text-slate-500">{req.userId?.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={req.type === "DEPOSIT" ? "success" : "amber"}>
                          {req.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-bold text-slate-900">
                        {formatINR(req.amountPaise / 100)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 italic">
                        "{req.notes || "No notes"}"
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.status === "APPROVED"
                              ? "success"
                              : req.status === "REJECTED"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {req.status === "PENDING" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="emerald"
                              size="sm"
                              onClick={() => handleDecideOpRequest(req._id || req.id, "APPROVE")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDecideOpRequest(req._id || req.id, "REJECT")}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Decided</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Tab 2: Customer Accounts & Controls */}
        {activeTab === "CUSTOMERS" && (
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Customer Account Roster</h2>
                <p className="text-xs text-slate-600">
                  Lookup accounts, inspect malicious flags, issue formal warnings, and apply restrictions.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadCustomers()}
                  placeholder="Search customer name..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-teal-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                />
              </div>
            </div>

            {loadingCustomers ? (
              <div className="text-center py-12 text-xs text-slate-500">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No customers found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security Flags</TableHead>
                    <TableHead>Banker Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs">
                        <p className="font-semibold text-slate-900">{c.fullName}</p>
                        <p className="text-[11px] text-slate-500">{c.email}</p>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-800">
                        {c.accountNumber || "Pending Setup"}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-bold text-emerald-700">
                        {formatINR(c.balanceRupees || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            c.accountStatus === "ACTIVE"
                              ? "success"
                              : c.accountStatus === "FROZEN"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {c.accountStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <span className={c.maliciousAttemptCount > 3 ? "text-rose-600 font-bold" : "text-slate-500"}>
                          Attempts: {c.maliciousAttemptCount || 0}
                        </span>
                        <span className="text-amber-700 font-semibold ml-2">Warnings: {c.warningCount || 0}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-semibold shadow-sm"
                          >
                            Warn
                          </button>
                          {c.accountStatus === "ACTIVE" ? (
                            <button
                              onClick={() => handleSetRestriction(c.id, "FROZEN")}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold shadow-sm"
                            >
                              Freeze
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSetRestriction(c.id, "ACTIVE")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold shadow-sm"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Warning Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl border border-teal-200 p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">
                Issue Warning to {selectedCustomer.fullName}
              </h3>
              <p className="text-xs text-slate-600">
                This will increment their warning count, alert the customer, and log an audit record.
              </p>
              <textarea
                rows={3}
                value={warningReason}
                onChange={(e) => setWarningReason(e.target.value)}
                placeholder="Reason for warning..."
                className="w-full p-3 rounded-xl bg-white border border-teal-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedCustomer(null)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="amber"
                  onClick={() => handleIssueWarning(selectedCustomer.id)}
                  isLoading={actionLoading}
                  className="flex-1 shadow-md shadow-amber-600/20"
                >
                  Send Warning
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
