import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Briefcase,
    MapPin,
    Building2,
    DollarSign,
    Clock,
    Filter,
    BookMarked,
    GraduationCap,
    Target,
    Rocket,
    Sparkles,
    ArrowUpDown,
    LayoutGrid,
    LayoutList,
    SlidersHorizontal
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import SearchBar from './ui/search-bar';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        location: 'all',
        experience: 'all',
        salary: 'all',
        jobType: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Filter options
    const locations = ['All Locations', 'Remote', 'On-Site', 'Hybrid'];
    const experiences = ['All Levels', 'Entry Level', 'Mid Level', 'Senior Level', 'Expert'];
    const salaryRanges = ['All Ranges', '0-3 LPA', '3-7 LPA', '7-15 LPA', '15+ LPA'];
    const jobTypes = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'];

    useEffect(() => {
        let result = [...allJobs];

        // Search filter
        if (searchTerm) {
            result = result.filter(job => 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.location !== 'all') {
            result = result.filter(job => job.location === filters.location);
        }
        if (filters.experience !== 'all') {
            result = result.filter(job => job.experienceLevel === filters.experience);
        }
        if (filters.salary !== 'all') {
            // Implement salary range filtering logic
        }
        if (filters.jobType !== 'all') {
            result = result.filter(job => job.jobType === filters.jobType);
        }

        // Apply sorting
        switch (sortBy) {
            case 'salary-high':
                result.sort((a, b) => b.salary - a.salary);
                break;
            case 'salary-low':
                result.sort((a, b) => a.salary - b.salary);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setFilteredJobs(result);
    }, [allJobs, searchTerm, filters, sortBy]);

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
            transition: { duration: 0.3 }
        }
    };

    const recentSearches = [
        "Frontend Developer",
        "React Native",
        "UI/UX Designer",
        "Product Manager"
    ];

    const popularSearches = [
        "Software Engineer",
        "Data Scientist",
        "DevOps Engineer",
        "Full Stack Developer"
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
                <div className="relative max-w-7xl mx-auto px-4 py-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Browse Open Positions
                        </h1>
                        <p className="text-lg text-gray-200 mb-8">
                            Find your perfect role from {filteredJobs.length} open positions
                        </p>

                        {/* Premium Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <SearchBar
                                onSearch={(term) => {
                                    setSearchTerm(term);
                                    dispatch(setSearchedQuery(term));
                                }}
                                placeholder="Search by job title, company, or keywords..."
                                variant="hero"
                                recentSearches={recentSearches}
                                popularSearches={popularSearches}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Controls Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 space-y-4"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* View Toggle */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="w-10 h-10 p-0"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="w-10 h-10 p-0"
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Sorting and Filters */}
                        <div className="flex items-center gap-4">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Newest First</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="salary-high">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpDown className="h-4 w-4" />
                                            <span>Salary (High to Low)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="salary-low">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpDown className="h-4 w-4" />
                                            <span>Salary (Low to High)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Location Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Location
                                        </label>
                                        <Select 
                                            value={filters.location} 
                                            onValueChange={(value) => setFilters({...filters, location: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc) => (
                                                    <SelectItem key={loc} value={loc.toLowerCase()}>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{loc}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Experience Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Experience Level
                                        </label>
                                        <Select 
                                            value={filters.experience} 
                                            onValueChange={(value) => setFilters({...filters, experience: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select experience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {experiences.map((exp) => (
                                                    <SelectItem key={exp} value={exp.toLowerCase()}>
                                                        <div className="flex items-center gap-2">
                                                            <GraduationCap className="h-4 w-4" />
                                                            <span>{exp}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Salary Range Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Salary Range
                                        </label>
                                        <Select 
                                            value={filters.salary} 
                                            onValueChange={(value) => setFilters({...filters, salary: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select salary range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salaryRanges.map((range) => (
                                                    <SelectItem key={range} value={range.toLowerCase()}>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>{range}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Job Type Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Job Type
                                        </label>
                                        <Select 
                                            value={filters.jobType} 
                                            onValueChange={(value) => setFilters({...filters, jobType: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jobTypes.map((type) => (
                                                    <SelectItem key={type} value={type.toLowerCase()}>
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase className="h-4 w-4" />
                                                            <span>{type}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Active Filter Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {Object.entries(filters).map(([key, value]) => 
                                        value !== 'all' && (
                                            <Badge 
                                                key={key}
                                                className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                                variant="secondary"
                                            >
                                                {value}
                                                <button 
                                                    className="ml-2"
                                                    onClick={() => setFilters({...filters, [key]: 'all'})}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Jobs Grid/List */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}
                >
                    {filteredJobs.map((job) => (
                        <motion.div
                            key={job._id}
                            variants={itemVariants}
                            className="h-full"
                        >
                            <Job job={job} viewMode={viewMode} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredJobs.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No jobs found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Browse;