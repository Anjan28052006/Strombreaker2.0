import React from "react";
import { motion } from "framer-motion";

interface ThinkingOrbProps {
  isThinking?: boolean;
  statusText?: string;
  className?: string;
}

export const ThinkingOrb: React.FC<ThinkingOrbProps> = ({
  isThinking = false,
  statusText = "Strombreaker 2.0 AI Guardrails Active",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {/* Orb Visualizer Container */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer ambient glow */}
        <motion.div
          animate={{
            scale: isThinking ? [1, 1.25, 1] : [1, 1.05, 1],
            opacity: isThinking ? [0.4, 0.8, 0.4] : [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: isThinking ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D2FF] via-blue-500 to-indigo-600 blur-2xl pointer-events-none"
        />

        {/* Middle pulsing orbital ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: isThinking ? 4 : 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-2 rounded-full border border-dashed border-[#00D2FF]/30 pointer-events-none"
        />

        {/* Inner Core Orb Sphere */}
        <motion.div
          animate={{
            scale: isThinking ? [0.95, 1.08, 0.95] : [1, 1.02, 1],
          }}
          transition={{
            duration: isThinking ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00D2FF] via-cyan-400 to-blue-700 shadow-2xl shadow-[#00D2FF]/50 flex items-center justify-center overflow-hidden border border-white/40"
        >
          {/* Internal specular highlight reflection */}
          <div className="absolute top-1 left-2 w-8 h-4 bg-white/40 rounded-full blur-[2px] transform -rotate-12 pointer-events-none" />

          {/* Core Energy Shimmer */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
          />

          <span className="text-xl">🛡️</span>
        </motion.div>
      </div>

      {/* Dynamic Status Text */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isThinking ? "bg-teal-500 animate-ping" : "bg-emerald-500 animate-pulse"
          }`}
        />
        <p className="text-xs font-mono tracking-wider text-teal-900 font-bold uppercase">
          {statusText}
        </p>
      </div>
    </div>
  );
};
