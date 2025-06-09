import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUsers, 
    FiFilter, 
    FiSearch, 
    FiDownload, 
    FiRefreshCw, 
    FiBarChart2, 
    FiCheckCircle, 
    FiXCircle, 
    FiClock, 
    FiStar 
} from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import ApplicantDetailDialog from '../ApplicantDetailDialog';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('table');
    const [sortBy, setSortBy] = useState('newest');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shortlisted: 0,
        rejected: 0
    });
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const fetchAllApplicants = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            dispatch(setAllApplicants(res.data.job));
            updateStats(res.data.job.applications);
            toast.success('Applicants data refreshed successfully!');
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch applicants data');
        } finally {
            setIsLoading(false);
        }
    }

    const updateStats = (applications) => {
        const newStats = {
            total: applications?.length || 0,
            pending: applications?.filter(app => app.status === 'pending')?.length || 0,
            shortlisted: applications?.filter(app => app.status === 'shortlisted')?.length || 0,
            rejected: applications?.filter(app => app.status === 'rejected')?.length || 0
        };
        setStats(newStats);
    };

    // Improved status handler for lowercase status
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status: newStatus.toLowerCase() },
                { withCredentials: true }
            );
            const updatedApplications = applicants.applications.map(app => 
                app._id === applicationId ? { ...app, status: newStatus.toLowerCase() } : app
            );
            dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
            updateStats(updatedApplications);
            toast.success(`Application ${newStatus} successfully!`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update application status');
        }
    };

    // Handler for opening detail dialog
    const handleViewDetails = (applicant) => {
        setSelectedApplicant(applicant);
        setDetailDialogOpen(true);
    };

    useEffect(() => {
        fetchAllApplicants();
    }, []);

    const handleRefresh = () => {
        fetchAllApplicants();
    };

    const handleExport = () => {
        toast.success('Exporting applicants data...');
    };

    const statusStats = [
        { 
            label: 'Total', 
            count: stats.total, 
            icon: FiUsers, 
            color: 'blue',
            description: 'Total Applications'
        },
        { 
            label: 'Pending', 
            count: stats.pending, 
            icon: FiClock, 
            color: 'yellow',
            description: 'Awaiting Review'
        },
        { 
            label: 'Shortlisted', 
            count: stats.shortlisted, 
            icon: FiStar, 
            color: 'green',
            description: 'Selected Candidates'
        },
        { 
            label: 'Rejected', 
            count: stats.rejected, 
            icon: FiXCircle, 
            color: 'red',
            description: 'Not Selected'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster position="top-right" />
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
            >
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiUsers className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-800'>
                                    Applicants Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">Manage and review job applications</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <FiRefreshCw className="mr-2" />
                                Refresh
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <FiDownload className="mr-2" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {statusStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                                        <p className="text-xs text-gray-400">{stat.description}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                                        <stat.icon className={`text-xl text-${stat.color}-600`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="all">All Applications</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="relative">
                            <FiBarChart2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex justify-end mb-4">
                        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    viewMode === 'table' 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Table View
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Grid View
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center items-center h-64"
                            >
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ApplicantsTable 
                                    searchTerm={searchTerm}
                                    filterStatus={filterStatus}
                                    sortBy={sortBy}
                                    viewMode={viewMode}
                                    onStatusChange={handleStatusChange}
                                    onViewDetails={handleViewDetails}
                                />
                                <ApplicantDetailDialog 
                                    open={detailDialogOpen} 
                                    setOpen={setDetailDialogOpen} 
                                    applicant={selectedApplicant} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

export default Applicants