import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { 
    Shield, Lock, Database, Eye, Cookie, Bell, 
    UserCheck, Globe, Share2, History, Settings,
    Key, Mail, Fingerprint, CloudOff, Server,
    RefreshCw, MessageSquare, AlertCircle, ScrollText,
    Scale, BookOpen, Building2, BadgeCheck
} from 'lucide-react';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: <Lock className="h-6 w-6 text-purple-500" />,
            title: "Data Collection",
            content: [
                "Personal identification information (name, email, phone)",
                "Professional profile data (resume, skills, experience)",
                "Account security credentials",
                "Device and browser information",
                "Location data (optional with consent)"
            ]
        },
        {
            icon: <Server className="h-6 w-6 text-blue-500" />,
            title: "Data Storage & Security",
            content: [
                "End-to-end encryption for sensitive data",
                "Regular security audits and monitoring",
                "Multi-factor authentication options",
                "Automated threat detection systems",
                "Regular data backups and disaster recovery"
            ]
        },
        {
            icon: <Eye className="h-6 w-6 text-green-500" />,
            title: "Data Usage & Processing",
            content: [
                "AI-powered job matching algorithms",
                "Platform analytics and improvements",
                "Personalized career recommendations",
                "Fraud prevention and security measures",
                "Service optimization and customization"
            ]
        },
        {
            icon: <Share2 className="h-6 w-6 text-amber-500" />,
            title: "Information Sharing",
            content: [
                "Shared with employers upon application",
                "Third-party service providers",
                "Legal requirements compliance",
                "With explicit user consent only",
                "Anonymized statistical data"
            ]
        },
        {
            icon: <UserCheck className="h-6 w-6 text-indigo-500" />,
            title: "Your Privacy Rights",
            content: [
                "Access your personal data anytime",
                "Request data modification or deletion",
                "Control your privacy settings",
                "Export your data in portable format",
                "Manage communication preferences"
            ]
        },
        {
            icon: <Cookie className="h-6 w-6 text-pink-500" />,
            title: "Cookies & Tracking",
            content: [
                "Essential website functionality",
                "Performance and analytics data",
                "Personalization preferences",
                "Marketing cookies (optional)",
                "Third-party integrations"
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200
            }
        },
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header Section */}
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="inline-block"
                        >
                            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                                <Shield className="h-16 w-16 text-purple-600" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-6 mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Lock className="h-4 w-4" />
                            <span>Your privacy is our top priority</span>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover="hover"
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                                    >
                                        {section.icon}
                                    </motion.div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="pl-16">
                                    <ul className="space-y-3">
                                        {section.content.map((item, itemIndex) => (
                                            <motion.li
                                                key={itemIndex}
                                                variants={itemVariants}
                                                className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    className="mt-1.5"
                                                >
                                                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                                                </motion.div>
                                                <span>{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="mt-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Questions about our Privacy Policy?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Contact our privacy team at{' '}
                                <a 
                                    href="mailto:pratyush21072005@gmail.com" 
                                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                >
                                    pratyush21072005@gmail.com
                                </a>
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <RefreshCw className="h-4 w-4" />
                                <span>We typically respond within 24 hours</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;