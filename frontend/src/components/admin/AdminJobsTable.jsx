import React, { useEffect, useState } from 'react'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { 
    Edit2, Eye, MoreHorizontal, Briefcase, Calendar, Users, Clock,
    MapPin, DollarSign, Award, Star, Archive, Trash2, TrendingUp,
    Bell, Mail, Download, Share2, Bookmark, Shield, BarChart2,
    CheckCircle2, AlertCircle, Building2, GraduationCap, Plus,
    FileSpreadsheet, Filter, RefreshCcw, Settings, Search, PieChart,
    TrendingDown, UserCheck, Target, Zap, Sparkles,
    BellRing, X, Loader2, User2
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'react-hot-toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"
import { Button } from '../ui/button';

const AdminJobsTable = () => { 
    const dispatch = useDispatch();
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const [timeRange, setTimeRange] = useState('week');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDeleting, setIsDeleting] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { 
        filterJobsList();
    }, [allAdminJobs, searchQuery, statusFilter, searchJobByText]);

    const filterJobsList = () => {
        let filtered = [...allAdminJobs];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(job => 
                job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(job => {
                switch (statusFilter) {
                    case 'active':
                        return job.status === 'active';
                    case 'paused':
                        return job.status === 'paused';
                    case 'closed':
                        return job.status === 'closed';
                    default:
                        return true;
                }
            });
        }

        // Search by text from Redux
        if (searchJobByText) {
            filtered = filtered.filter(job =>
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        }

        setFilterJobs(filtered);
    };

    const getJobPriorityBadge = (applications = 0) => {
        if (applications > 20) return (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" /> High Demand
            </Badge>
        );
        if (applications > 10) return (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <TrendingUp className="w-3 h-3 mr-1" /> Growing
            </Badge>
        );
        return (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Target className="w-3 h-3 mr-1" /> New
            </Badge>
        );
    }

    const getDashboardStats = () => {
        const totalApplications = filterJobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
        const activeJobs = filterJobs.length;
        const avgApplications = Math.round(totalApplications / activeJobs) || 0;
        return { totalApplications, activeJobs, avgApplications };
    }

    const stats = getDashboardStats();

    const handleDeleteJob = async (jobId) => {
        try {
            setIsDeleting(true);
            console.log('Attempting to delete job:', jobId);
            
            const res = await axios.delete(`${JOB_API_END_POINT}/${jobId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                const updatedJobs = filterJobs.filter(job => job._id !== jobId);
                setFilterJobs(updatedJobs);
                toast.success('Job deleted successfully');
            } else {
                throw new Error(res.data.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', {
                error: error.message,
                response: error.response?.data,
                status: error.response?.status,
                jobId: jobId
            });
            
            if (error.response) {
                if (error.response.status === 403) {
                    toast.error('You do not have permission to delete this job. Please make sure you are the job creator.');
                } else if (error.response.status === 404) {
                    toast.error('Job not found');
                } else if (error.response.status === 401) {
                    toast.error('Please login to delete jobs');
                } else {
                    toast.error(error.response.data?.message || 'Failed to delete job');
                }
            } else if (error.request) {
                toast.error('No response from server. Please try again.');
            } else {
                toast.error(error.message || 'An error occurred while deleting the job');
            }
        } finally {
            setIsDeleting(false);
            setJobToDelete(null);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
        >
            {/* Dashboard Header */}
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl shadow-lg">
                            <Briefcase className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Recruiter Dashboard
                            </h2>
                            <p className="text-gray-500 flex items-center">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Manage your job listings
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl
                                     flex items-center space-x-2 shadow-lg hover:shadow-blue-500/30 transition-all"
                            onClick={() => navigate('/admin/jobs/create')}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Post New Job</span>
                        </motion.button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Jobs</p>
                                <h3 className="text-2xl font-bold">{stats.activeJobs}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Briefcase className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Applications</p>
                                <h3 className="text-2xl font-bold">{stats.totalApplications}</h3>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Avg. Applications</p>
                                <h3 className="text-2xl font-bold">{stats.avgApplications}</h3>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <BarChart2 className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs..."
                                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Jobs Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <Table>
                        <TableCaption className="text-base font-medium">
                            Your Active Job Listings
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-700">
                                <TableHead className="font-semibold">Company</TableHead>
                                <TableHead className="font-semibold">Position</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Posted Date</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterJobs?.map((job) => (
                                <motion.tr
                                    key={job._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    className="border-b border-gray-100 dark:border-gray-700"
                                >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                                <AvatarFallback>{job?.company?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{job?.company?.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1" /> {job?.location}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-medium">{job?.title}</p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Badge variant="outline" className="flex items-center">
                                                    <DollarSign className="w-3 h-3 mr-1" />
                                                    {job?.salary} LPA
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {job?.jobType}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getJobPriorityBadge(job?.applications?.length)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{new Date(job?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="cursor-pointer"
                                                    >
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </motion.div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-48 p-2">
                                                    <div className="space-y-2">
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                                                        >
                                                            <Button
                                                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
                                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                            >
                                                                <User2 className="w-4 h-4 mr-1" />
                                                                View Applicants
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            onClick={() => navigate(`/admin/companies/${job._id}`)}
                                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                                                        >
                                                            <Edit2 className="w-4 h-4 text-green-500" />
                                                            <span>Edit Listing</span>
                                                        </motion.div>
                                                        
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            onClick={() => setJobToDelete(job._id)}
                                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>Delete</span>
                                                        </motion.div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipProvider>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </motion.div>
            </div>

            <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the job listing
                            and all associated applications.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    )
}

const AppliedJobTable = ({ appliedJobs }) => {
    return (
        <div>
            <Table>
                <TableCaption>Your Applied Jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs?.length > 0 ? (
                        appliedJobs.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.company}</TableCell>
                                <TableCell>{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                                <TableCell>{job.status}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No applications found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
export { AppliedJobTable };