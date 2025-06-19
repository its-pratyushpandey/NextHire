import { useLocation } from 'react-router-dom';
import { pageSuggestions } from '@/config/aiSuggestions';

export const useAIPageSuggestions = () => {
  const location = useLocation();
  return pageSuggestions[location.pathname] || pageSuggestions.default;
};