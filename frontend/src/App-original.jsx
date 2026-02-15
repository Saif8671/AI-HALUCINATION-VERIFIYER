import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Search, FileText, Loader, ExternalLink, AlertTriangle } from 'lucide-react';

const HallucinationVerifier = () => {
  const [aiText, setAiText] = useState('');
  const [sources, setSources] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeContent = async () => {
    if (!aiText.trim()) {
      setError('Please enter AI-generated text to verify');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `You are an expert fact-checker and citation verification system. Analyze the following AI-generated text for potential hallucinations and verify any claims.

${sources.trim() ? `SOURCES PROVIDED:
${sources}

Please verify the AI-generated text against these sources.` : 'No sources provided. Search the web to verify factual claims.'}

AI-GENERATED TEXT:
${aiText}

Provide your analysis ONLY as a JSON object with this exact structure (no markdown, no preamble):
{
  "overallVerdict": "verified" | "partial" | "hallucination",
  "confidenceScore": 0-100,
  "summary": "brief summary of findings",
  "claims": [
    {
      "claim": "the specific claim text",
      "status": "verified" | "unverified" | "false" | "unsupported",
      "confidence": 0-100,
      "evidence": "supporting or contradicting evidence",
      "sourceMatch": true/false
    }
  ],
  "hallucinations": [
    {
      "text": "hallucinated content",
      "reason": "why this is likely false",
      "severity": "low" | "medium" | "high"
    }
  ],
  "recommendations": ["list of recommendations"]
}`
            }
          ],
          tools: sources.trim() ? [] : [
            {
              "type": "web_search_20250305",
              "name": "web_search"
            }
          ]
        })
      });

      const data = await response.json();
      
      // Extract text from all content blocks
      let fullResponse = '';
      if (data.content) {
        for (const block of data.content) {
          if (block.type === 'text') {
            fullResponse += block.text;
          }
        }
      }

      // Clean and parse JSON
      const cleanedResponse = fullResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const analysisResults = JSON.parse(cleanedResponse);
      setResults(analysisResults);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Verification failed: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'verified': return 'text-emerald-600';
      case 'partial': return 'text-amber-600';
      case 'hallucination': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'verified': return <CheckCircle className="w-6 h-6" />;
      case 'partial': return <AlertTriangle className="w-6 h-6" />;
      case 'hallucination': return <XCircle className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      unverified: 'bg-slate-100 text-slate-800 border-slate-300',
      false: 'bg-rose-100 text-rose-800 border-rose-300',
      unsupported: 'bg-amber-100 text-amber-800 border-amber-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.unverified}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-rose-600 bg-rose-50';
      case 'medium': return 'border-l-amber-600 bg-amber-50';
      case 'low': return 'border-l-blue-600 bg-blue-50';
      default: return 'border-l-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Newsreader:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Newsreader', serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .analysis-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 
                      0 8px 10px -6px rgba(0, 0, 0, 0.05),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .gradient-border {
          position: relative;
          background: white;
          border-radius: 0.75rem;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
          }
        }

        textarea:focus, input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .confidence-bar {
          background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
          height: 6px;
          border-radius: 3px;
        }

        .source-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              VerifyAI
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advanced hallucination detection and citation verification for AI-generated content
          </p>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* AI Text Input */}
          <div className="analysis-card rounded-2xl p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              AI-Generated Text
            </label>
            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder="Paste the AI-generated content you want to verify..."
              className="w-full h-64 p-4 border-2 border-slate-200 rounded-xl mono text-sm resize-none transition-all duration-200 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-2 mono">
              {aiText.length} characters
            </p>
          </div>

          {/* Sources Input */}
          <div className="analysis-card rounded-2xl p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <label className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <ExternalLink className="w-5 h-5 text-indigo-600" />
              Source Materials (Optional)
            </label>
            <textarea
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="Paste source documents, URLs, or reference materials to verify against...

Leave empty to use web search for verification."
              className="w-full h-64 p-4 border-2 border-slate-200 rounded-xl mono text-sm resize-none transition-all duration-200 focus:border-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              {sources.trim() ? '✓ Sources provided' : '○ Will use web search'}
            </p>
          </div>
        </div>

        {/* Verify Button */}
        <div className="text-center mb-8 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={analyzeContent}
            disabled={isVerifying || !aiText.trim()}
            className={`px-10 py-4 rounded-xl font-semibold text-lg text-white shadow-lg transform transition-all duration-300 ${
              isVerifying || !aiText.trim()
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin" />
                Verifying Content...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Search className="w-5 h-5" />
                Verify Content
              </span>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="analysis-card rounded-2xl p-6 mb-8 border-l-4 border-rose-500 bg-rose-50 animate-slide-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-rose-900 text-lg mb-1">Verification Error</h3>
                <p className="text-rose-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-6 animate-slide-in">
            {/* Overall Verdict */}
            <div className="gradient-border p-8">
              <div className="flex items-start gap-4">
                <div className={`${getVerdictColor(results.overallVerdict)} mt-1`}>
                  {getVerdictIcon(results.overallVerdict)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">Overall Verdict</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${getVerdictColor(results.overallVerdict)} bg-opacity-10`}>
                      {results.overallVerdict.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 text-lg mb-4">{results.summary}</p>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600 mono">Confidence Score</span>
                      <span className="text-lg font-bold text-slate-900 mono">{results.confidenceScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="confidence-bar h-full transition-all duration-1000"
                        style={{ width: `${results.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims Analysis */}
            {results.claims && results.claims.length > 0 && (
              <div className="analysis-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Claims Verification
                </h3>
                <div className="space-y-4">
                  {results.claims.map((claim, index) => (
                    <div key={index} className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-slate-800 font-medium flex-1 leading-relaxed">{claim.claim}</p>
                        {getStatusBadge(claim.status)}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 mono">Confidence</span>
                          <span className="text-sm font-bold text-slate-700 mono">{claim.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${claim.confidence}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{claim.evidence}</p>
                        {claim.sourceMatch && (
                          <span className="source-badge mt-2 inline-block">
                            SOURCE VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hallucinations Detected */}
            {results.hallucinations && results.hallucinations.length > 0 && (
              <div className="analysis-card rounded-2xl p-8 border-l-4 border-rose-500">
                <h3 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                  Potential Hallucinations Detected
                </h3>
                <div className="space-y-4">
                  {results.hallucinations.map((hallucination, index) => (
                    <div 
                      key={index} 
                      className={`border-l-4 rounded-r-xl p-6 ${getSeverityColor(hallucination.severity)}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="font-mono text-sm text-slate-800 flex-1 bg-white rounded p-3 border border-slate-200">
                          "{hallucination.text}"
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          hallucination.severity === 'high' ? 'bg-rose-200 text-rose-900' :
                          hallucination.severity === 'medium' ? 'bg-amber-200 text-amber-900' :
                          'bg-blue-200 text-blue-900'
                        }`}>
                          {hallucination.severity}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <span className="font-semibold">Reason:</span> {hallucination.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="analysis-card rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-indigo-600" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">
            Powered by Claude AI • Advanced verification and fact-checking
          </p>
        </div>
      </div>
    </div>
  );
};

export default HallucinationVerifier;
