import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, 
  Send, 
  Sparkles, 
  X, 
  Loader2, 
  Bot,
  User2, 
  Settings, 
  BookOpen, 
  RefreshCw, 
  Download,
  Share2, 
  Mic, 
  Video, 
  Monitor, 
  FileUp, 
  BarChart2, // Changed from ChartBar
  Brain, 
  Award, 
  Star
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { CHAT_MESSAGES, PREMIUM_FEATURES } from '@/constants/chatMessages';
import { Card } from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { getRandomResponse, detectMessageType } from '@/constants/supportMessages';
import { getResponse, detectMessageIntent } from '@/constants/chatResponses';

const PREMIUM_COLORS = {
  gradient: {
    from: 'from-violet-600',
    via: 'via-purple-600',
    to: 'to-indigo-600',
  },
  button: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
  hover: 'hover:from-violet-700 hover:via-purple-700 hover:to-violet-700',
  shadow: 'shadow-lg shadow-purple-500/20',
};

const LiveChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  const isRecruiter = user?.role === 'recruiter';

  // Get relevant message set based on user role
  const messageSet = isRecruiter ? CHAT_MESSAGES.recruiter : CHAT_MESSAGES.jobSeeker;

  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Welcome to our Premium AI Assistant! How can I help you ${isRecruiter ? 'with recruitment' : 'with your job search'} today?`,
        sender: 'ai',
        suggestions: getInitialSuggestions(),
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory([welcomeMessage]);
    }
    // Scroll to bottom when chat opens or messages update
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, chatHistory]);

  const getInitialSuggestions = () => {
    return isRecruiter
      ? ["Post a new job", "Screen candidates", "View analytics", "Improve hiring process"]
      : ["Find jobs", "Application help", "Interview prep", "Career advice"];
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Detect intent and get appropriate response
      const intent = detectMessageIntent(message);
      const responseData = getResponse(isRecruiter ? 'recruiter' : 'jobseeker', intent);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage = {
        id: Date.now(),
        text: responseData.text,
        sender: 'ai',
        intent,
        suggestions: responseData.suggestions,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message to chat
      const errorMessage = {
        id: Date.now(),
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        intent: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getRelevantSuggestions = (type) => {
    switch (type) {
      case 'job_search':
        return ['Search jobs', 'Filter results', 'Save searches'];
      case 'application':
        return ['Track status', 'Update resume', 'Application tips'];
      case 'technical':
        return ['Refresh page', 'Clear cache', 'Contact support'];
      case 'profile':
        return ['Edit profile', 'Upload photo', 'Add skills'];
      case 'recruiter':
        return ['Post job', 'View candidates', 'Premium features'];
      case 'account':
        return ['Settings', 'Security', 'Preferences'];
      case 'premium':
        return ['View plans', 'Compare features', 'Upgrade'];
      case 'feedback':
        return ['Rate us', 'Submit review', 'Suggest feature'];
      default:
        return getInitialSuggestions();
    }
  };

  // Premium UI Components
  const PremiumFeaturesBadge = () => (
    <div className="absolute -top-2 -right-2">
      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
        <Star className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    </div>
  );

  const ChatTools = () => (
    <div className="flex items-center gap-2 p-2 border-t dark:border-gray-700">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Mic className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Voice message</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Video call</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Monitor className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Screen share</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileUp className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share files</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <BarChart2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Analytics</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <TooltipProvider>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full ${PREMIUM_COLORS.button} ${PREMIUM_COLORS.shadow}`}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </Button>

          {isOpen && (
            <Card className="absolute bottom-16 right-0 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
              <div className="relative">
                <PremiumFeaturesBadge />
                
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/ai-assistant.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Premium AI Assistant</h3>
                      <p className="text-xs text-gray-500">Powered by GPT-4</p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] overflow-y-auto p-4">
                  {chatHistory.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} onSuggestionClick={setMessage} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                <ChatTools />

                <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask anything..."
                      className="flex-1"
                    />
                    <Button type="submit" className={PREMIUM_COLORS.button}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

// Add this component in LiveChatBox.jsx
const MessageCategory = ({ category }) => {
  const getCategoryColor = (cat) => {
    const colors = {
      job_posting: 'bg-blue-100 text-blue-700',
      candidates: 'bg-green-100 text-green-700',
      hiring: 'bg-purple-100 text-purple-700',
      analytics: 'bg-orange-100 text-orange-700',
      job_search: 'bg-indigo-100 text-indigo-700',
      application: 'bg-pink-100 text-pink-700',
      interview: 'bg-yellow-100 text-yellow-700',
      career: 'bg-teal-100 text-teal-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[cat] || colors.general;
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
      {category.replace('_', ' ').toUpperCase()}
    </span>
  );
};

// Update ChatMessage component to handle suggestions better
const ChatMessage = ({ message, onSuggestionClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
    >
      <div
        className={cn(
          "inline-block p-3 rounded-lg max-w-[80%]",
          message.sender === 'user'
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md"
        )}
      >
        {message.intent && <MessageCategory category={message.intent} />}
        <p className="text-sm mt-2 leading-relaxed">{message.text}</p>
        {message.suggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, i) => (
              <Badge
                key={i}
                className="cursor-pointer bg-purple-100 hover:bg-purple-200 
                          dark:bg-purple-900/30 dark:hover:bg-purple-800/50 
                          text-purple-700 dark:text-purple-300
                          transition-colors duration-200"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}
        <span className="text-xs opacity-50 mt-2 block">
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-2 mb-4">
    <Avatar className="h-8 w-8">
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>
    <motion.div
      className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
    </motion.div>
  </div>
);

export default LiveChatBox;