import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
      <div className="glass neon-border rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-700" />
            <img src="/logo.png" alt="TrustGuard AI Logo" className="w-10 h-10 object-contain relative transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight leading-none group-hover:text-primary transition-colors">
              TRU<span className="text-primary group-hover:text-white transition-colors">ST</span>GUARD
            </h1>
            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-[0.2em] font-medium mt-0.5">
              Forensic AI Intelligence
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link
              to="/analyse"
              className={`text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === '/analyse' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Analyse
            </Link>
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

