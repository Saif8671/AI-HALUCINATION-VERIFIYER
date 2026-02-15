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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-float" />
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <img src="/logo.png" alt="Logo" className="w-4 h-4 rounded-sm" />
          <span className="text-sm font-mono text-primary">AI Safety Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-foreground mb-4 leading-tight">
          Detect AI
          <span className="text-gradient-primary"> Hallucinations</span>
          <br />
          <span className="text-muted-foreground">Before They Spread</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Verify AI-generated content in seconds. Cross-check facts, validate citations, 
          and identify potential misinformation with our intelligent analysis engine.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
