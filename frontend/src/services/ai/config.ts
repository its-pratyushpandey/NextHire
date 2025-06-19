export const AI_CONFIG = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: import.meta.env.VITE_API_URL,
    model: import.meta.env.VITE_AI_MODEL || 'gpt-4'
};