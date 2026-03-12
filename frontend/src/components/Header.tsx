import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 overflow-hidden rounded-full border border-primary/20 bg-background/50 flex items-center justify-center">
                <img src="/logo.png" alt="TrustGuard AI Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
            </div>
            <div>
              <h1 className="font-mono font-bold text-xl text-foreground tracking-tight">
                TrustGuard
                <span className="text-primary ml-1">AI</span>
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
