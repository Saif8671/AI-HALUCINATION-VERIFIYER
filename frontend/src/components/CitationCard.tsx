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
        "p-4 rounded-xl glass border border-white/5 transition-all duration-500 group hover:border-primary/20 hover:bg-white/10",
        isPending
          ? "opacity-60"
          : isValid
          ? "border-primary/10"
          : "border-destructive/10"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-500",
            isPending
              ? "bg-white/5 text-muted-foreground"
              : isValid
              ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,255,0.1)]"
              : "bg-destructive/10 text-destructive shadow-[0_0_10px_rgba(255,113,108,0.1)]"
          )}
        >
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 truncate font-sans font-bold uppercase tracking-wider">
            {citation}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              <span className="text-[10px] font-sans font-bold text-muted-foreground/40 tracking-widest uppercase">Validating</span>
            </div>
          ) : isValid ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-sans font-bold text-primary tracking-tighter">VERIFIED</span>
              </div>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20">
              <XCircle className="w-3 h-3 text-destructive" />
              <span className="text-[9px] font-sans font-bold text-destructive tracking-tighter">INVALID</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

