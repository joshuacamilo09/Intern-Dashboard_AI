import { useState } from "react";
import { aiService } from "../services/aiService";

export const useAiAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await aiService.getDeepAnalysis(message);
      setResponse(data.analysis);
    } catch (err: any) {
      console.error("Erro na análise profunda:", err);
      setError(
        "Não foi possível obter a análise da IA. Tenta novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return { analyze, response, loading, error };
};
