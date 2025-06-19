export const AI_CONFIG = {
    enabled: import.meta.env.VITE_AI_FEATURES_ENABLED === 'true',
    model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
    basePrompt: `I am an AI assistant specializing in:
- Career guidance
- Job searching
- Resume building
- Interview preparation`
};

export const validateAIConfig = () => {
    if (!AI_CONFIG.enabled) {
        throw new Error('AI features are not enabled');
    }
    return true;
};