import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../shared/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { format } from 'date-fns';
import { 
    Building2, Plus, Search, Briefcase, Users, Globe2, TrendingUp,
    LayoutGrid, LayoutList, Filter, SlidersHorizontal, Settings2,
    ArrowUpRight, BarChart2, Target, Award, ClipboardCheck, 
    MapPin, Calendar, DollarSign, UserCheck, Shield, Zap,
    BookOpen, Rocket, Star, Download, Share2,
    Crown, AlertCircle, Loader2, FileSpreadsheet, PieChart,
    Activity, TrendingDown, CheckCircle2, MessageSquare, RefreshCw,
    Clock, Sparkles, LineChart
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


const QuickActionButton = ({ icon: Icon, label, onClick, loading }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            border border-gray-200 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-800
            transition-all duration-200
            ${loading ? 'opacity-75 cursor-wait' : ''}
        `}
    >
        {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
        ) : (
            <Icon className="h-4 w-4 text-purple-500" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </motion.button>
);

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        status: 'all',
        size: 'all',
        location: 'all',
        industry: 'all'
    });
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    const filteredAndSortedCompanies = useMemo(() => {
        let filtered = [...companies];

        if (input) {
            filtered = filtered.filter(company => 
                company.name.toLowerCase().includes(input.toLowerCase()) ||
                company.location?.toLowerCase().includes(input.toLowerCase()) ||
                company.industry?.toLowerCase().includes(input.toLowerCase())
            );
        }

        if (activeFilters.status !== 'all') {
            filtered = filtered.filter(company => company.status === activeFilters.status);
        }
        if (activeFilters.size !== 'all') {
            filtered = filtered.filter(company => {
                const employeeCount = company.employees || 0;
                switch (activeFilters.size) {
                    case 'small': return employeeCount < 50;
                    case 'medium': return employeeCount >= 50 && employeeCount < 250;
                    case 'large': return employeeCount >= 250;
                    default: return true;
                }
            });
        }
        if (activeFilters.location !== 'all') {
            filtered = filtered.filter(company => 
                company.location?.toLowerCase().includes(activeFilters.location.toLowerCase())
            );
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'alphabetical':
                    return a.name.localeCompare(b.name);
                case 'most-jobs':
                    return (b.jobs?.length || 0) - (a.jobs?.length || 0);
                case 'most-employees':
                    return (b.employees || 0) - (a.employees || 0);
                default:
                    return 0;
            }
        });
    }, [companies, input, activeFilters, sortBy]);

    const stats = useMemo(() => ({
        totalCompanies: companies.length,
        activeJobs: companies.reduce((acc, company) => acc + (company.jobs?.length || 0), 0),
        totalEmployees: companies.reduce((acc, company) => acc + (company.employees || 0), 0),
        growthRate: '+15%',
        averageHiring: `${Math.round(companies.reduce((acc, company) => 
            acc + (company.monthlyHires || 0), 0) / companies.length || 0)}/month`,
        responseRate: `${Math.round(companies.reduce((acc, company) => 
            acc + (company.responseRate || 0), 0) / companies.length || 95)}%`,
    }), [companies]);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const csvContent = [
                ['Company Name', 'Location', 'Employees', 'Active Jobs', 'Created Date'],
                ...filteredAndSortedCompanies.map(company => [
                    company.name,
                    company.location || 'N/A',
                    company.employees || 0,
                    company.jobs?.length || 0,
                    format(new Date(company.createdAt), 'MMM dd, yyyy')
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `companies-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success('Companies data exported successfully');
        } catch (error) {
            toast.error('Failed to export companies data');
        } finally {
            setIsExporting(false);
        }
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            await dispatch(useGetAllCompanies());
            toast.success('Data refreshed successfully');
        } catch (error) {
            toast.error('Failed to refresh data');
        } finally {
            setIsLoading(false);
        }
    };

    const filterOptions = {
        status: ['all', 'active', 'inactive', 'pending'],
        size: ['all', 'small', 'medium', 'large'],
        location: ['all', 'remote', 'onsite', 'hybridru'],
        industry: ['all', 'technology', 'healthcare', 'finance', 'education', 'other']
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            
          

            <div className="max-w-7xl mx-auto px-4 py-8">
               

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                                Company Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage and optimize your company listings efficiently
                            </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => navigate("/admin/companies/create")}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Company
                            </Button>
                        </motion.div>
                    </div>

                   
                </motion.div>

                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <StatsCard
                        icon={Building2}
                        title="Total Companies"
                        value={stats.totalCompanies}
                        trend="+12%"
                        color="blue"
                    />
                    <StatsCard
                        icon={Briefcase}
                        title="Active Jobs"
                        value={stats.activeJobs}
                        trend="+8%"
                        color="purple"
                    />
                    <StatsCard
                        icon={Users}
                        title="Total Employees"
                        value={stats.totalEmployees}
                        trend="+15%"
                        color="green"
                    />
                    <StatsCard
                        icon={TrendingUp}
                        title="Growth Rate"
                        value={stats.growthRate}
                        trend="+5%"
                        color="amber"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10"
                                placeholder="Search companies..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                                    <SelectItem value="most-jobs">Most Jobs</SelectItem>
                                    <SelectItem value="most-employees">Most Employees</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                            <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                   
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                >
                                   <LayoutList className="h-4 w-4" />
                                </Button>
                                
                            </div>

                           
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    <FilterSection 
                        activeFilters={activeFilters} 
                        setActiveFilters={setActiveFilters} 
                        filterOptions={filterOptions} 
                    />
                </AnimatePresence>

                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        "grid gap-6",
                        viewMode === 'grid' 
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1"
                    )}
                >
                    {filteredAndSortedCompanies.map((company) => (
                        <CompanyCard 
                            key={company._id} 
                            company={company} 
                            onNavigate={() => navigate(`/admin/companies/${company._id}`)} 
                        />
                    ))}
                </motion.div>

                {filteredAndSortedCompanies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No companies yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Get started by adding your first company
                        </p>
                        <Button
                            onClick={() => navigate("/admin/companies/create")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Add Company  
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, title, value, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br from-${color}-500 to-${color}-600`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <Badge variant="secondary" className={`flex items-center gap-1 text-${color}-600`}>
                <TrendingUp className="h-3 w-3" />
                {trend}
            </Badge>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {title}
        </p>
    </motion.div>
);

const FilterSection = ({ activeFilters, setActiveFilters, filterOptions }) => (
    <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-4"
    >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key}>
                    <label className="text-sm font-medium mb-2 block capitalize">
                        {key}
                    </label>
                    <Select 
                        value={activeFilters[key]} 
                        onValueChange={(value) => setActiveFilters(prev => ({ ...prev, [key]: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${key}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    <div className="flex items-center gap-2">
                                        <FilterIcon type={key} option={option} />
                                        <span className="capitalize">{option}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(activeFilters).map(([key, value]) => 
                value !== 'all' && (
                    <Badge 
                        key={key}
                        className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        variant="secondary"
                    >
                        {key}: {value}
                        <button 
                            className="ml-2"
                            onClick={() => setActiveFilters(prev => ({ ...prev, [key]: 'all' }))}
                        >
                            ×
                        </button>
                    </Badge>
                )
            )}
        </div>
    </motion.div>
);

const FilterIcon = ({ type, option }) => {
    switch (type) {
        case 'status':
            return option === 'active' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : option === 'inactive' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
                <Clock className="h-4 w-4 text-yellow-500" />
            );
        case 'size':
            return option === 'small' ? (
                <Users className="h-4 w-4 text-blue-500" />
            ) : option === 'medium' ? (
                <Building2 className="h-4 w-4 text-purple-500" />
            ) : (
                <Building2 className="h-4 w-4 text-orange-500" />
            );
        case 'location':
            return <MapPin className="h-4 w-4 text-indigo-500" />;
        case 'industry':
            return <Briefcase className="h-4 w-4 text-cyan-500" />;
        default:
            return <Building2 className="h-4 w-4" />;
    }
};

const CompanyCard = ({ company, onNavigate }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: '0 8px 32px 0 rgba(80, 0, 120, 0.25)' }}
        className="group cursor-pointer relative"
        onClick={onNavigate}
    >
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#1a1333] dark:to-[#2d2250] rounded-2xl shadow-xl border-2 border-transparent group-hover:border-purple-400 dark:group-hover:border-pink-500 p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-lg"
                >
                    <div className="h-full w-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-12 w-12 rounded object-cover shadow-md"
                            />
                        ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                </motion.div>
                <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-pink-400 tracking-tight">
                        {company.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        {company.location || 'Location not specified'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                        {company.jobs?.length || 0} Jobs
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                        {company.employees || 0} Employees
                    </span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1">
                    <Activity className="h-4 w-4 text-purple-500" />
                    {company.activeJobs || 0} active jobs
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {format(new Date(company.createdAt), 'MMM dd, yyyy')}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <Button
                    variant="gradient"
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-200 px-6 py-2 rounded-full"
                    onClick={e => { e.stopPropagation(); onNavigate(); }}
                >
                    <Sparkles className="h-4 w-4 mr-1 text-yellow-300" />
                    View Details
                </Button>
                <Badge 
                    variant="secondary" 
                    className={cn(
                        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold px-3 py-1 rounded-full",
                        company.status === 'inactive' && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    )}
                >
                    {company.status || 'Active'}
                </Badge>
            </div>
        </div>
    </motion.div>
);

export default Companies;