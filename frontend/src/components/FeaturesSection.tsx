import React, { useState, useMemo } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Brain,
  Lock,
  Search,
  Zap,
  Landmark,
  ArrowRightLeft,
  FileCheck2,
  Eye,
  KeyRound,
  FileText,
  Binary,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureCard {
  id: string;
  category: "THREAT DETECTION" | "AI GUARDRAILS" | "BANKING SECURITY" | "MONITORING";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
}

const FEATURES: FeatureCard[] = [
  {
    id: "prompt-injection",
    category: "THREAT DETECTION",
    title: "Prompt Injection Detection",
    description: "Detect instructions that attempt to override system policies or manipulate the AI into unsafe banking actions.",
    icon: ShieldAlert,
    accentColor: "#00D2FF",
    badge: "L1 Filter",
  },
  {
    id: "jailbreak-protection",
    category: "THREAT DETECTION",
    title: "Jailbreak Protection",
    description: "Identify attempts to bypass AI safeguards through roleplay, unrestricted instructions, or malicious requests.",
    icon: ShieldCheck,
    accentColor: "#A855F7",
    badge: "Persona Guard",
  },
  {
    id: "policy-override",
    category: "THREAT DETECTION",
    title: "Policy Override Detection",
    description: "Recognize requests that attempt to disable mandatory banking rules, authorization checks, or transaction controls.",
    icon: ShieldAlert,
    accentColor: "#EF4444",
    badge: "Zero Override",
  },
  {
    id: "malicious-memo",
    category: "THREAT DETECTION",
    title: "Malicious Memo Detection",
    description: "Inspect transaction descriptions and untrusted text for embedded instructions that should never control AI behavior.",
    icon: FileText,
    accentColor: "#06B6D4",
    badge: "Memo Sanitizer",
  },
  {
    id: "obfuscation-detection",
    category: "THREAT DETECTION",
    title: "Obfuscation Detection",
    description: "Analyze suspicious character patterns and unusual formatting that may be used to evade basic text filters.",
    icon: Binary,
    accentColor: "#3B82F6",
    badge: "NFKC Unicode",
  },
  {
    id: "policy-engine",
    category: "AI GUARDRAILS",
    title: "Deterministic Policy Engine",
    description: "Apply explicit security rules to determine whether a request can proceed, must be blocked, or requires further review.",
    icon: Layers,
    accentColor: "#8B5CF6",
    badge: "Deterministic",
  },
  {
    id: "secure-tool-execution",
    category: "AI GUARDRAILS",
    title: "Secure Tool Execution",
    description: "Prevent blocked requests from reaching privileged banking operations and enforce independent authorization checks.",
    icon: Lock,
    accentColor: "#10B981",
    badge: "Strict Gating",
  },
  {
    id: "security-monitoring",
    category: "MONITORING",
    title: "Security Monitoring",
    description: "Record security events, risk classifications, and decisions to support investigation and system auditing.",
    icon: Eye,
    accentColor: "#00D2FF",
    badge: "Real-time Telemetry",
  },
  {
    id: "transfer-confirmation",
    category: "BANKING SECURITY",
    title: "2-Phase Transfer Confirmation",
    description: "Moving money requires explicit, backend-verified confirmation tokens. Preparing a transfer never debits or credits funds prematurely.",
    icon: ArrowRightLeft,
    accentColor: "#10B981",
    badge: "Atomic Execution",
  },
  {
    id: "integer-paise-engine",
    category: "BANKING SECURITY",
    title: "Sub-Paise Precision Engine",
    description: "Zero floating-point inaccuracies. All monetary computations are maintained in integer paise with boundary limit validations.",
    icon: Landmark,
    accentColor: "#F59E0B",
    badge: "INR Strict",
  },
];

const CATEGORIES = ["ALL", "THREAT DETECTION", "AI GUARDRAILS", "BANKING SECURITY", "MONITORING"] as const;

export const FeaturesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFeatures = useMemo(() => {
    return FEATURES.filter((feat) => {
      const matchesCategory = selectedCategory === "ALL" || feat.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        feat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#00D2FF]/10 via-blue-600/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* 1. SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Intelligent Defense Architecture
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 font-serif-title">
          Security That Thinks{" "}
          <span className="bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
            Before It Acts.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
          Explore how Strombreaker 2.0 combines intelligent threat detection, AI guardrails, and deterministic security policies to protect every banking interaction.
        </p>
      </div>

      {/* 2. FLOATING 3D SECURITY ICON DISPLAY */}
      <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-72 mb-20 flex items-center justify-center">
        {/* Soft reflection floor */}
        <div className="absolute bottom-0 w-3/4 h-16 bg-gradient-to-b from-teal-200/20 to-transparent blur-2xl rounded-full" />

        {/* Central cybersecurity shield */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-white to-teal-50 border-2 border-teal-300 shadow-xl shadow-teal-500/10 flex items-center justify-center text-teal-600 animate-pulse">
            <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 fill-teal-500/15" />
          </div>
          <span className="mt-3 text-xs font-mono font-bold tracking-widest text-teal-800">FIREWALL CORE</span>
        </div>

        {/* Floating background & foreground icons */}
        <div className="absolute -left-4 sm:left-12 top-6 animate-float" style={{ animationDelay: "0.2s" }}>
          <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-rose-500 border border-rose-200 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>

        <div className="absolute left-1/4 -top-2 animate-float" style={{ animationDelay: "1.1s" }}>
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-teal-600 border border-teal-200 shadow-md">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        <div className="absolute right-1/4 -top-2 animate-float" style={{ animationDelay: "0.7s" }}>
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="absolute -right-4 sm:right-12 top-6 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-lime-600 border border-lime-200 shadow-md">
            <ArrowRightLeft className="w-7 h-7" />
          </div>
        </div>

        <div className="absolute left-8 bottom-6 animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-amber-600 border border-amber-200 shadow-md">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="absolute right-8 bottom-6 animate-float" style={{ animationDelay: "1.8s" }}>
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-cyan-600 border border-cyan-200 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CATEGORY FILTER BAR & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-teal-100">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1.5 rounded-2xl bg-white/80 border border-teal-100 shadow-sm scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition-all duration-200 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold"
                    : "text-slate-600 hover:text-teal-900 hover:bg-teal-50/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search security features..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/90 border border-teal-200 text-xs text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 transition-all font-medium"
          />
        </div>
      </div>

      {/* 4. FEATURE CARDS GRID */}
      {filteredFeatures.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-card">
          <p className="text-slate-500 text-sm">No security features match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative rounded-2xl p-6 glass-card hover:border-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shadow-sm"
                        style={{
                          backgroundColor: `${feat.accentColor}18`,
                          border: `1px solid ${feat.accentColor}35`,
                          color: feat.accentColor,
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-teal-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="font-medium">{feat.category}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ACTIVE
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
