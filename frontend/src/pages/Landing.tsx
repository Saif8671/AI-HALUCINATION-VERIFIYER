import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Shield, Zap, Search, Globe, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Layers, Cpu, Database } from "lucide-react";
import { Helmet } from "react-helmet";

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>TrustGuard AI | Neural Integrity Protocol</title>
        <meta
          name="description"
          content="TrustGuard AI - The ultimate AI hallucination verifier. Verify facts, detect fabrications, and score AI content integrity with neural precision."
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
        
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-6 pt-48 pb-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Neural Protocol v2.0 Active</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              TrustGuard <span className="text-primary italic">AI</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground/60 leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              AI Hallucination Verifier — Automatically extracting factual claims, searching the live web for evidence, and delivering per-claim verdicts with a visual trust score in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Button asChild className="h-16 px-10 text-sm font-bold uppercase tracking-[0.2em] neon-glow-strong glass neon-border hover:bg-primary/10">
                <Link to="/analyse">
                  Initialize Analysis <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="h-16 px-10 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors">
                View Protocol Documentation
              </Button>
            </div>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center justify-center gap-3">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none">Gemini Flash</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Layers className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none">Groq Llama</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none">Tavily AI</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none">FastAPI Core</span>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="container mx-auto px-6 py-32 border-t border-white/5">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-8 bg-primary/40" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Introduction</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tighter mb-8 leading-tight">
                  What is <span className="text-primary italic">TrustGuard AI?</span>
                </h2>
                <p className="text-lg text-muted-foreground/60 leading-relaxed mb-8">
                  TrustGuard AI is an intelligent fact-verification system that sits between AI-generated content and the user. It ensures that the information you receive is grounded in reality, not neural fabrications.
                </p>
                <ul className="space-y-4">
                  {[
                    "Extracts factual claims from any text stream",
                    "Searches the real-time web for cross-referenced evidence",
                    "Computes forensic trust scores per individual claim",
                    "Universal multilingual support with auto-detection"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Interfaces", val: "3", sub: "Web · Extension · CLI", icon: Layers },
                  { label: "AI Models", val: "4+", sub: "Gemini · Groq · Claude", icon: Cpu },
                  { label: "Search Engines", val: "2", sub: "Tavily · DuckDuckGo", icon: Search },
                  { label: "Languages", val: "∞", sub: "Native Multilingual", icon: Globe },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-3xl p-8 border-white/5 hover:border-primary/10 transition-all duration-500 group">
                    <stat.icon className="w-6 h-6 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl font-display font-bold text-white mb-2">{stat.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">{stat.label}</div>
                    <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Problem Statement */}
          <section className="container mx-auto px-6 py-32 bg-destructive/[0.02] border-y border-white/5">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-destructive/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-destructive/60">Problem Statement</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tighter mb-8 leading-tight">
                AI hallucinates. <br/><span className="text-destructive italic">TrustGuard catches it.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Neural Fabrications", desc: "LLMs fabricate facts with complete confidence, making fiction indistinguishable from truth.", icon: XCircle },
                { title: "No Verification Layer", desc: "Lack of fast, automated cross-checking against trusted real-world sources.", icon: AlertTriangle },
                { title: "Ghost Citations", desc: "Synthesizing non-existent research papers and books that appear deceptively legitimate.", icon: Layers },
                { title: "Propagated Risk", desc: "Misinformation causes real harm in academic, medical, and media contexts before it's caught.", icon: Zap },
              ].map((item, i) => (
                <div key={i} className="glass rounded-[2rem] p-8 border-white/5 hover:border-destructive/20 transition-all duration-500">
                  <item.icon className="w-8 h-8 text-destructive mb-6" />
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground/40 leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* System Architecture */}
          <section className="container mx-auto px-6 py-32">
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="md:w-1/3">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-8 bg-primary/40" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Architecture</span>
                </div>
                <h2 className="text-4xl font-display font-medium tracking-tighter mb-8 leading-tight">
                  The <span className="text-primary italic">Verification Core</span>
                </h2>
                <p className="text-muted-foreground/60 leading-relaxed mb-12">
                  A multi-layer, real-time platform designed for maximum accuracy and zero-downtime reliability.
                </p>
                <div className="space-y-6">
                  {[
                    "Live Web Search via Tavily AI",
                    "Dynamic Trust Score Visualizer",
                    "Multi-LLM Fallback (Gemini/Groq)",
                    "Parallel Claim Verification"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 glass rounded-xl flex items-center justify-center border-white/5">
                        <span className="text-xs font-bold text-primary">{i+1}</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-2/3 w-full">
                <div className="glass rounded-[3rem] p-12 border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative z-10 grid gap-12">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 glass rounded-2xl border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">Web Dashboard</div>
                      <div className="p-4 glass rounded-2xl border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">Chrome Ext</div>
                      <div className="p-4 glass rounded-2xl border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">REST API</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="px-10 py-6 glass rounded-2xl border-primary/20 bg-primary/5 text-sm font-bold uppercase tracking-[0.4em] text-primary shadow-[0_0_30px_rgba(0,255,136,0.1)]">FastAPI Backend</div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Extraction Layer</div>
                        <div className="p-4 glass rounded-xl border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 text-center">Gemini 1.5 Flash</div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Verification Layer</div>
                        <div className="p-4 glass rounded-xl border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 text-center">Tavily AI Search</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6 py-40 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
            <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tighter mb-12 relative z-10">
              Ready to <span className="text-primary italic">Verify?</span>
            </h2>
            <Button asChild size="lg" className="h-20 px-16 text-md font-bold uppercase tracking-[0.2em] neon-glow-strong glass neon-border hover:bg-primary/10 relative z-10">
              <Link to="/analyse">Initialize First Node Analysis</Link>
            </Button>
            <div className="mt-16 text-[10px] font-sans font-extrabold text-muted-foreground/20 uppercase tracking-[0.4em] relative z-10">
              Developed by Saif ur Rahman | Neural Verification Node 2026
            </div>
          </section>
        </main>

        <footer className="relative z-10 py-12 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-lg font-display font-bold tracking-tight">TrustGuard <span className="text-primary">AI</span></span>
              </div>
              <div className="flex items-center gap-12">
                <a href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">Protocol</a>
                <a href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">Network</a>
                <a href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">Security</a>
                <a href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
