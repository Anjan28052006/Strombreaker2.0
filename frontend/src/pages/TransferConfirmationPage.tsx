import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { formatINR, formatDate } from "../lib/utils";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ReceiptModal } from "../components/ReceiptModal";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  Download,
  Receipt,
  RotateCcw,
  Home,
} from "lucide-react";

export const TransferConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const preparedData = (location.state as any)?.preparedData;

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedResult, setConfirmedResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);

  // If user navigates directly without prepared transfer, redirect back
  useEffect(() => {
    if (!preparedData && !confirmedResult) {
      navigate("/transfer", { replace: true });
    }
  }, [preparedData, confirmedResult, navigate]);

  // Confetti and count-up animation on confirmed success
  useEffect(() => {
    if (confirmedResult) {
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#20C96B", "#00D2FF", "#ffffff"],
      });

      // Animate amount counter
      let start = 0;
      const target = confirmedResult.amount;
      const duration = 1000;
      const stepTime = 20;
      const step = target / (duration / stepTime);

      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setDisplayAmount(target);
          clearInterval(timer);
        } else {
          setDisplayAmount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [confirmedResult]);

  const handleConfirm = async () => {
    if (!preparedData) return;
    setIsConfirming(true);
    setErrorMessage(null);

    try {
      const result = await api.confirmTransfer({
        transactionId: preparedData.transactionId,
        confirmationToken: preparedData.confirmationToken,
      });

      setConfirmedResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Transfer confirmation failed.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCopyId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!preparedData && !confirmedResult) return null;

  return (
    <div className="flex-1 text-slate-800 flex flex-col selection:bg-teal-500/20 selection:text-slate-900">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        {/* ============================================================ */}
        {/* STATE A: CONFIRMED SUCCESS EXPERIENCE (from transfer-confirmation.md) */}
        {/* ============================================================ */}
        {confirmedResult ? (
          <div className="w-full text-center flex flex-col items-center">
            {/* Stage 2: Success Icon Emblem with SVG checkmark path draw */}
            <div className="relative mb-6">
              {/* Radial glow */}
              <div className="absolute inset-0 rounded-full bg-[#20C96B]/30 blur-2xl scale-150 pointer-events-none" />

              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-24 h-24 rounded-full bg-[#20C96B] flex items-center justify-center shadow-2xl shadow-[#20C96B]/40"
              >
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Stage 3: Confirmation Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2"
            >
              Payment Successful
            </motion.h2>

            {/* Stage 4: Animated Payment Amount in Emerald Green */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl font-extrabold text-teal-700 font-mono tracking-tight my-2"
            >
              {formatINR(displayAmount)}
            </motion.div>

            {/* Stage 5: Supporting Confirmation Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-slate-600 mb-8"
            >
              Your transaction has been processed and confirmed by the ledger.
            </motion.p>

            {/* Stage 6: Payment Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full rounded-2xl bg-white/90 border border-teal-200 p-6 text-left space-y-3.5 mb-8 text-xs shadow-xl text-slate-800"
            >
              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Transaction Status</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Successful
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Transaction Reference</span>
                <div className="flex items-center gap-1 font-mono text-slate-900 font-medium">
                  <span>{confirmedResult.reference}</span>
                  <button
                    onClick={() => handleCopyId(confirmedResult.reference)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Copy Reference"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Recipient Account</span>
                <span className="font-mono text-slate-900 font-medium">
                  {confirmedResult.recipientAccountNumber}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Timestamp</span>
                <span className="text-slate-700 font-mono">
                  {formatDate(confirmedResult.confirmedAt)}
                </span>
              </div>

              {confirmedResult.memo && (
                <div className="flex justify-between items-center py-1 border-b border-teal-100">
                  <span className="text-slate-500">Memo</span>
                  <span className="text-slate-800 italic">"{confirmedResult.memo}"</span>
                </div>
              )}
            </motion.div>

            {/* Stage 7: Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 w-full"
            >
              <Link to="/transactions" className="flex-1">
                <Button variant="primary" size="lg" className="w-full font-bold shadow-lg shadow-teal-600/20">
                  View Transactions
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowReceipt(true)}
                className="flex-1 border-teal-300 text-teal-800 hover:bg-teal-50"
              >
                <Download className="w-4 h-4 mr-2 text-teal-600" />
                Download Receipt
              </Button>
              <Link to="/dashboard" className="sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        ) : (
          /* ============================================================ */
          /* STATE B: PREPARED TRANSFER REVIEW & CONFIRMATION SCREEN */
          /* ============================================================ */
          <div className="w-full rounded-3xl bg-white/85 backdrop-blur-2xl p-8 sm:p-10 border border-teal-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto mb-3 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Review & Confirm Payment</h2>
              <p className="text-xs text-slate-600 mt-1">
                Please verify counterparty details before executing this transfer.
              </p>
            </div>

            {/* Expiration Token Timer */}
            <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-600" />
                Confirmation Token Valid For:
              </span>
              <span className="font-bold text-amber-900">15 Minutes</span>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Verified Details Sheet */}
            <div className="rounded-2xl bg-teal-50/60 border border-teal-100 p-6 space-y-4 text-xs mb-8">
              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Verified Recipient</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {preparedData.recipientDisplayName}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono text-slate-800 font-medium">
                  {preparedData.maskedRecipientAccountNumber}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Transfer Amount</span>
                <span className="font-mono text-xl font-extrabold text-teal-700">
                  {formatINR(preparedData.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-teal-100">
                <span className="text-slate-500">Transaction Reference</span>
                <span className="font-mono text-slate-700">
                  {preparedData.reference}
                </span>
              </div>

              {preparedData.memo && (
                <div className="flex justify-between items-center py-1 border-b border-teal-100">
                  <span className="text-slate-500">Memo</span>
                  <span className="text-slate-800 italic">"{preparedData.memo}"</span>
                </div>
              )}
            </div>

            {/* Confirmation & Cancel Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/transfer")}
                disabled={isConfirming}
                className="flex-1"
              >
                Back / Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                isLoading={isConfirming}
                onClick={handleConfirm}
                className="flex-1 font-bold shadow-lg shadow-teal-600/20"
              >
                Authorize & Confirm Payment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={confirmedResult}
      />
    </div>
  );
};
