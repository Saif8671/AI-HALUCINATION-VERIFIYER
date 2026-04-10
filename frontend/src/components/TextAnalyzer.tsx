import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Sparkles, Zap } from "lucide-react";

interface TextAnalyzerProps {
  onAnalyze: (text: string, sources?: string) => void;
  isAnalyzing: boolean;
}

export const TextAnalyzer = ({ onAnalyze, isAnalyzing }: TextAnalyzerProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const exampleText = `According to a 2023 study published in Nature, climate change has increased global temperatures by 3.5Â°C since 1900. The research, led by Dr. James Mitchell of MIT, found that 78% of glaciers have melted completely. The paper titled "Global Climate Shift Analysis" was cited over 10,000 times.`;

  return (
    <div className="space-y-12">
      <div className="grid gap-10">
        {/* Core AI Text Ingestion */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition duration-700" />
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ENTER AI-GENERATED CONTENT FOR INTEGRITY ANALYSIS..."
            className="relative min-h-[220px] bg-surface-container-lowest/80 backdrop-blur-md border-white/5 focus:border-primary/40 focus:ring-primary/10 resize-none font-sans text-base placeholder:text-muted-foreground/20 transition-all duration-500 rounded-2xl p-8 leading-relaxed shadow-2xl"
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-neon-hum shadow-[0_0_10px_hsl(var(--primary))]" />
            <span className="text-[10px] text-muted-foreground font-sans font-bold uppercase tracking-[0.2em] opacity-40">
              {text.length} BITS ANALYZED
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isAnalyzing}
          className="flex-1 h-16 text-sm font-sans font-bold uppercase tracking-[0.2em] neon-glow-strong glass neon-border hover:bg-primary/10 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
          {isAnalyzing ? (
            <div className="flex items-center gap-3 relative">
              <Zap className="w-5 h-5 animate-spin text-primary" />
              <span className="animate-pulse">Synthesizing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 relative">
              <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-500" />
              <span className="group-hover:text-primary transition-colors duration-500">Initialize Verification</span>
            </div>
          )}
        </Button>
        <Button
          onClick={() => setText(exampleText)}
          variant="outline"
          className="h-16 px-10 font-sans font-bold uppercase tracking-[0.2em] border-white/10 hover:bg-white/5 hover:border-primary/30 transition-all duration-500 glass rounded-xl"
        >
          <Sparkles className="w-4 h-4 mr-3 text-primary opacity-60" />
          Neural Sample
        </Button>
      </div>
    </div>
  );
};
