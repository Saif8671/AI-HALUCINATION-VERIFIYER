import { useState, useCallback } from "react";
import { Claim, Citation } from "@/components/AnalysisResults";
import { toast } from "@/hooks/use-toast";

type BackendClaimStatus = "verified" | "unverified" | "false" | "unsupported";

interface BackendClaim {
  claim?: string;
  status?: BackendClaimStatus;
  confidence?: number;
  evidence?: string;
  sourceMatch?: boolean;
}

interface BackendHallucination {
  text?: string;
  reason?: string;
}

interface BackendVerifyResponse {
  confidenceScore?: number;
  claims?: BackendClaim[];
  hallucinations?: BackendHallucination[];
  error?: string;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL?.trim() || "/api/verify";

const mapClaimStatus = (
  status?: BackendClaimStatus,
): Claim["status"] => {
  if (status === "verified") return "verified";
  if (status === "false") return "hallucinated";
  return "uncertain";
};

export const useVerification = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [hasResults, setHasResults] = useState(false);

  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please provide some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setHasResults(true);
    setClaims([]);
    setCitations([]);
    setOverallScore(0);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiText: text, model: "auto" }),
      });

      const data: BackendVerifyResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to verify content");
      }

      const normalizedClaims: Claim[] = (data.claims || []).map((claim, index) => ({
        id: `claim-${index + 1}`,
        text: claim.claim || "Unknown claim",
        status: mapClaimStatus(claim.status),
        confidence: claim.confidence ?? 0,
        explanation: claim.evidence,
      }));

      const hallucinationClaims: Claim[] = (data.hallucinations || []).map((item, index) => ({
        id: `hallucination-${index + 1}`,
        text: item.text || "Potential hallucination detected",
        status: "hallucinated",
        confidence: 0,
        explanation: item.reason,
      }));

      const normalizedCitations: Citation[] = (data.claims || [])
        .filter((claim) => claim.evidence)
        .map((claim, index) => ({
          id: `citation-${index + 1}`,
          text: claim.evidence as string,
          exists: claim.sourceMatch ?? null,
          checkingStatus: "complete",
        }));

      setClaims([...normalizedClaims, ...hallucinationClaims]);
      setCitations(normalizedCitations);
      setOverallScore(data.confidenceScore ?? 0);
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Could not connect to the verification server.",
        variant: "destructive",
      });
      setHasResults(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    claims,
    citations,
    isAnalyzing,
    overallScore,
    hasResults,
    analyzeText,
  };
};
