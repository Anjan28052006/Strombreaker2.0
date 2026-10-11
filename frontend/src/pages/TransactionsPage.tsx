import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { formatINR, formatDate } from "../lib/utils";
import { Transaction } from "../types";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ReceiptModal } from "../components/ReceiptModal";
import { Button } from "../components/ui/Button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Receipt,
  Copy,
  Check,
  Calendar,
  CreditCard,
  History,
} from "lucide-react";

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | "INCOMING" | "OUTGOING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const typeParam = filterType === "ALL" ? undefined : filterType;
        const res = await api.getMyTransactions({ page: 1, limit: 50, type: typeParam });
        setTransactions(res.transactions || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [filterType]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.reference.toLowerCase().includes(q) ||
        tx.counterpartyAccountNumber.toLowerCase().includes(q) ||
        (tx.memo && tx.memo.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  // Aggregate stats from actual transaction history
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    transactions.forEach((tx) => {
      if (tx.status === "COMPLETED") {
        if (tx.type === "INCOMING") inflow += tx.amountRupees;
        else outflow += tx.amountRupees;
      }
    });
    return { inflow, outflow, net: inflow - outflow };
  }, [transactions]);

  const handleCopy = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 text-slate-800 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-teal-200/60">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transactions</h1>
            <p className="text-xs text-slate-600 mt-1">
              Track your payments, incoming funds, and verified banking activity.
            </p>
          </div>
          <Link to="/transfer">
            <Button variant="primary" size="md">
              <ArrowUpRight className="w-4 h-4 mr-1.5" />
              Make New Transfer
            </Button>
          </Link>
        </div>

        {/* 3. Transaction Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-md">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Received</span>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">
              +{formatINR(stats.inflow)}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-md">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Sent</span>
            <p className="text-2xl font-bold font-mono text-rose-600 mt-2">
              -{formatINR(stats.outflow)}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-md">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Net Activity</span>
            <p className={`text-2xl font-bold font-mono mt-2 ${stats.net >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
              {stats.net >= 0 ? "+" : ""}{formatINR(stats.net)}
            </p>
          </div>
        </div>

        {/* 4. Controls: Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-teal-50 border border-teal-200 w-full sm:w-auto">
            {(["ALL", "INCOMING", "OUTGOING"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  filterType === tab
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, account, memo..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-teal-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-400/20 shadow-sm"
            />
          </div>
        </div>

        {/* 5. Transaction History List */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-teal-200 shadow-md overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading verified transaction records...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-10 h-10 text-teal-300 mx-auto mb-3" />
              <p className="text-sm text-slate-700 font-semibold">No transactions found</p>
              <p className="text-xs text-slate-500 mt-1">There are no records matching your current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-teal-100">
              {filteredTransactions.map((tx) => {
                const isOutgoing = tx.type === "OUTGOING";
                return (
                  <div
                    key={tx.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-teal-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isOutgoing ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}>
                        {isOutgoing ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {isOutgoing ? "Payment to " : "Deposit from "}
                            <span className="font-mono text-slate-700">{tx.counterpartyAccountNumber}</span>
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            tx.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                            tx.status === "FAILED" ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {tx.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{formatDate(tx.createdAt)}</span>
                          <span className="font-mono text-[11px] text-slate-600 flex items-center gap-1">
                            Ref: {tx.reference}
                            <button
                              onClick={() => handleCopy(tx.reference)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy reference"
                            >
                              {copiedId === tx.reference ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </span>
                          {tx.memo && <span className="italic text-slate-600">"{tx.memo}"</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span className={`text-base font-extrabold font-mono ${
                        isOutgoing ? "text-rose-600" : "text-emerald-700"
                      }`}>
                        {isOutgoing ? "-" : "+"}
                        {formatINR(tx.amountRupees)}
                      </span>

                      <button
                        onClick={() => {
                          setSelectedTx({
                            reference: tx.reference,
                            amount: tx.amountRupees,
                            recipientAccountNumber: isOutgoing ? tx.counterpartyAccountNumber : "Self Account",
                            confirmedAt: tx.createdAt,
                            memo: tx.memo,
                            status: tx.status,
                          });
                          setShowReceipt(true);
                        }}
                        className="text-[11px] text-slate-500 hover:text-teal-800 flex items-center gap-1 transition-colors font-medium"
                      >
                        <Receipt className="w-3.5 h-3.5 text-teal-600" />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={selectedTx}
      />
    </div>
  );
};
