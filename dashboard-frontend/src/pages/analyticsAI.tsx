import { BrainCircuit, TrendingUp, Target } from "lucide-react";
import { AiInsightCard } from "../components/IA/AiInsightCard";
import "katex/dist/katex.min.css";

export const AiAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BrainCircuit className="text-indigo-400" size={32} />
          SolveCode AI
        </h1>
        <p className="text-gray-400 mt-2">
          Predictive analytics and business diagnostics based on your real data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: O Chat com IA */}
        <div className="lg:col-span-2">
          <AiInsightCard />
        </div>

        {/* Coluna da Direita: Sugestões de Prompt */}
        <div className="space-y-6">
          <div className="bg-[#16161E] border border-white/5 p-6 rounded-xl">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-400" />
              Suggestions for Analysis
            </h3>
            <div className="space-y-3">
              {[
                "What is my projected revenue for next month?",

                "Which products have the best profit margin?",

                "Identify customers at risk of churn (abandonment).",

                "How can I optimize my current inventory?",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="w-full text-left text-sm text-gray-400 p-3 rounded-lg border border-white/5 hover:bg-white/5 hover:text-white transition-all"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>

          {/* Card de Status da IA */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <TrendingUp size={20} />
              <span className="font-medium text-sm">IA connected</span>
            </div>
            <p className="text-xs text-indigo-200/60 leading-relaxed">
              SolveCode AI is processing your orders, products, and inventory in
              real time to generate accurate insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
