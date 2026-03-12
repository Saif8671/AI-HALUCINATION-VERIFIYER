import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Sparkles, Zap } from "lucide-react";

interface TextAnalyzerProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export const TextAnalyzer = ({ onAnalyze, isAnalyzing }: TextAnalyzerProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const exampleText = `According to a 2023 study published in Nature, climate change has increased global temperatures by 3.5°C since 1900. The research, led by Dr. James Mitchell of MIT, found that 78% of glaciers have melted completely. The paper titled "Global Climate Shift Analysis" was cited over 10,000 times.`;

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste AI-generated text here for verification..."
          className="relative min-h-[240px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none font-mono text-sm placeholder:text-muted-foreground/30 transition-all rounded-2xl p-6"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            {text.length} characters
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isAnalyzing}
          variant="hero"
          className="flex-1 h-12 text-base font-mono glow-on-hover relative overflow-hidden group"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 animate-spin" />
              <span className="animate-pulse">Synthesizing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Verify Integrity</span>
            </div>
          )}
        </Button>
        <Button
          onClick={() => setText(exampleText)}
          variant="outline"
          className="h-12 px-6 font-mono border-border/50 hover:bg-muted/50"
        >
          <Sparkles className="w-4 h-4 mr-2 text-accent" />
          Try Example
        </Button>
      </div>
    </div>
  );
};
