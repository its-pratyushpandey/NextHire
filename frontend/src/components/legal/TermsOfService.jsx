import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { 
    Scale, FileText, Users, AlertCircle, Shield, 
    Check, Key, MessageSquare, Globe2, CreditCard,
    Server, Lock, Trash2, BadgeAlert, Gavel,
    Clock, Workflow, Building2, BookOpen, Mail,
    BellRing, Flag, Bookmark, Award
} from 'lucide-react';

const TermsOfService = () => {
    const sections = [
        {
            icon: <Scale className="h-6 w-6 text-purple-600" />,
            title: "Agreement Terms",
            content: [
                "By accessing NextHire, you agree to these terms and all applicable laws",
                "Must be at least 18 years old to use our services",
                "Account creation requires accurate information",
                "We reserve the right to modify terms with notice",
                "Changes become effective upon posting to the platform"
            ]
        },
        {
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            title: "User Responsibilities",
            content: [
                "Maintain accurate and updated account information",
                "Protect account credentials and confidentiality",
                "Report unauthorized account access immediately",
                "Comply with all applicable employment laws",
                "Respect intellectual property rights"
            ]
        },
        {
            icon: <Award className="h-6 w-6 text-green-500" />,
            title: "Premium Services",
            content: [
                "Subscription-based access to advanced features",
                "Transparent pricing with no hidden charges",
                "30-day satisfaction guarantee",
                "Automatic renewal with prior notification",
                "Enterprise customization options available"
            ]
        },
        {
            icon: <Flag className="h-6 w-6 text-amber-500" />,
            title: "Content Guidelines",
            content: [
                "Professional and appropriate job postings only",
                "Accurate representation of positions and companies",
                "No discriminatory or offensive content",
                "Compliance with equal opportunity laws",
                "Right to remove violating content"
            ]
        },
        {
            icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
            title: "Intellectual Property",
            content: [
                "Platform content is protected by copyright",
                "Limited license for personal use only",
                "No unauthorized reproduction or distribution",
                "User retains rights to submitted content",
                "Proper attribution requirements"
            ]
        },
        {
            icon: <Gavel className="h-6 w-6 text-red-500" />,
            title: "Dispute Resolution",
            content: [
                "Binding arbitration for dispute settlement",
                "Choice of law and jurisdiction",
                "Class action waiver provisions",
                "30-day notice requirement for claims",
                "Mediation before legal proceedings"
            ]
        },
        {
            icon: <BellRing className="h-6 w-6 text-pink-500" />,
            title: "Notifications",
            content: [
                "Important updates about your account",
                "Service changes and modifications",
                "Security alerts and warnings",
                "Marketing communications (optional)",
                "Legal notices and requirements"
            ]
        },
        {
            icon: <Bookmark className="h-6 w-6 text-orange-500" />,
            title: "Service Limitations",
            content: [
                "Platform availability and maintenance",
                "Third-party service dependencies",
                "Force majeure circumstances",
                "Usage restrictions and limits",
                "Account suspension conditions"
            ]
        }
    ];

    // Animation variants
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
                                <Scale className="h-16 w-16 text-purple-600" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-6 mb-2">
                            Terms of Service
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Shield className="h-4 w-4" />
                            <span>Please read these terms carefully</span>
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
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 transition-colors duration-300 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
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
                                                    className="mt-1"
                                                >
                                                    <Check className="h-4 w-4 text-green-500" />
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
                                Questions About Our Terms?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Contact our legal team at{' '}
                                <a 
                                    href="mailto:pratyush21072005@gmail.com" 
                                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                >
                                    pratyush21072005@gmail.com
                                </a>
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
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

export default TermsOfService;