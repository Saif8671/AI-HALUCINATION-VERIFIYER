import { Shield, Zap, Eye, CheckCircle2 } from "lucide-react";

export const HeroSection = () => {
  const features = [
    { icon: Eye, text: "Forensic Detection" },
    { icon: CheckCircle2, text: "Source Verification" },
    { icon: Zap, text: "Real-time Analysis" },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="star-field" />
      
      {/* Luminous Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[100px] animate-float" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-neon-hum">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-muted-foreground">
              v1.5 Premium Forensic Engine
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-[0.9] tracking-tighter">
            VERIFY <span className="text-primary neon-glow">AI</span>
            <br />
            <span className="text-muted-foreground/40">REALITY.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-sans font-light">
            An ethereal intelligence layer designed to identify hallucinations, 
            validate citations, and ensure mathematical certainty in AI outputs.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="glass neon-border px-6 py-3 rounded-xl flex items-center gap-3 glass-hover group"
              >
                <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-foreground">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

