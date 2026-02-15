import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-14 h-14 overflow-hidden">
                <img src="/logo.png" alt="TrustGuard Logo" className="w-full h-full object-contain scale-125" />
              </div>
            </div>
            <div>
              <h1 className="font-mono font-bold text-xl text-foreground tracking-tight">
                TrustGuard
                <span className="text-primary">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                AI Hallucination Detector
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider">System Active</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
