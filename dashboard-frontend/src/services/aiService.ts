import api from "./api";

export interface AiAnalysisResponse {
  analysis: string;
}

export const aiService = {
  getDeepAnalysis: async (message: string): Promise<AiAnalysisResponse> => {
    // Aqui usamos o 'api' que exportaste do teu ficheiro de configuração
    const { data } = await api.post<AiAnalysisResponse>("/ai/deep-analysis", {
      message,
    });
    return data;
  },
};

export default aiService;