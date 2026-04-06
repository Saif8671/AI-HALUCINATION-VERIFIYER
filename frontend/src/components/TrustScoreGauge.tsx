import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TrustScoreGaugeProps {
  score: number;
  isAnalyzing?: boolean;
}

export const TrustScoreGauge = ({ score, isAnalyzing }: TrustScoreGaugeProps) => {
  const { color, label, iconClass } = useMemo(() => {
    if (score >= 80) return { color: "text-primary", label: "HIGH INTEGRITY", iconClass: "shadow-[0_0_20px_rgba(0,255,255,0.3)]" };
    if (score >= 50) return { color: "text-warning", label: "MODERATE RISK", iconClass: "shadow-[0_0_20px_rgba(242,201,76,0.3)]" };
    return { color: "text-destructive", label: "CRITICAL BREACH", iconClass: "shadow-[0_0_20px_rgba(255,113,108,0.3)]" };
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className={cn("relative w-40 h-40", isAnalyzing && "animate-pulse")}>
        {/* Ambient Glow */}
        <div className={cn("absolute inset-2 rounded-full blur-2xl opacity-20 transition-all duration-1000", color.replace("text-", "bg-"))} />
        
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="6"
            className="backdrop-blur-sm"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isAnalyzing ? circumference * 0.75 : strokeDashoffset}
            className={cn(color, "transition-all duration-1000 ease-out", isAnalyzing && "animate-[spin_3s_linear_infinite]")}
            style={{ 
              filter: "drop-shadow(0 0 12px currentColor)",
              transitionProperty: "stroke-dashoffset, stroke, filter" 
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-5xl font-display font-medium tracking-tighter", color)}>
              {isAnalyzing ? "..." : score}
            </span>
            {!isAnalyzing && <span className="text-[10px] font-sans font-bold text-muted-foreground/30 uppercase tracking-widest">Score</span>}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className={cn("px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md transition-all duration-500", color)}>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
            {isAnalyzing ? "SYSTEM SCANNING" : label}
          </span>
        </div>
        {!isAnalyzing && (
          <span className="text-[9px] font-sans font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">
            Trust Quotient Matrix
          </span>
        )}
      </div>
    </div>
  );
};

