import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Rocket,
    Linkedin,
    Github,
    Mail,
    HeartHandshake,
    Building2,
    Shield,
    ExternalLink,
    MessageSquare,
    Briefcase,
    Globe2,
    Phone,
    MapPin,
    ChevronRight 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        jobSeekers: [
            { 
                label: "Browse Jobs", 
                href: "/browse",
                icon: <Briefcase className="h-4 w-4 text-purple-500" />
            },
            { 
                label: "Saved Jobs", 
                href: "/saved-jobs",
                icon: <HeartHandshake className="h-4 w-4 text-pink-500" />
            }
        ],
        employers: [
            { 
                label: "Post Jobs", 
                href: "/admin/jobs/create",
                icon: <Building2 className="h-4 w-4 text-blue-500" />
            },
            { 
                label: "Find Talent", 
                href: "/admin/companies",
                icon: <Globe2 className="h-4 w-4 text-green-500" />
            }
        ],
        contact: [
            { 
                label: "pratyush21072005@gmail.com",
                href: "mailto:pratyush21072005@gmail.com",
                icon: <Mail className="h-4 w-4 text-indigo-500" />
            },
            {
                label: "+91 75629 20811",
                href: "tel:+917562920811",
                icon: <Phone className="h-4 w-4 text-emerald-500" />
            },
            {
                label: "KL University, Andhra Pradesh",
                href: "https://www.google.com/maps/place/KL+University,+Andhra+Pradesh",
                icon: <MapPin className="h-4 w-4 text-red-500" />
            }
        ],
        legal: [
            { 
                label: "Privacy Policy", 
                href: "/privacy-policy",  // Make sure this matches your route path
                icon: <Shield className="h-4 w-4 text-purple-500" />
            },
            { 
                label: "Terms of Service", 
                href: "/terms-of-service",  // Make sure this matches your route path
                icon: <Shield className="h-4 w-4 text-blue-500" />
            }
        ]
    };

    const socialLinks = [
        { 
            icon: <Linkedin className="h-5 w-5" />, 
            href: "https://linkedin.com/in/pratyush-pandey1",
            color: "bg-[#0077B5] hover:bg-[#006399]",
            label: "LinkedIn"
        },
        { 
            icon: <Github className="h-5 w-5" />, 
            href: "https://github.com/its-pratyushpandey",
            color: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700",
            label: "GitHub"
        },
        { 
            icon: <Mail className="h-5 w-5" />, 
            href: "mailto:pratyush21072005@gmail.com",
            color: "bg-purple-500 hover:bg-purple-600",
            label: "Email"
        }
        
    ];

    const FooterLinkSection = ({ title, links }) => (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
            </h3>
            <ul className="space-y-3">
                {links.map((link, index) => (
                    <motion.li 
                        key={index}
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-2"
                    >
                        {link.isExternal ? (
                            <a 
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                {link.icon}
                                <span className="text-sm group-hover:translate-x-1 transition-transform">
                                    {link.label}
                                </span>
                                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </a>
                        ) : (
                            <Link 
                                to={link.href}
                                className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                {link.icon}
                                <span className="text-sm group-hover:translate-x-1 transition-transform">
                                    {link.label}
                                </span>
                                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                        )}
                    </motion.li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="relative bg-white dark:bg-gray-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block group">
                            <motion.div 
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                            >
                                <Rocket className="h-6 w-6 text-purple-600" />
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                    Next<span className="text-[#F83002]">Hire</span>
                                </h2>
                            </motion.div>
                        </Link>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 rounded-full text-white ${social.color}`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    <FooterLinkSection title="For Job Seekers" links={footerLinks.jobSeekers} />
                    <FooterLinkSection title="For Employers" links={footerLinks.employers} />
                    <FooterLinkSection title="Contact Us" links={footerLinks.contact} />
                   
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                            © {currentYear} NextHire by Pratyush Pandey              All rights reserved.
                        </p>
                        
                        <div className="flex items-center gap-6">
                            <Link to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                                Terms of Service
                            </Link>
                            <Badge 
                                variant="outline" 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                            >
                                <Shield className="h-3 w-3 mr-1" />
                                Premium
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
