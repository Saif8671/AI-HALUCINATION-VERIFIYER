import { ClaimCard, VerificationStatus } from "./ClaimCard";
import { CitationCard } from "./CitationCard";
import { TrustScoreGauge } from "./TrustScoreGauge";
import { FileText, Quote, BarChart3 } from "lucide-react";

export interface Claim {
  id: string;
  text: string;
  status: VerificationStatus;
  confidence: number;
  source?: string;
  sourceUrl?: string;
  explanation?: string;
}

export interface Citation {
  id: string;
  text: string;
  exists: boolean | null;
  url?: string;
  checkingStatus: "pending" | "complete";
}

interface AnalysisResultsProps {
  claims: Claim[];
  citations: Citation[];
  overallScore: number;
  isAnalyzing: boolean;
}

export const AnalysisResults = ({
  claims,
  citations,
  overallScore,
  isAnalyzing,
}: AnalysisResultsProps) => {
  if (claims.length === 0 && !isAnalyzing) {
    return (
      <div className="glass glass-hover rounded-3xl p-16 text-center border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-primary/30 transition-all duration-500 group-hover:scale-110 shadow-xl">
          <FileText className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary transition-colors duration-500" />
        </div>
        <h3 className="font-sans font-bold text-2xl text-foreground mb-3 tracking-tighter uppercase">
          Zero Artifacts Detected
        </h3>
        <p className="text-muted-foreground/60 font-sans text-sm max-w-sm mx-auto leading-relaxed tracking-wide">
          THE NEURAL SCAN RETURNED NO VERIFIABLE CLAIMS. PLEASE PROVIDE EVIDENCE-DENSE CONTENT FOR INTEGRITY AUDIT.
        </p>
      </div>
    );
  }

  const verifiedCount = claims.filter((c) => c.status === "verified").length;
  const uncertainCount = claims.filter((c) => c.status === "uncertain").length;
  const falseCount = claims.filter((c) => c.status === "hallucinated").length;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Main Results */}
      <div className="lg:col-span-8 space-y-8">
        {/* Claims Section */}
        <section className="glass rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-foreground tracking-tight uppercase">
                  Detected Claims
                </h3>
                <p className="text-[10px] font-sans font-extrabold text-muted-foreground/40 tracking-[0.2em] uppercase">
                  {claims.length} NEURAL NODES ANALYZED
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-sans font-bold text-muted-foreground/60 tracking-widest uppercase">Live Audit</span>
            </div>
          </div>
          <div className="space-y-4">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} {...claim} claim={claim.text} />
            ))}
          </div>
        </section>

        {/* Citations Section */}
        {citations.length > 0 && (
          <section className="glass rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                <Quote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-foreground tracking-tight uppercase">
                  Citation Cross-Ref
                </h3>
                <p className="text-[10px] font-sans font-extrabold text-muted-foreground/40 tracking-[0.2em] uppercase">
                  {citations.filter((c) => c.exists).length} / {citations.length} VALID SOURCES
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {citations.map((citation) => (
                <CitationCard key={citation.id} {...citation} citation={citation.text} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sidebar Stats */}
      <div className="lg:col-span-4 space-y-8">
        {/* Trust Score */}
        <aside className="glass rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <BarChart3 className="w-5 h-5 text-primary opacity-20" />
          </div>
          <h3 className="font-sans font-bold text-sm text-foreground/40 text-center mb-6 tracking-[0.2em] uppercase">
            Integrity Matrix
          </h3>
          <TrustScoreGauge score={overallScore} isAnalyzing={isAnalyzing} />
        </aside>

        {/* Quick Stats */}
        <aside className="glass rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
          <h3 className="font-sans font-bold text-sm text-foreground/40 mb-8 tracking-[0.2em] uppercase flex items-center gap-2">
            <div className="w-1 h-3 bg-primary rounded-full" />
            Node Breakdown
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                <span className="text-xs font-sans font-bold text-muted-foreground/80 tracking-wide uppercase">Verified Truth</span>
              </div>
              <span className="font-display text-xl font-medium text-primary">
                {verifiedCount}
              </span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_8px_hsl(var(--warning))]" />
                <span className="text-xs font-sans font-bold text-muted-foreground/80 tracking-wide uppercase">Uncertain Signal</span>
              </div>
              <span className="font-display text-xl font-medium text-warning">
                {uncertainCount}
              </span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]" />
                <span className="text-xs font-sans font-bold text-muted-foreground/80 tracking-wide uppercase">Neural Breach</span>
              </div>
              <span className="font-display text-xl font-medium text-destructive">
                {falseCount}
              </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-sans font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
              <span>Latency</span>
              <span>142ms</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

