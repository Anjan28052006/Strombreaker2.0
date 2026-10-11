import React from "react";
import { Shield, Wifi } from "lucide-react";

interface CreditCardPreviewProps {
  holderName?: string;
  accountNumber?: string;
  expiryDate?: string;
  cardType?: string;
}

export const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({
  holderName = "YOUR NAME",
  accountNumber = "4091 •••• •••• 2026",
  expiryDate = "05/30",
  cardType = "SECURE PLATINUM",
}) => {
  return (
    <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 bg-gradient-to-br from-[#1E2235] via-[#111422] to-[#0A0C14] border border-white/15 shadow-2xl overflow-hidden text-white flex flex-col justify-between group hover:border-[#00D2FF]/40 transition-all duration-300">
      {/* Decorative gradient foil rings */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-[#00D2FF]/20 to-purple-500/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-500/15 to-transparent blur-2xl pointer-events-none" />

      {/* Top row: Brand + Wifi */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00D2FF] fill-[#00D2FF]/20" />
          <span className="font-bold text-sm tracking-wider font-mono">STROMBREAKER 2.0</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Wifi className="w-4 h-4 rotate-90" />
          <span className="text-[10px] font-mono tracking-widest text-[#00D2FF] uppercase">{cardType}</span>
        </div>
      </div>

      {/* Middle row: EMV Chip + Hologram */}
      <div className="relative z-10 flex items-center gap-3 my-auto">
        <div className="w-10 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-400/50 shadow-inner flex items-center justify-center">
          <div className="w-7 h-5 border border-black/20 rounded-sm opacity-60" />
        </div>
      </div>

      {/* Bottom row: Card Number, Holder, Expiry */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="font-mono text-lg sm:text-xl tracking-[0.18em] font-medium text-white/95 text-shadow">
          {accountNumber}
        </div>
        <div className="flex items-end justify-between text-xs">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-neutral-400">CARDHOLDER</p>
            <p className="font-semibold uppercase tracking-wide text-neutral-100 font-mono">
              {holderName || "YOUR NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-neutral-400">VALID THRU</p>
            <p className="font-mono text-neutral-100">{expiryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
