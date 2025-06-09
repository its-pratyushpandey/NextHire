import axios from 'axios';
import { AI_API_END_POINT } from '@/utils/constant';
import { AI_CONFIG } from './config';

const aiApiClient = axios.create({
    baseURL: AI_API_END_POINT,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
    }
});

export const aiApiService = {
    analyzeResume: async (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        const response = await aiApiClient.post('/analyze-resume', formData);
        return response.data;
    }
};