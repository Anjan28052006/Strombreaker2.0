import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  IndianRupee,
  FileText,
  AlertCircle,
  Users,
} from "lucide-react";

export const TransferPage: React.FC = () => {
  const navigate = useNavigate();
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePrepareTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount greater than ₹0");
      return;
    }

    if (!recipientAccountNumber.trim()) {
      setErrorMessage("Recipient account number is required");
      return;
    }

    setIsLoading(true);

    try {
      const prepared = await api.prepareTransfer({
        recipientAccountNumber: recipientAccountNumber.trim(),
        amount: parsedAmount,
        memo: memo.trim(),
      });

      // Navigate to explicit confirmation screen with verified details
      navigate("/transfer/confirm", { state: { preparedData: prepared } });
    } catch (err: any) {
      setErrorMessage(err.message || "Transfer preparation failed. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickContact = (acc: string) => {
    setRecipientAccountNumber(acc);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 text-slate-800 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono uppercase tracking-wider mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            2-Phase Safe Transfer Lifecycle
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Send Secure Transfer</h1>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Step 1 of 2: Enter transaction parameters. The server validates the counterparty and issues a short-lived confirmation token. No funds move until explicit confirmation.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold">Transfer Validation Notice: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Transfer Form Card */}
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl p-6 sm:p-8 border border-teal-200 shadow-xl space-y-6">
          {/* Quick Contacts Bar */}
          <div>
            <label className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-600 block mb-2">
              Frequent Beneficiaries
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickContact("409110002002")}
                className="p-3 rounded-xl bg-teal-50/70 hover:bg-teal-100 border border-teal-200 text-left transition-all"
              >
                <div className="font-semibold text-slate-900">Bob Smith</div>
                <div className="text-[11px] text-teal-700 font-mono mt-0.5">409110002002</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickContact("409110002001")}
                className="p-3 rounded-xl bg-teal-50/70 hover:bg-teal-100 border border-teal-200 text-left transition-all"
              >
                <div className="font-semibold text-slate-900">Alice Johnson</div>
                <div className="text-[11px] text-teal-700 font-mono mt-0.5">409110002001</div>
              </button>
            </div>
          </div>

          <form onSubmit={handlePrepareTransfer} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Recipient Account Number (12 digits) *
              </label>
              <Input
                type="text"
                required
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                placeholder="e.g. 409110002002"
                icon={<CreditCard className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Amount in Rupees (₹) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="1"
                max="500000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500.00"
                icon={<IndianRupee className="w-4 h-4" />}
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Calculated strictly in integer paise. Maximum single transaction: ₹500,000.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transfer Memo / Description (Optional)
              </label>
              <Input
                type="text"
                maxLength={250}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="e.g. Shared expenses for groceries"
                icon={<FileText className="w-4 h-4" />}
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Memos are sanitized against injection attacks by the AI Firewall.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4 font-bold shadow-lg shadow-teal-600/20"
            >
              Verify Recipient & Prepare Transfer
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};
