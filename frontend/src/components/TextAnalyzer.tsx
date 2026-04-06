import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Shield, Sparkles, Zap, Link as LinkIcon, FileUp, Loader2, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TextAnalyzerProps {
  onAnalyze: (text: string, sources?: string) => void;
  isAnalyzing: boolean;
  onExtractUrl: (url: string) => Promise<string>;
  onExtractPdf: (file: File) => Promise<string>;
}

export const TextAnalyzer = ({ onAnalyze, isAnalyzing, onExtractUrl, onExtractPdf }: TextAnalyzerProps) => {
  const [text, setText] = useState("");
  const [sources, setSources] = useState("");
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text.trim(), sources.trim());
    }
  };

  const handleUrlExtract = async () => {
    if (!url.trim()) return;
    setIsExtracting(true);
    try {
      const extractedText = await onExtractUrl(url.trim());
      setSources((prev) => prev + (prev ? "\n\n" : "") + `--- SOURCE URL: ${url} ---\n` + extractedText);
      setUrl("");
      toast({ title: "Neural Ingestion Complete", description: "URL content successfully parsed and added to context." });
    } catch (error: any) {
      toast({ title: "Ingestion Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid Protocol", description: "Only PDF artifacts are supported for neural ingestion.", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    try {
      const extractedText = await onExtractPdf(file);
      setSources((prev) => prev + (prev ? "\n\n" : "") + `--- SOURCE FILE: ${file.name} ---\n` + extractedText);
      toast({ title: "Artifact Digested", description: `PDF context from ${file.name} added to analysis.` });
    } catch (error: any) {
      toast({ title: "Digestion Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const exampleText = `According to a 2023 study published in Nature, climate change has increased global temperatures by 3.5°C since 1900. The research, led by Dr. James Mitchell of MIT, found that 78% of glaciers have melted completely. The paper titled "Global Climate Shift Analysis" was cited over 10,000 times.`;

  return (
    <div className="space-y-12">
      <div className="grid gap-10">
        {/* Core AI Text Ingestion */}
        <div className="relative group">
          <div className="absolute -top-4 left-6 px-3 bg-[#0a0a0a] border-x border-white/5 z-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/60">Target Neural Stream</span>
          </div>
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

        {/* Source Protocol Ingestion */}
        <div className="relative group">
          <div className="absolute -top-4 left-6 px-3 bg-[#0a0a0a] border-x border-white/5 z-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Verification Sources (Optional)</span>
          </div>
          <Textarea
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            placeholder="PASTE SUPPORTING FACTS OR UPLOAD BELOW..."
            className="relative min-h-[120px] bg-white/[0.02] border-white/5 focus:border-primary/20 focus:ring-0 resize-none font-sans text-sm placeholder:text-muted-foreground/10 transition-all duration-500 rounded-xl p-6 leading-relaxed"
          />
          
          {/* Neural Ingestion Toolbar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="PROVENANCE URL..."
                className="h-9 bg-black/40 border-white/5 focus:border-primary/20 text-[11px] font-sans pr-20 rounded-lg"
              />
              <Button
                onClick={handleUrlExtract}
                disabled={!url.trim() || isExtracting}
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-7 text-[9px] uppercase tracking-wider text-primary hover:bg-primary/10"
              >
                {isExtracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <LinkIcon className="w-3 h-3 mr-1.5" />}
                Fetch
              </Button>
            </div>
            <div className="h-4 w-px bg-white/5" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              size="sm"
              variant="ghost"
              className="h-9 glass border-white/5 text-[9px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-all rounded-lg px-4"
            >
              {isExtracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3 mr-2" />}
              Digest PDF
            </Button>
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
          onClick={() => {
            setText(exampleText);
            setSources("James Mitchell is a climate scientist. Glaciers are melting at high rates in some regions, though 78% of all glaciers globally is an exaggeration.");
          }}
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


