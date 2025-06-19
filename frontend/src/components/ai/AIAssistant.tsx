import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateAIResponse } from '@/services/ai/chatService';

const AIAssistant = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setLoading(true);
    setError(null);
    try {
      const aiText = await generateAIResponse(input, {});
      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I could not process your request.' }]);
      setError(err.message || 'AI is not available. Please check your API key or try again later.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
        <div className="mb-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded p-2">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <span className={msg.sender === 'user' ? 'text-blue-600' : 'text-purple-600'}>
                {msg.sender === 'user' ? 'You: ' : 'AI: '}
              </span>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            className="flex-1 border rounded px-2 py-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded" disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
