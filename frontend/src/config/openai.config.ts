export const OPENAI_CONFIG = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 500,
    basePrompt: `You are a professional job portal AI assistant helping with:
- Career guidance
- Job search strategies
- Resume optimization
- Interview preparation`
};

export const validateOpenAIConfig = () => {
    if (!OPENAI_CONFIG.apiKey) {
        throw new Error('OpenAI API key is not configured');
    }
    return true;
};