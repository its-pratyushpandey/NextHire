import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Search, 
    Briefcase, 
    Building2, 
    MapPin, 
    Filter, 
    SlidersHorizontal,
    LayoutGrid,
    LayoutList,
    Loader2,
    ArrowUpDown,
    Stars,
    Clock
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState(allJobs)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState('all')
    const [experienceLevel, setExperienceLevel] = useState('all');
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
        setLoading(false)
    }, [allJobs, searchedQuery])

    // Sort jobs based on selected option
    useEffect(() => {
        const sortedJobs = [...filterJobs]
        switch (sortBy) {
            case 'salary-high':
                sortedJobs.sort((a, b) => b.salary - a.salary)
                break
            case 'salary-low':
                sortedJobs.sort((a, b) => a.salary - b.salary)
                break
            case 'newest':
                sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            default:
                break
        }
        setFilterJobs(sortedJobs)
    }, [sortBy])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <Navbar />
            
            {/* Hero Section */}
           

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
                    {showFilters && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FilterCard />
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Jobs Grid/List Section */}
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="h-8 w-8 text-purple-500" />
                                </motion.div>
                            </div>
                        ) : filterJobs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center"
                            >
                                <Search className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No jobs found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Try adjusting your search or filter criteria to find more opportunities
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2' : ''} gap-6`}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job._id}
                                        variants={itemVariants}
                                        className={`h-full ${viewMode === 'list' ? 'max-w-3xl mx-auto' : ''}`}
                                    >
                                        <Job job={job} viewMode={viewMode} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs