import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSequenceProps {
  totalFrames?: number;
  onEnterDashboard?: () => void;
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  totalFrames = 300,
  onEnterDashboard,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Frame tracking states
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(1);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Inertial frame scrubbing references
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Helper to format frame path: 1 -> "001", 300 -> "300"
  const getFrameUrl = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/hero-frames/ezgif-frame-${padded}.jpg`;
  };

  // Preload frames progressively: Frame 1 immediately, then keyframes, then full sequence
  useEffect(() => {
    let isCancelled = false;
    let count = 0;

    const loadImg = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current.has(idx)) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(idx);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current.set(idx, img);
            count++;
            setLoadedCount(count);
            if (count >= 3 && !isReady) {
              setIsReady(true);
            }
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    };

    const runPreload = async () => {
      // 1. Immediately load Frame 1 so initial render is instant
      await loadImg(1);
      if (isCancelled) return;

      // 2. Load keyframes evenly distributed across the 300 frames
      const keyframes: number[] = [];
      for (let i = 1; i <= totalFrames; i += 4) {
        keyframes.push(i);
      }
      await Promise.all(keyframes.map((f) => loadImg(f)));
      if (isCancelled) return;

      // 3. Sequentially fill the remaining frames
      for (let i = 1; i <= totalFrames; i++) {
        if (isCancelled) return;
        if (!imagesRef.current.has(i)) {
          await loadImg(i);
        }
      }
    };

    runPreload();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames]);

  // WHEEL INTERCEPTION:
  // As user scrolls, normal scrolling does NOT work while frames are scrubbing.
  // Instead, the mouse wheel advances the frames.
  // ONLY when frames end (at Frame 300), normal scrolling acts!
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY <= 15;

      if (isAtTop) {
        if (e.deltaY > 0) {
          // User scrolling DOWN
          if (currentFrameRef.current < totalFrames) {
            // Block normal page scroll! Scrub frames forward instead!
            e.preventDefault();
            const step = Math.max(3, Math.round(Math.abs(e.deltaY) * 0.18));
            targetFrameRef.current = Math.min(
              totalFrames,
              targetFrameRef.current + step
            );
            if (targetFrameRef.current >= totalFrames) {
              setIsComplete(true);
            }
          } else {
            // Frames reached 300: do NOT preventDefault! Normal scrolling acts!
            setIsComplete(true);
          }
        } else if (e.deltaY < 0) {
          // User scrolling UP while at top of page
          if (targetFrameRef.current > 1) {
            // Block scroll and scrub frames backward
            e.preventDefault();
            const step = Math.max(3, Math.round(Math.abs(e.deltaY) * 0.18));
            targetFrameRef.current = Math.max(
              1,
              targetFrameRef.current - step
            );
            if (targetFrameRef.current < totalFrames) {
              setIsComplete(false);
            }
          }
        }
      }
    };

    // Touch swipe support for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY <= 15) {
        const touchY = e.touches[0].clientY;
        const diffY = touchStartY - touchY;
        if (diffY > 0 && currentFrameRef.current < totalFrames) {
          e.preventDefault();
          const step = Math.max(2, Math.round(Math.abs(diffY) * 0.15));
          targetFrameRef.current = Math.min(
            totalFrames,
            targetFrameRef.current + step
          );
          if (targetFrameRef.current >= totalFrames) {
            setIsComplete(true);
          }
        } else if (diffY < 0 && currentFrameRef.current > 1) {
          e.preventDefault();
          const step = Math.max(2, Math.round(Math.abs(diffY) * 0.15));
          targetFrameRef.current = Math.max(
            1,
            targetFrameRef.current - step
          );
        }
        touchStartY = touchY;
      }
    };

    // Passive must be false to allow preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [totalFrames]);

  // Fast silky physics lerp animation loop (60fps)
  useEffect(() => {
    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) < 0.1) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * 0.35;
      }

      const activeFrameNum = Math.min(
        totalFrames,
        Math.max(1, Math.round(currentFrameRef.current))
      );
      setCurrentFrameDisplay(activeFrameNum);

      if (activeFrameNum >= totalFrames && !isComplete) {
        setIsComplete(true);
      }

      // Draw active frame to full-bleed canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          let imgToDraw = imagesRef.current.get(activeFrameNum);
          if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
            let bestDiff = Infinity;
            let bestFrame = 1;
            for (const [fNum, fImg] of imagesRef.current.entries()) {
              const d = Math.abs(fNum - activeFrameNum);
              if (d < bestDiff && fImg.complete && fImg.naturalWidth > 0) {
                bestDiff = d;
                bestFrame = fNum;
              }
            }
            imgToDraw = imagesRef.current.get(bestFrame);
          }

          if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const targetW = Math.round(window.innerWidth * dpr);
            const targetH = Math.round(window.innerHeight * dpr);

            if (canvas.width !== targetW || canvas.height !== targetH) {
              canvas.width = targetW;
              canvas.height = targetH;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // Full-bleed cover calculation: zero left/right or top/bottom gaps
            const scale = Math.max(
              targetW / imgToDraw.naturalWidth,
              targetH / imgToDraw.naturalHeight
            );
            const drawW = imgToDraw.naturalWidth * scale;
            const drawH = imgToDraw.naturalHeight * scale;
            const drawX = (targetW - drawW) / 2;
            const drawY = (targetH - drawH) / 2;

            ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [totalFrames, isComplete]);

  // Phase status descriptor based on animation frame
  const getPhaseDescriptor = () => {
    if (currentFrameDisplay < 90) {
      return {
        phase: "STAGE 01 // SAFE TRANSACTION DISPATCH",
        status: "NORMAL VERIFIED FLOW • RESERVES SECURE",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      };
    }
    if (currentFrameDisplay < 210) {
      return {
        phase: "STAGE 02 // ADVERSARIAL PROMPT INJECTION ATTEMPT",
        status: "INSPECTION ACTIVE • HOSTILE OVERRIDE DETECTED",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      };
    }
    return {
      phase: "STAGE 03 // BLUE-TEAM AI FIREWALL SHIELD ACTIVATED",
      status: "ADVERSARIAL ATTACK BLOCKED (<12MS) • ZERO WRITE TO LEDGER",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    };
  };

  const phase = getPhaseDescriptor();
  const progressPercent = Math.round((currentFrameDisplay / totalFrames) * 100);

  const handleScrollToOperations = () => {
    const el = document.getElementById("operations");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden selection:bg-[#00D2FF]/20 selection:text-white"
    >
      {/* =========================================================================
          FULL-BLEED 300-FRAME CINEMATIC CANVAS (ZERO GAPS, COVERS FULL PAGE)
      ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
        {/* Eager Frame 1 element so there is 0ms initial delay */}
        <img
          src="/hero-frames/ezgif-frame-001.jpg"
          alt="Strombreaker Defense"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isReady ? 1 : 0 }}
        />
      </div>

      {/* Smooth bottom transition fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC]/90 via-[#F8FAFC]/40 to-transparent pointer-events-none z-20" />

      {/* =========================================================================
          TOP STATUS PILL: REAL-TIME THREAT TELEMETRY
      ========================================================================= */}
      <div className="absolute top-4 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-teal-200/80 backdrop-blur-xl text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-slate-900 font-bold">STROMBREAKER 2.0 FIREWALL</span>
          <span className="text-slate-400">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${phase.color}`}>
            {phase.phase}
          </span>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM LEFT: LIVE DEFENSE RADAR (NON-INTRUSIVE)
      ========================================================================= */}
      <div className="absolute bottom-8 left-6 z-30 hidden sm:flex items-center gap-3 p-3 rounded-2xl glass-panel border border-teal-200/80 backdrop-blur-xl pointer-events-none shadow-md">
        <div className="relative w-8 h-8 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-50">
          <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-teal-600" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            BLUE-TEAM RADAR
          </div>
          <div className="text-xs font-mono text-teal-800 font-bold">
            {phase.status}
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM RIGHT: FRAME COUNTER & PROGRESS SCRUBBER
      ========================================================================= */}
      <div className="absolute bottom-8 right-6 z-30 flex items-center gap-3 p-3 rounded-2xl glass-panel border border-teal-200/80 backdrop-blur-xl pointer-events-none shadow-md">
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500 font-semibold">FRAME PROGRESS</div>
          <div className="text-xs font-mono text-teal-700 font-bold">
            {String(currentFrameDisplay).padStart(3, "0")} / {totalFrames}
          </div>
        </div>
        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CENTER: ACTION GUIDANCE & SCROLL INDICATOR
      ========================================================================= */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center justify-end p-4 text-center pointer-events-none">
        {currentFrameDisplay < totalFrames ? (
          <div className="glass-panel px-5 py-2.5 rounded-full border border-teal-200/80 text-xs font-mono text-slate-700 flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">Scroll mouse wheel to advance 3D defense sequence ({progressPercent}%)</span>
            <ChevronDown className="w-4 h-4 text-teal-600 animate-bounce" />
          </div>
        ) : (
          <div className="glass-panel p-4 rounded-2xl border border-teal-300 shadow-xl backdrop-blur-2xl pointer-events-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DEFENSE SEQUENCE VERIFIED (300/300)</span>
            </div>
            <button
              onClick={handleScrollToOperations}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-teal-500/25 cursor-pointer transition-all"
            >
              <span>Explore Operations Below</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
