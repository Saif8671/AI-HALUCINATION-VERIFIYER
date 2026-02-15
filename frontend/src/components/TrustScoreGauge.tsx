import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TrustScoreGaugeProps {
  score: number;
  isAnalyzing?: boolean;
}

export const TrustScoreGauge = ({ score, isAnalyzing }: TrustScoreGaugeProps) => {
  const { color, label, glowClass } = useMemo(() => {
    if (score >= 80) return { color: "text-verified", label: "High Trust", glowClass: "glow-primary" };
    if (score >= 50) return { color: "text-uncertain", label: "Moderate Trust", glowClass: "glow-warning" };
    return { color: "text-hallucinated", label: "Low Trust", glowClass: "glow-destructive" };
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("relative w-32 h-32", isAnalyzing && "animate-pulse")}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isAnalyzing ? circumference : strokeDashoffset}
            className={cn(color, "transition-all duration-1000 ease-out")}
            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-mono font-bold", color)}>
            {isAnalyzing ? "--" : score}
          </span>
          <span className="text-xs text-muted-foreground font-mono">/ 100</span>
        </div>
      </div>
      <div className={cn("text-sm font-mono font-medium", color)}>
        {isAnalyzing ? "Analyzing..." : label}
      </div>
    </div>
  );
};
