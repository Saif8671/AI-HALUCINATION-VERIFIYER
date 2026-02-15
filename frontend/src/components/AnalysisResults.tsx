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
      <div className="glass rounded-2xl p-12 text-center border-dashed border-2">
        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-xl text-foreground mb-2">
          No Claims Detected
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Our AI couldn't find any specific factual claims to verify in this text. 
          Try providing content with more specific facts, dates, or citations.
        </p>
      </div>
    );
  }

  const verifiedCount = claims.filter((c) => c.status === "verified").length;
  const uncertainCount = claims.filter((c) => c.status === "uncertain").length;
  const falseCount = claims.filter((c) => c.status === "hallucinated").length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Results */}
      <div className="lg:col-span-2 space-y-6">
        {/* Claims Section */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-mono font-semibold text-foreground">
                Detected Claims
              </h3>
              <p className="text-xs text-muted-foreground">
                {claims.length} claims analyzed
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} {...claim} claim={claim.text} />
            ))}
          </div>
        </div>

        {/* Citations Section */}
        {citations.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Quote className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-mono font-semibold text-foreground">
                  Citation Verification
                </h3>
                <p className="text-xs text-muted-foreground">
                  {citations.filter((c) => c.exists).length} of {citations.length} citations verified
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {citations.map((citation) => (
                <CitationCard key={citation.id} {...citation} citation={citation.text} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Stats */}
      <div className="space-y-6">
        {/* Trust Score */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-mono font-semibold text-foreground text-center mb-4">
            Trust Score
          </h3>
          <TrustScoreGauge score={overallScore} isAnalyzing={isAnalyzing} />
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary">
              <BarChart3 className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-mono font-semibold text-foreground">
              Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verified</span>
              <span className="font-mono font-semibold text-verified">
                {verifiedCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uncertain</span>
              <span className="font-mono font-semibold text-uncertain">
                {uncertainCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Likely False</span>
              <span className="font-mono font-semibold text-hallucinated">
                {falseCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
