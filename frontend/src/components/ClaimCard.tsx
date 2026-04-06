import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationStatus = "verified" | "uncertain" | "hallucinated" | "pending";

interface ClaimCardProps {
  claim: string;
  status: VerificationStatus;
  confidence: number;
  source?: string;
  sourceUrl?: string;
  explanation?: string;
}

const statusConfig = {
  verified: {
    icon: CheckCircle2,
    label: "VERIFIED TRUTH",
    pillarClass: "bg-primary shadow-[0_0_10px_hsl(var(--primary))]",
    textClass: "text-primary",
    iconClass: "text-primary",
  },
  uncertain: {
    icon: AlertTriangle,
    label: "UNCERTAIN SIGNAL",
    pillarClass: "bg-warning shadow-[0_0_10px_hsl(var(--warning))]",
    textClass: "text-warning",
    iconClass: "text-warning",
  },
  hallucinated: {
    icon: XCircle,
    label: "HALLUCINATION DETECTED",
    pillarClass: "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]",
    textClass: "text-destructive",
    iconClass: "text-destructive",
  },
  pending: {
    icon: Loader2,
    label: "ANALYZING CORE...",
    pillarClass: "bg-muted animate-pulse",
    textClass: "text-muted-foreground",
    iconClass: "text-muted-foreground animate-spin",
  },
};

export const ClaimCard = ({
  claim,
  status,
  confidence,
  source,
  sourceUrl,
  explanation,
}: ClaimCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 rounded-xl transition-all duration-500 glass glass-hover group",
        status === "pending" ? "opacity-70" : "opacity-100"
      )}
    >
      {/* Status Pillar */}
      <div className={cn("status-pillar w-1.5", config.pillarClass)} />

      <div className="flex items-start gap-4">
        <div className={cn("mt-1 p-2 rounded-lg bg-white/5 border border-white/5", config.iconClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className={cn("text-[10px] font-sans font-bold uppercase tracking-[0.2em]", config.textClass)}>
              {config.label}
            </span>
            {status !== "pending" && (
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000 ease-out", config.pillarClass)} 
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-[10px] font-sans font-bold text-muted-foreground/40 tracking-wider">
                  {confidence}% CERTAINTY
                </span>
              </div>
            )}
          </div>
          <p className="text-base text-foreground/90 font-display font-medium leading-relaxed mb-3">
            "{claim}"
          </p>
          {explanation && (
            <p className="text-xs text-muted-foreground/60 font-sans leading-relaxed mb-4 p-3 bg-white/5 rounded-lg italic">
              {explanation}
            </p>
          )}
          {source && (
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/40">
              <span className="opacity-50">PROVENANCE:</span>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dim transition-colors flex items-center gap-1.5 group/link"
                >
                  <span className="underline decoration-primary/20 hover:decoration-primary/60">{source}</span>
                  <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <span className="text-foreground/60">{source}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

