import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TextAnalyzer } from "@/components/TextAnalyzer";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useVerification } from "@/hooks/useVerification";
import { Helmet } from "react-helmet";

const Index = () => {
  const { 
    claims, 
    citations, 
    isAnalyzing, 
    overallScore, 
    hasResults, 
    analyzeText
  } = useVerification();

  return (
    <>
      <Helmet>
        <title>TrustGuard AI | Neural Integrity Protocol</title>
        <meta
          name="description"
          content="Advanced neural integrity verification. Detect hallucinations and validate synthetic content with forensic precision."
        />
      </Helmet>

      <div className="min-h-screen bg-[#020202] text-foreground relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
        {/* Ambient Background HUD */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-liquid-pulse opacity-50" />
          <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-destructive/5 rounded-full blur-[140px] animate-liquid-pulse opacity-30" style={{ animationDelay: '-8s' }} />
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-warning/5 rounded-full blur-[120px] animate-liquid-pulse opacity-20" style={{ animationDelay: '-4s' }} />
          
          {/* Scanning Lines Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <div className="star-field opacity-20" />
        </div>

        <Header />
        
        <main className="relative z-10 container mx-auto px-6 pt-32 pb-24">
          <HeroSection />

          {/* Analysis Engine Interface */}
          <div className="grid gap-16 mt-20">
            {/* Input Phase */}
            <section className="max-w-4xl mx-auto w-full">
              <div className="relative group">
                <div className="absolute -top-8 left-0 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-primary/40" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Phase 01: Core Ingestion</span>
                </div>
                <div className="glass rounded-[2.5rem] p-4 sm:p-10 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                  <TextAnalyzer 
                    onAnalyze={analyzeText} 
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              </div>
            </section>


            {/* Verification Phase */}
            {hasResults && (
              <section className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="relative mb-12">
                  <div className="absolute -top-8 left-0 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-primary/40" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Phase 02: Integrity Audit</span>
                  </div>
                  <h2 className="text-4xl font-display font-medium tracking-tighter text-foreground">
                    Protocol <span className="text-primary italic">Findings</span>
                  </h2>
                  <p className="text-muted-foreground/40 mt-2 font-sans text-sm tracking-wide uppercase font-bold">
                    Systematic verification of detected neural artifacts
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

            {/* Protocol documentation - shown when no results */}
            {!hasResults && (
              <section className="max-w-6xl mx-auto w-full mt-10">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-medium tracking-tight text-foreground mb-4">
                    Verification <span className="text-primary italic">Workflow</span>
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-white/10" />
                    <p className="text-muted-foreground/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
                      TRIPLE-LAYER INTEGRITY PROTOCOL
                    </p>
                    <div className="h-[1px] w-12 bg-white/10" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      step: "01",
                      title: "Ingestion",
                      description: "Neural core parses incoming data streams for verifiable artifacts and propositional claims.",
                      color: "primary",
                    },
                    {
                      step: "02",
                      title: "Synthesis",
                      description: "Advanced heuristics cross-reference claims against distributed global consensus repositories.",
                      color: "warning",
                    },
                    {
                      step: "03",
                      title: "Validation",
                      description: "Final integrity report rendered with forensic confidence scoring and source provenance.",
                      color: "destructive",
                    },
                  ].map(({ step, title, description, color }) => (
                    <div
                      key={step}
                      className="group relative glass rounded-[2rem] p-10 border-white/5 hover:border-primary/20 transition-all duration-700 hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-8xl font-display font-black tracking-tighter leading-none select-none">
                          {step}
                        </span>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--${color}),0.2)] transition-all duration-500`}>
                        <span className={`font-display font-bold text-xl text-${color}`}>
                          {step}
                        </span>
                      </div>
                      <h3 className="text-xl font-sans font-bold text-foreground mb-4 uppercase tracking-tighter">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground/60 leading-relaxed font-sans tabular-nums">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Minimalist Footer */}
        <footer className="relative z-10 py-12">
          <div className="container mx-auto px-6">
            <div className="glass rounded-full px-8 py-4 border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
              <span className="text-[10px] font-sans font-extrabold text-muted-foreground/30 uppercase tracking-[0.4em]">
                &copy; 2026 TrustGuard AI / Neural Verification Node
              </span>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[10px] font-sans font-extrabold text-muted-foreground/30 hover:text-primary transition-colors uppercase tracking-[0.2em]">Security Protocol</a>
                <a href="#" className="text-[10px] font-sans font-extrabold text-muted-foreground/30 hover:text-primary transition-colors uppercase tracking-[0.2em]">API Ledger</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};


export default Index;
