import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TextAnalyzer } from "@/components/TextAnalyzer";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useVerification } from "@/hooks/useVerification";
import { Helmet } from "react-helmet";

const Index = () => {
  const { claims, citations, isAnalyzing, overallScore, hasResults, analyzeText } =
    useVerification();

  return (
    <>
      <Helmet>
        <title>TrustGuard AI - AI Hallucination Detection & Citation Verification</title>
        <meta
          name="description"
          content="Detect AI hallucinations and verify citations instantly. Cross-check facts, validate sources, and identify potential misinformation in AI-generated content."
        />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-5s' }} />
          <div className="star-field opacity-10" />
        </div>

        <Header />
        <HeroSection />

        <main className="container mx-auto px-4 pb-16">
          {/* Input Section */}
          <section className="max-w-4xl mx-auto mb-12">
            <div className="glass rounded-2xl p-6 md:p-8">
              <h2 className="font-mono font-semibold text-xl text-foreground mb-4">
                Analyze AI Content
              </h2>
              <TextAnalyzer onAnalyze={analyzeText} isAnalyzing={isAnalyzing} />
            </div>
          </section>

          {/* Results Section */}
          {hasResults && (
            <section className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="font-mono font-semibold text-2xl text-foreground">
                  Analysis Results
                </h2>
                <p className="text-muted-foreground mt-1">
                  Review the verification status of detected claims and citations
                </p>
              </div>
              <AnalysisResults
                claims={claims}
                citations={citations}
                overallScore={overallScore}
                isAnalyzing={isAnalyzing}
              />
            </section>
          )}

          {/* How It Works - shown when no results */}
          {!hasResults && (
            <section className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-mono font-semibold text-2xl text-foreground mb-2">
                  How It Works
                </h2>
                <p className="text-muted-foreground">
                  Three simple steps to verify AI-generated content
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: "01",
                    title: "Paste Content",
                    description:
                      "Input any AI-generated text you want to verify",
                    color: "primary",
                  },
                  {
                    step: "02",
                    title: "AI Analysis",
                    description:
                      "Our system detects claims and cross-checks sources",
                    color: "accent",
                  },
                  {
                    step: "03",
                    title: "Get Results",
                    description:
                      "View detailed verification status for each claim",
                    color: "primary",
                  },
                ].map(({ step, title, description, color }) => (
                  <div
                    key={step}
                    className="glass rounded-2xl p-8 text-center glass-hover group border-t-2"
                    style={{ borderTopColor: `hsl(var(--${color}))` }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-muted/10 border border-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <span className="font-mono font-bold text-2xl text-gradient-primary">
                        {step}
                      </span>
                    </div>
                    <h3 className="font-mono font-bold text-xl text-foreground mb-3 tracking-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              TrustGuard AI — Fighting misinformation one claim at a time
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
