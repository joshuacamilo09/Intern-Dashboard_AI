import { useState } from "react";
import { Sparkles, Send, Loader2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useAiAnalysis } from "../../hooks/useAiAnalysis";

// Ensure Katex CSS is loaded for formula styling
import "katex/dist/katex.min.css";

export const AiInsightCard = () => {
  const [prompt, setPrompt] = useState("");
  const { analyze, response, loading } = useAiAnalysis();

  const handleSend = () => {
    if (!prompt.trim()) return;
    analyze(prompt);
    setPrompt("");
  };

  return (
    <div className="bg-[#16161E] rounded-xl shadow-lg border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center gap-2 text-white shadow-md">
        <Sparkles size={20} />
        <h3 className="font-semibold">SolveCode AI Business Analyst</h3>
      </div>

      {/* Chat/Response Area */}
      <div className="p-6 min-h-75 max-h-125 overflow-y-auto bg-[#0A0A0F]/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-indigo-400 py-10 text-center">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-medium animate-pulse">
              Analyzing sales, products, and inventory data...
            </p>
          </div>
        ) : response ? (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-indigo-500/20 p-2 rounded-lg h-fit border border-indigo-500/30">
              <Bot size={22} className="text-indigo-400" />
            </div>

            <div
              className="flex-1 text-gray-300 leading-relaxed overflow-x-auto
                            prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e1e2e]
                            prose-headings:text-white prose-strong:text-indigo-300 
                            prose-ul:list-disc prose-indigo max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {response}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <Bot size={40} className="text-gray-700 mb-4" />
            <p className="text-gray-500 italic max-w-xs text-sm">
              Hello! I'm your AI business intelligence. Ask me about sales
              forecasts, profit margins, or stock optimization.
            </p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-white/5 bg-[#16161E]">
        <div className="flex gap-3 bg-[#0A0A0F] p-1 rounded-xl border border-white/10 focus-within:border-indigo-500/50 transition-all">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What is my projected revenue for next month?"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-gray-600 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                       disabled:opacity-20 disabled:cursor-not-allowed transition-all 
                       flex items-center gap-2 font-medium"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInsightCard;
