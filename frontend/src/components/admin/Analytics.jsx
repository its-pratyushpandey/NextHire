import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../shared/Navbar';
import {
    BarChart3, TrendingUp, Users, Activity,
    Target, Calendar, Filter, Download,
    RefreshCw, Building2, BriefcaseIcon,
    UserCheck, Clock, TrendingDown, Sparkles,
    DollarSign, MapPin, Layers, Award,
    GraduationCap, Star, Settings, ChevronDown, PieChart
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie,
    Cell, BarChart, Bar, Legend
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const Analytics = () => {
    const { user } = useSelector(state => state.auth);
    const { allAdminJobs } = useSelector(state => state.job);
    const [timeRange, setTimeRange] = useState('month');
    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState('overview');

    const getApplicationTrends = useMemo(() => {
        if (!allAdminJobs?.length) return [];
        
        const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
         const today = new Date();
        
        // Create an array of dates and initialize counts
        const dateMap = new Map();
        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = subDays(today, i);
            const formattedDate = format(date, 'MMM dd');
            dateMap.set(formattedDate, 0);
        }

        // Count applications for each date
        allAdminJobs.forEach(job => {
            if (job.applications?.length) {
                job.applications.forEach(app => {
                    try {
                        const appDate = new Date(app.createdAt);
                        // Check if date is valid
                        if (!isNaN(appDate.getTime())) {
                            const formattedDate = format(appDate, 'MMM dd');
                            if (dateMap.has(formattedDate)) {
                                dateMap.set(formattedDate, dateMap.get(formattedDate) + 1);
                            }
                        }
                    } catch (error) {
                        console.warn('Invalid date encountered:', app.createdAt);
                    }
                });
            }
        });

        // Convert map to array format for chart
        return Array.from(dateMap.entries()).map(([date, count]) => ({
            date,
            applications: count
        }));
    }, [allAdminJobs, timeRange]);

    const getJobCategories = useMemo(() => {
        if (!allAdminJobs?.length) return [];

        const categories = allAdminJobs.reduce((acc, job) => {
            const category = job.category || 'Other';
            const applications = job.applications?.length || 0;
            
            if (!acc[category]) {
                acc[category] = {
                    name: category,
                    jobs: 1,
                    applications,
                    value: 1
                };
            } else {
                acc[category].jobs += 1;
                acc[category].applications += applications;
                acc[category].value += 1;
            }
            return acc;
        }, {});

        return Object.values(categories)
            .sort((a, b) => b.applications - a.applications)
            .map(cat => ({
                ...cat,
                percentage: Math.round((cat.jobs / allAdminJobs.length) * 100)
            }));
    }, [allAdminJobs]);

    const analyticsData = useMemo(() => {
        const jobs = allAdminJobs || [];
        const currentDate = new Date();
        const startDate = subDays(currentDate, timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90);

        const activeJobs = jobs.filter(job => job.status === 'active').length;
        const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
        const recentApplications = jobs.filter(job => {
            try {
                const jobDate = new Date(job.createdAt);
                return !isNaN(jobDate.getTime()) && jobDate >= startDate;
            } catch {
                return false;
            }
        }).length;

        return {
            overview: {
                totalJobs: jobs.length,
                activeJobs,
                totalApplications,
                recentApplications,
                avgTimeToHire: 15,
                successRate: totalApplications > 0 
                    ? Math.round((activeJobs / totalApplications) * 100) 
                    : 0
            },
            trends: {
                applications: getApplicationTrends,
                categories: getJobCategories,
                salaryRanges: {}
            },
            topPerforming: {
                jobs: [],
                categories: []
            }
        };
    }, [allAdminJobs, timeRange, getApplicationTrends, getJobCategories]);

    const chartConfig = {
        colors: {
            primary: '#8b5cf6',
            secondary: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        },
        gradients: {
            area: {
                id: 'areaGradient',
                colors: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0)']
            },
            pie: {
                id: 'pieGradient',
                colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            }
        }
    };

    const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                    <p className={`text-${color}-500 text-sm flex items-center mt-1`}>
                        {parseFloat(trend) >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {trend}
                    </p>
                </div>
                <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
            </div>
        </motion.div>
    );

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Analytics data refreshed');
        } catch (error) {
            toast.error('Failed to refresh analytics');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Recruitment Analytics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Track your recruitment performance and insights
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">This Quarter</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleRefresh}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Active Jobs"
                        value={analyticsData.overview.activeJobs}
                        trend={((analyticsData.overview.activeJobs / analyticsData.overview.totalJobs) * 100).toFixed(1) + '%'}
                        icon={BriefcaseIcon}
                        color="blue"
                    />
                    <MetricCard
                        title="Total Applications"
                        value={analyticsData.overview.totalApplications}
                        trend="+8%"
                        icon={Users}
                        color="purple"
                    />
                    <MetricCard
                        title="Success Rate"
                        value={`${analyticsData.overview.successRate}%`}
                        trend="+5%"
                        icon={Target}
                        color="green"
                    />
                    <MetricCard
                        title="Avg. Time to Hire"
                        value={`${analyticsData.overview.avgTimeToHire} days`}
                        trend="-2 days"
                        icon={Clock}
                        color="amber"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Application Trends Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-500" />
                                <h3 className="text-lg font-semibold">Application Trends</h3>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                {timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'Last 90 days'}
                            </Badge>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={getApplicationTrends}>
                                <defs>
                                    <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                />
                                <YAxis 
                                    tick={{ fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="applications"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="url(#applicationGradient)"
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Job Categories Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-blue-500" />
                                <h3 className="text-lg font-semibold">Job Categories</h3>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                {getJobCategories.length} Categories
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ResponsiveContainer width="100%" height={200}>
                                <RechartsPieChart>
                                    <Pie
                                        data={getJobCategories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {getJobCategories.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={`hsl(${index * 60}, 70%, 60%)`}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                            <div className="space-y-4">
                                {getJobCategories.map((category, index) => (
                                    <div key={category.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }} 
                                            />
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">{category.jobs} jobs</span>
                                            <Badge variant="outline">
                                                {category.applications} applications
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;