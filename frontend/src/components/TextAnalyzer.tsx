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
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste AI-generated text here for verification..."
          className="min-h-[200px] bg-muted/30 border-border focus:border-primary/50 resize-none font-mono text-sm placeholder:text-muted-foreground/50"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {text.length} chars
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isAnalyzing}
          variant="hero"
          className="flex-1"
        >
          {isAnalyzing ? (
            <>
              <Zap className="w-5 h-5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verify Content
            </>
          )}
        </Button>
        <Button
          onClick={() => setText(exampleText)}
          variant="outline"
          className="font-mono"
        >
          <Sparkles className="w-4 h-4" />
          Try Example
        </Button>
      </div>
    </div>
  );
};
