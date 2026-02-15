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
    label: "Verified",
    bgClass: "bg-verified/10 border-verified/30",
    textClass: "text-verified",
    iconClass: "text-verified",
  },
  uncertain: {
    icon: AlertTriangle,
    label: "Uncertain",
    bgClass: "bg-uncertain/10 border-uncertain/30",
    textClass: "text-uncertain",
    iconClass: "text-uncertain",
  },
  hallucinated: {
    icon: XCircle,
    label: "Likely False",
    bgClass: "bg-hallucinated/10 border-hallucinated/30",
    textClass: "text-hallucinated",
    iconClass: "text-hallucinated",
  },
  pending: {
    icon: Loader2,
    label: "Checking...",
    bgClass: "bg-muted/50 border-border",
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
        "p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]",
        config.bgClass
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 p-1.5 rounded-lg bg-background/50", config.iconClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider", config.textClass)}>
              {config.label}
            </span>
            {status !== "pending" && (
              <span className="text-xs font-mono text-muted-foreground">
                {confidence}% confidence
              </span>
            )}
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-2">
            "{claim}"
          </p>
          {explanation && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {explanation}
            </p>
          )}
          {source && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Source:</span>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  {source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>{source}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
