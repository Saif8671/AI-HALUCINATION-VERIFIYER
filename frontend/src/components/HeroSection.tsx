import { Shield, Zap, Eye, CheckCircle2 } from "lucide-react";

export const HeroSection = () => {
  const features = [
    { icon: Eye, text: "Claim Detection" },
    { icon: CheckCircle2, text: "Source Verification" },
    { icon: Zap, text: "Instant Analysis" },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="star-field" />
      
      {/* Mesh Gradient Blobs */}
      <div className="mesh-gradient">
        <div className="mesh-blob w-[500px] h-[500px] bg-primary/20 -top-20 -left-20 animate-float" />
        <div className="mesh-blob w-[400px] h-[400px] bg-accent/20 bottom-0 right-0 animate-float" style={{ animationDelay: '-3s' }} />
        <div className="mesh-blob w-[300px] h-[300px] bg-purple-500/10 top-1/4 right-1/4 animate-pulse-glow" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-float">
          <img src="/logo.png" alt="TrustGuard AI Logo" className="w-6 h-6 rounded-full object-contain" />
          <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">Verified AI Safety</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-foreground mb-4 leading-[1.1] tracking-tighter">
          Detect AI
          <span className="text-gradient block md:inline"> Hallucinations</span>
          <br />
          <span className="text-muted-foreground/60">Before They Spread</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed font-light">
          Verify AI-generated content in seconds. High-fidelity fact-checking, 
          citation validation, and misinformation detection powered by advanced AI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="glass px-6 py-3 rounded-xl flex items-center gap-3 glass-hover group"
            >
              <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-mono font-medium text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
