import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
      <div className="glass neon-border rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-700" />
            <img src="/logo.png" alt="TrustGuard AI Logo" className="w-12 h-12 object-contain relative transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight leading-none">
              TRU<span className="text-primary">ST</span>GUARD
            </h1>
            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-[0.2em] font-medium mt-0.5">
              Forensic AI Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            {["Analyze", "Methodology", "Documentation"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
          
          <div className="h-6 w-px bg-white/10 hidden md:block" />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 animate-neon-hum">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-wider">System Live</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

