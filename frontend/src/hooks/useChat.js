import { useState, useCallback } from 'react';
import { getResponse, detectMessageIntent } from '@/constants/chatResponses';

export const useChat = (isRecruiter) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message) => {
    setChatHistory(prev => [...prev, {
      id: Date.now(),
      ...message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  const handleUserMessage = useCallback(async (messageText) => {
    // Add user message
    addMessage({
      text: messageText,
      sender: 'user'
    });

    setIsTyping(true);

    try {
      const intent = detectMessageIntent(messageText);
      const response = getResponse(isRecruiter ? 'recruiter' : 'jobseeker', intent);

      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));

      addMessage({
        text: response.text,
        sender: 'ai',
        intent,
        suggestions: response.suggestions
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        intent: 'error'
      });
    } finally {
      setIsTyping(false);
    }
  }, [isRecruiter, addMessage]);

  return {
    chatHistory,
    isTyping,
    handleUserMessage,
    addMessage
  };
};