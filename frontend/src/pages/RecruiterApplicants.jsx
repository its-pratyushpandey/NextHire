import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Mail, User2, Briefcase, Filter, Search, Download, RefreshCw, Star, Clock, CheckCircle2, XCircle } from 'lucide-react';
import FullScreenChat from '@/components/chat/FullScreenChat';
import { toast } from 'sonner';
import NextChat from './NextChat';
import ApplicantDetailDialog from '@/components/ApplicantDetailDialog';

const statusStatsIcons = {
  total: User2,
  pending: Clock,
  shortlisted: Star,
  rejected: XCircle,
  hired: CheckCircle2
};

const RecruiterApplicants = () => {
  const { user } = useSelector(store => store.auth);
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });
  const [detailApplicant, setDetailApplicant] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/recruiter/applicants', { withCredentials: true });
        setApplicants(res.data.applicants || []);
      } catch (err) {
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  useEffect(() => {
    // Filter and search logic
    let data = applicants;
    if (filterStatus !== 'all') {
      data = data.filter(app => app.status === filterStatus);
    }
    if (searchTerm) {
      data = data.filter(app =>
        app.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFiltered(data);

    // Stats calculation
    setStats({
      total: applicants.length,
      pending: applicants.filter(app => app.status === 'pending').length,
      shortlisted: applicants.filter(app => app.status === 'shortlisted').length,
      rejected: applicants.filter(app => app.status === 'rejected').length,
      hired: applicants.filter(app => app.status === 'hired').length
    });
  }, [applicants, searchTerm, filterStatus]);

  const handleExport = () => {
    toast.success('Exporting applicants data...');
    // Implement export logic here
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Accept/Reject handler
  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await axios.put(`/api/v1/application/status/${applicantId}`, { status: newStatus }, { withCredentials: true });
      setApplicants(prev => prev.map(app => app._id === applicantId ? { ...app, status: newStatus } : app));
      toast.success(`Application ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Applicants Dashboard</h1>
            <p className="text-sm text-gray-500">Manage and review your job applications</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <Card key={key} className="shadow-md">
              <CardContent className="flex flex-col items-center py-4">
                {React.createElement(statusStatsIcons[key], { className: "w-6 h-6 mb-2 text-purple-500" })}
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-gray-500 capitalize">{key}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">No applicants found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(applicant => (
              <Card key={applicant._id} className="shadow-lg hover:shadow-2xl transition">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={applicant.profilePhoto || '/default-avatar.png'} />
                    <AvatarFallback>
                      {applicant.fullname?.[0] || <User2 />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{applicant.fullname}</CardTitle>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {applicant.email}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {applicant.appliedJobTitle}
                    </div>
                    <div className="text-xs mt-1">
                      <span className={`px-2 py-1 rounded-full text-white ${applicant.status === 'pending' ? 'bg-yellow-500' : applicant.status === 'shortlisted' ? 'bg-green-500' : applicant.status === 'rejected' ? 'bg-red-500' : applicant.status === 'hired' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                        {applicant.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
                      onClick={() => {
                        setDetailApplicant(applicant);
                        setDetailOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleStatusChange(applicant._id, 'accepted')}
                        disabled={applicant.status === 'accepted'}
                      >
                        Accept
                      </Button>
                      <Button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleStatusChange(applicant._id, 'rejected')}
                        disabled={applicant.status === 'rejected'}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
                    onClick={() => window.location.href = `/nextchat?candidateId=${applicant._id}`}
                  >
                    Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Premium Applicant Detail Dialog */}
      <ApplicantDetailDialog open={detailOpen} setOpen={setDetailOpen} applicant={detailApplicant} />
      <FullScreenChat
        open={showChat}
        onClose={() => setShowChat(false)}
        candidateId={user._id}
        recruiterId={recruiterId} // recruiter for this job
        userId={user._id}
        userRole={user.role}
        otherUser={{
          avatar: recruiter?.profilePhoto,
          name: recruiter?.fullname,
          role: 'recruiter'
        }}
      />
    </div>
  );
};

export default RecruiterApplicants;