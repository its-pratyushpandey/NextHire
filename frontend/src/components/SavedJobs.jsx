import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import Job from './Job';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight } from 'lucide-react';

import JobCard from './JobCard';

// Component for saved jobs section
const SavedJobsSection = () => {
    const navigate = useNavigate();
    const { savedJobs } = useSelector(state => state.auth.user);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000); // Simulate loading
    }, []);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                        <Bookmark className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                        Saved Jobs
                    </h2>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/saved-jobs')}
                    className="gap-2 group border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                    <span className="text-gray-700 dark:text-gray-300">View All</span>
                    <ArrowRight className="h-4 w-4 text-purple-500 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded-lg"></div>
                    ))
                ) : savedJobs?.length > 0 ? (
                    savedJobs?.slice(0, 4).map(job => (
                        <motion.div
                            key={job._id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-purple-800/50 hover:shadow-md transition-all duration-300"
                        >
                            <JobCard job={job} minimal />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 px-4">
                        <Bookmark className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No saved jobs yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Jobs you save will appear here
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSavedJobs(res.data.savedJobs);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Error fetching saved jobs');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSavedJobs();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please login to view saved jobs
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Saved Jobs ({savedJobs.length})
                </h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No saved jobs yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Browse jobs and save the ones you're interested in
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((savedJob) => (
                            <motion.div
                                key={savedJob._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Job job={savedJob.job} isSavedPage={true} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;