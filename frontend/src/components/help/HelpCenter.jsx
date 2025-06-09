import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import { 
    Book,
    MessageCircle,
    Mail,
    Search,
    ChevronRight,
    CheckCircle2,
    Shield,
    Lightbulb,
    Users,
    Settings,
    HelpCircle,
    FileText,
    PhoneCall,
    Send,
    Globe,
    AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import LiveChatBox from './LiveChatBox';
import AIErrorBoundary from '../ai/AIErrorBoundary';
import AIAssistant from '../ai/AIAssistant';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        {
            icon: <Book className="h-6 w-6 text-purple-500" />,
            title: "Getting Started",
            description: "Learn the basics of NextHire",
            articles: [
                "Creating your profile",
                "Job search tips",
                "Application process",
                "Account setup guide"
            ]
        },
        {
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            title: "Privacy & Security",
            description: "Keep your account secure",
            articles: [
                "Privacy settings",
                "Account security",
                "Data protection",
                "Password management"
            ]
        },
        {
            icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
            title: "Tips & Best Practices",
            description: "Maximize your success",
            articles: [
                "Resume optimization",
                "Interview preparation",
                "Profile visibility",
                "Job search strategies"
            ]
        },
        {
            icon: <Settings className="h-6 w-6 text-green-500" />,
            title: "Technical Support",
            description: "Resolve technical issues",
            articles: [
                "Common issues",
                "System requirements",
                "Browser compatibility",
                "Mobile app support"
            ]
        }
    ];

    const handleEmailSupport = async () => {
        setIsLoading(true);
        try {
            // Simulate email support request
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Support ticket created! We will respond within 24 hours.', {
                description: "Check your email for confirmation"
            });
            window.location.href = "mailto:pratyush21072005@gmail.com?subject=Support%20Request";
        } catch (error) {
            toast.error('Failed to create support ticket. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatMessage = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const newMessage = {
            sender: 'user',
            text: chatMessage,
            timestamp: new Date().toLocaleTimeString()
        };

        setChatHistory([...chatHistory, newMessage]);
        setChatMessage('');

        // Simulate support response
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = {
                sender: 'support',
                text: "Thanks for reaching out! Our support team will assist you shortly.",
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, response]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
                {/* AI Assistant on the left (desktop only) */}
                <div className="hidden md:block md:w-1/4 sticky top-28 self-start">
                    <AIErrorBoundary>
                        
                    </AIErrorBoundary>
                </div>
                {/* Main Help Center Content */}
                <div className="flex-1">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            How can we help you?
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            Find answers, documentation, and support from our team
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search help articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Help Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-4">{category.icon}</div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {category.description}
                                    </p>
                                    <ul className="space-y-2 mt-auto">
                                        {category.articles.map((article, idx) => (
                                            <motion.li 
                                                key={idx}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                {article}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Support Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Support */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Mail className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Email Support
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get help via email
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleEmailSupport}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin">↻</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Live Chat */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Live Chat
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Chat with our support team
                                    </p>
                                </div>
                            </div>
                            {!showChat ? (
                                <Button
                                    onClick={() => setShowChat(true)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Start Chat
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        {chatHistory.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`mb-2 ${
                                                    msg.sender === 'user' ? 'text-right' : 'text-left'
                                                }`}
                                            >
                                                <div
                                                    className={`inline-block p-2 rounded-lg ${
                                                        msg.sender === 'user'
                                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    <p className="text-sm">{msg.text}</p>
                                                    <p className="text-xs opacity-50">{msg.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleChatMessage} className="flex gap-2">
                                        <Input
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <AIErrorBoundary>
                <LiveChatBox />
            </AIErrorBoundary>
        </div>
    );
};

export default HelpCenter;