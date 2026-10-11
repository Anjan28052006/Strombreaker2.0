import React from "react";
import { X, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatINR, formatDate } from "../lib/utils";
import { Button } from "./ui/Button";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    reference: string;
    amount: number;
    recipientAccountNumber: string;
    senderAccountNumber?: string;
    confirmedAt: string;
    memo?: string;
    status: string;
  } | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl p-6 border border-teal-200 text-slate-800 shadow-2xl flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Transaction Receipt</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">STROMBREAKER 2.0 SECURE TRANSACTION V1</p>
        </div>

        {/* Amount Hero */}
        <div className="text-center py-4 bg-teal-50/60 rounded-xl border border-teal-100">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">TOTAL TRANSFERRED</p>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono">
            {formatINR(transaction.amount)}
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-teal-100">
            <span className="text-slate-500 font-medium">Reference Number</span>
            <span className="font-mono text-slate-900 font-bold">{transaction.reference}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-teal-100">
            <span className="text-slate-500 font-medium">Recipient Account</span>
            <span className="font-mono text-slate-900 font-semibold">{transaction.recipientAccountNumber}</span>
          </div>
          {transaction.senderAccountNumber && (
            <div className="flex justify-between py-1 border-b border-teal-100">
              <span className="text-slate-500 font-medium">Sender Account</span>
              <span className="font-mono text-slate-900 font-semibold">{transaction.senderAccountNumber}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-b border-teal-100">
            <span className="text-slate-500 font-medium">Transaction Status</span>
            <span className="text-emerald-600 font-bold">{transaction.status}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-teal-100">
            <span className="text-slate-500 font-medium">Timestamp</span>
            <span className="text-slate-700 font-medium">{formatDate(transaction.confirmedAt)}</span>
          </div>
          {transaction.memo && (
            <div className="flex justify-between py-1 border-b border-teal-100">
              <span className="text-slate-500 font-medium">Memo</span>
              <span className="text-slate-700 italic">{transaction.memo}</span>
            </div>
          )}
        </div>

        {/* Security watermark footer */}
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-[11px] text-teal-800 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600" />
          <span>Verified & Persisted by Strombreaker 2.0 Blue-Team Firewall Engine</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button variant="emerald" onClick={handlePrint} className="flex-1">
            <Download className="w-4 h-4 mr-1.5" />
            Print / Save
          </Button>
        </div>
      </div>
    </div>
  );
};
