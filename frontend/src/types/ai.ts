export interface AIAnalysisResult {
    matchScore: number;
    skills: string[];
    recommendations: string[];
    experience: {
        years: number;
        relevance: number;
    };
}