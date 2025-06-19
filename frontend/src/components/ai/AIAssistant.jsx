import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, X, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIChat } from '@/contexts/AIChatProvider';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const recognitionRef = useRef(null);
  const { messages, addMessage, isTyping, setIsTyping } = useAIChat();

  // Voice recognition setup
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  // AI chat handler
  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage({ role: 'user', content: input });
    setIsTyping(true);
    setInput('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      addMessage({ role: 'assistant', content: data.reply || 'Sorry, I could not generate a response.' });
    } catch (e) {
      addMessage({ role: 'assistant', content: 'Error: Could not reach AI service.' });
    } finally {
      setIsTyping(false);
    }
  };

  // Video call placeholder
  const startVideo = () => {
    setIsVideo(true);
    // Integrate with WebRTC or a service like Twilio for real video chat
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-all"
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        style={{ display: open ? 'none' : 'block' }}
      >
        <Mic size={28} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
            style={{ minHeight: 420, maxHeight: 600 }}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <span className="font-bold text-lg text-purple-600">AI Assistant</span>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={startVideo} title="Start Video Call">
                  <Video />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)} title="Close">
                  <X />
                </Button>
              </div>
            </div>
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-xl px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-purple-100 dark:border-purple-900'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-2 bg-white dark:bg-gray-700 border border-purple-100 dark:border-purple-900 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>AI is typing...</span>
                  </div>
                </div>
              )}
            </div>
            {/* Input area */}
            <div className="flex items-center gap-2 p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
              <Button size="icon" variant={isListening ? 'secondary' : 'ghost'} onClick={startListening} title="Voice Input">
                <Mic className={isListening ? 'animate-pulse text-pink-500' : ''} />
              </Button>
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 outline-none"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
              />
              <Button onClick={sendMessage} disabled={isTyping || !input.trim()}>
                <Send />
              </Button>
            </div>
            {/* Video call modal (placeholder) */}
            <AnimatePresence>
              {isVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl flex flex-col items-center">
                    <Video size={48} className="text-purple-600 mb-4" />
                    <p className="text-lg font-semibold mb-2">Video Call Coming Soon</p>
                    <p className="text-gray-500 mb-4">Video chat will be available in a future update.</p>
                    <Button onClick={() => setIsVideo(false)}>Close</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
