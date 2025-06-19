import OpenAI from "openai";
import { OPENAI_CONFIG } from "../../config/openai.config";
import { generateLocalResponse } from './localAI';

const openai = new OpenAI({
    apiKey: OPENAI_CONFIG.apiKey,
    dangerouslyAllowBrowser: true
});

export const generateAIResponse = async (message: string, context: any) => {
    try {
        if (!OPENAI_CONFIG.apiKey) {
            throw new Error('OpenAI API key is not configured');
        }

        const completion = await openai.chat.completions.create({
            model: OPENAI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: OPENAI_CONFIG.basePrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: OPENAI_CONFIG.temperature,
            max_tokens: OPENAI_CONFIG.maxTokens
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
        console.error('AI Service Error:', error);
        if (!OPENAI_CONFIG.apiKey) {
            throw new Error('AI is not available. Please set your OpenAI API key.');
        }
        throw new Error(error.message || 'Failed to generate AI response');
    }
};