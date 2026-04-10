import { useCallback, useState } from "react";
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

const normalizeEndpointCandidates = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim() || "";
  const candidates = new Set<string>();

  const addCandidatesFromBase = (base: string) => {
    const normalized = base.replace(/\/$/, "");

    if (normalized.endsWith("/api/verify") || normalized.endsWith("/verify")) {
      candidates.add(normalized);
      return;
    }

    candidates.add(`${normalized}/api/verify`);
    candidates.add(`${normalized}/verify`);
  };

  if (envUrl) {
    addCandidatesFromBase(envUrl);
  }

  addCandidatesFromBase("http://localhost:3001");

  return [...candidates];
};

const VERIFY_URLS = normalizeEndpointCandidates();

const toRelatedEndpoint = (verifyUrl: string, apiPath: string, plainPath: string) => {
  if (verifyUrl.endsWith("/api/verify")) {
    return verifyUrl.replace("/api/verify", apiPath);
  }

  if (verifyUrl.endsWith("/verify")) {
    return verifyUrl.replace("/verify", plainPath);
  }

  const normalized = verifyUrl.replace(/\/$/, "");
  return `${normalized}${apiPath}`;
};

const isLikelyHtml = (text: string) => /<!doctype html>|<html[\s>]/i.test(text);

const requestJsonWithFallback = async <T,>(
  urls: string[],
  init: RequestInit,
  failureLabel: string,
): Promise<T> => {
  const errors: string[] = [];

  for (const url of urls) {
    try {
      const response = await fetch(url, init);
      const responseText = await response.text();

      let data: T | null = null;
      try {
        data = JSON.parse(responseText) as T;
      } catch {
        if (isLikelyHtml(responseText) || response.status >= 500) {
          errors.push(`${url} returned non-JSON (${response.status})`);
          continue;
        }

        throw new Error(`Server returned invalid JSON from ${url}`);
      }

      if (!response.ok) {
        const message =
          (data as BackendVerifyResponse | null)?.message ||
          (data as BackendVerifyResponse | null)?.error ||
          `Request failed with status ${response.status}`;

        if (response.status >= 500 || response.status === 404 || response.status === 502 || response.status === 503) {
          errors.push(`${url} returned ${response.status}`);
          continue;
        }

        throw new Error(message);
      }

      return data as T;
    } catch (error: any) {
      errors.push(`${url}: ${error.message}`);
    }
  }

  throw new Error(`${failureLabel}. Tried: ${errors.join(" | ")}`);
};

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

  const extractUrl = async (url: string) => {
    const urls = VERIFY_URLS.map((verifyUrl) =>
      toRelatedEndpoint(verifyUrl, "/api/extract-url", "/extract-url"),
    );

    const data = await requestJsonWithFallback<{ text?: string }>(
      urls,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      },
      "URL extraction failed",
    );

    return data.text || "";
  };

  const extractPdf = async (file: File) => {
    const urls = VERIFY_URLS.map((verifyUrl) =>
      toRelatedEndpoint(verifyUrl, "/api/extract-pdf", "/extract-pdf"),
    );

    const formData = new FormData();
    formData.append("file", file);

    const data = await requestJsonWithFallback<{ text?: string }>(
      urls,
      {
        method: "POST",
        body: formData,
      },
      "PDF extraction failed",
    );

    return data.text || "";
  };

  const analyzeText = useCallback(async (text: string, sources?: string, model: string = "auto") => {
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
      const data = await requestJsonWithFallback<BackendVerifyResponse>(
        VERIFY_URLS,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aiText: text, sources, model }),
        },
        "Verification server returned an invalid response",
      );

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
    extractUrl,
    extractPdf,
  };
};

