import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIChatContextType {
    messages: Array<any>;
    addMessage: (message: any) => void;
    clearMessages: () => void;
    isTyping: boolean;
    setIsTyping: (typing: boolean) => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const useAIChat = () => {
    const context = useContext(AIChatContext);
    if (context === undefined) {
        throw new Error('useAIChat must be used within an AIChatProvider');
    }
    return context;
};

interface Props {
    children: ReactNode;
}

export const AIChatProvider: React.FC<Props> = ({ children }) => {
    const [messages, setMessages] = useState<Array<any>>([]);
    const [isTyping, setIsTyping] = useState(false);

    const addMessage = (message: any) => {
        setMessages(prev => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <AIChatContext.Provider value={{
            messages,
            addMessage,
            clearMessages,
            isTyping,
            setIsTyping
        }}>
            {children}
        </AIChatContext.Provider>
    );
};