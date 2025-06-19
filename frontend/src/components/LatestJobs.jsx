import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
    Briefcase, 
    Building2, 
    MapPin, 
    Clock, 
    DollarSign,
    Users,
    Sparkles,
    GraduationCap,
    Rocket,
    ArrowRight,
    Star,
    Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);
    useGetAllJobs();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const renderJobLevel = (level) => {
        const levels = {
            'Entry Level': <GraduationCap className="h-4 w-4" />,
            'Mid Level': <Users className="h-4 w-4" />,
            'Senior Level': <Star className="h-4 w-4" />,
            'Expert': <Rocket className="h-4 w-4" />
        };
        return levels[level] || <Users className="h-4 w-4" />;
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">Latest Opportunities</span>
                        <Sparkles className="h-4 w-4" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                        Featured Job Openings
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Discover your next career move from our curated selection of premium opportunities 
                        with industry-leading companies
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {allJobs?.slice(0, 6)?.map((job) => (
                        <motion.div
                            key={job._id}
                            variants={itemVariants}
                            onHoverStart={() => setHoveredId(job._id)}
                            onHoverEnd={() => setHoveredId(null)}
                            className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 dark:from-purple-600/10 dark:to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="p-6 relative">
                                {/* Company Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <motion.div 
                                        className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]"
                                        animate={hoveredId === job._id ? { rotate: 360 } : {}}
                                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                    >
                                        <div className="h-full w-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <Building2 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </motion.div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {job?.company?.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                            <span>{job?.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {job?.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                        {job?.description}
                                    </p>

                                    {/* Job Metadata */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            <span>{job?.jobType}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <DollarSign className="h-4 w-4 text-green-500" />
                                            <span>{job?.salary} LPA</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            {renderJobLevel(job?.experienceLevel)}
                                            <span>{job?.experienceLevel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-4 w-4 text-purple-500" />
                                            <span>{format(new Date(job?.createdAt), 'MMM d')}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {job?.skills?.slice(0, 3).map((skill, index) => (
                                            <Badge 
                                                key={index}
                                                variant="secondary" 
                                                className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <motion.div 
                                    className="mt-6"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={() => navigate(`/description/${job._id}`)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-6"
                                    >
                                        <span>View Details</span>
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Button
                        onClick={() => navigate('/jobs')}
                        variant="outline"
                        className="group px-8 py-6 rounded-full border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                        <span>View All Opportunities</span>
                        <motion.span
                            className="inline-block ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </motion.span>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default LatestJobs;