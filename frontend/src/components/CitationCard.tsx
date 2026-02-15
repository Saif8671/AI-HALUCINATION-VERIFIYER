import { BookOpen, CheckCircle2, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  citation: string;
  exists: boolean | null;
  url?: string;
  checkingStatus: "pending" | "complete";
}

export const CitationCard = ({
  citation,
  exists,
  url,
  checkingStatus,
}: CitationCardProps) => {
  const isPending = checkingStatus === "pending";
  const isValid = exists === true;

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all duration-300",
        isPending
          ? "bg-muted/30 border-border"
          : isValid
          ? "bg-verified/5 border-verified/20"
          : "bg-hallucinated/5 border-hallucinated/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-1.5 rounded-md",
            isPending
              ? "bg-muted text-muted-foreground"
              : isValid
              ? "bg-verified/20 text-verified"
              : "bg-hallucinated/20 text-hallucinated"
          )}
        >
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate font-mono">
            {citation}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-verified" />
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </>
          ) : (
            <XCircle className="w-4 h-4 text-hallucinated" />
          )}
        </div>
      </div>
    </div>
  );
};
