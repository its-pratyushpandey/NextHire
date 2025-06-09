import api from '../utils/axios-config';

export const getRecruiterStats = async () => {
    const response = await api.get('/recruiter/stats');
    return response.data;
};