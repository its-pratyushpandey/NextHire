import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { getRecruiterStats } from '@/services/recruiter.service';
import { getSubscriptionStatus } from '@/services/subscription.service';
import {
  Building2, Trophy, Users, Briefcase, Mail, Phone, MapPin,
  Edit2, Save, Upload, Clock, Award, Target, Rocket, BarChart2,
  Shield, Crown, Globe, Sparkles, Star, GraduationCap, BookOpen,
  TrendingUp, Calendar, Link, Zap, Activity, UserCheck, ArrowUpRight,
  Plus, Settings2, ChevronRight, CheckCircle2, PieChart,
  MessageCircle, Share2, Download, LineChart, FileText, User2,
  BadgeCheck, Heart, Star as StarIcon, TrendingUp as TrendingUpIcon,
  Award as AwardIcon, Target as TargetIcon, Zap as ZapIcon,
  Briefcase as BriefcaseIcon, Users as UsersIcon, Globe as GlobeIcon,
  Shield as ShieldIcon, Crown as CrownIcon, Sparkles as SparklesIcon,
  CreditCard,
  Wallet,
  Bitcoin,
  QrCode,
  XCircle,
  Gift,
  Lock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from 'qrcode.react';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import { motion } from 'framer-motion';

const RecruiterProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');

  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    companyRole: user?.profile?.companyRole || 'Senior Technical Recruiter',
    expertise: user?.profile?.expertise || [],
    profilePhoto: user?.profile?.profilePhoto || '',
    linkedIn: user?.profile?.linkedIn || '',
    website: user?.profile?.website || '',
    specializations: user?.profile?.specializations || [],
    achievements: user?.profile?.achievements || [],
    stats: {
      totalHires: 0,
      activeJobs: 0,
      responseRate: 0,
      avgTimeToHire: 0,
      successfulPlacements: 0,
      candidatePool: 0,
      interviewSuccessRate: 0,
      retentionRate: 0,
      totalRevenue: 0,
      clientSatisfaction: 0,
      candidateSatisfaction: 0,
      timeToFill: 0,
      offerAcceptanceRate: 0,
      diversityHiringRate: 0,
      remoteHiringRate: 0,
      techHiringRate: 0
    },
    premium: {
      level: 'Elite',
      points: 0,
      nextLevel: 'Master',
      pointsToNextLevel: 2500,
      benefits: [
        'Advanced Analytics Dashboard',
        'Priority Support',
        'Custom Branding',
        'API Access',
        'Bulk Operations',
        'Advanced Search Filters',
        'Automated Workflows',
        'Custom Reports'
      ]
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await getRecruiterStats();
        setStats(response.stats);
        
        // Update profile stats with real data
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalHires: response.stats.overview.totalHires,
            activeJobs: response.stats.overview.activeJobs,
            responseRate: response.stats.overview.responseRate,
            avgTimeToHire: response.stats.overview.avgTimeToHire,
            successfulPlacements: response.stats.overview.totalHires,
            candidatePool: response.stats.overview.totalApplications,
            interviewSuccessRate: response.stats.overview.applicationToInterviewRate,
            retentionRate: response.stats.overview.interviewToHireRate
          }
        }));

        // Calculate profile completion
        const completion = calculateProfileCompletion();
        setProfileCompletion(completion);
      } catch (error) {
        console.error('Failed to fetch recruiter statistics:', error);
        setError('Failed to fetch recruiter statistics');
        toast.error('Failed to fetch recruiter statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(profileCompletion);
    }, 500);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  const calculateProfileCompletion = () => {
    const requiredFields = [
      'fullname',
      'email',
      'phoneNumber',
      'bio',
      'location',
      'companyRole',
      'profilePhoto',
      'specializations'
    ];

    const completedFields = requiredFields.filter(field => {
      if (field === 'specializations') {
        return profileData[field]?.length > 0;
      }
      return !!profileData[field];
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const handleSubscriptionSuccess = async () => {
    try {
      const response = await getSubscriptionStatus();
      setSubscriptionStatus(response.status);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        // Store the file in the profileData state
        setProfileData(prev => ({
          ...prev,
          profilePhoto: file
        }));
        toast.success('Profile photo selected. Click save to update your profile.');
      } catch (error) {
        console.error('Failed to handle photo upload:', error);
        toast.error('Failed to handle photo upload');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create FormData object
      const formData = new FormData();
      
      // Append all text fields
      formData.append('fullname', profileData.fullname);
      formData.append('email', profileData.email);
      formData.append('phoneNumber', profileData.phoneNumber);
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('companyRole', profileData.companyRole);
      formData.append('expertise', JSON.stringify(profileData.expertise));
      formData.append('specializations', JSON.stringify(profileData.specializations));
      formData.append('linkedIn', profileData.linkedIn);
      formData.append('website', profileData.website);

      // If there's a new profile photo, append it
      if (profileData.profilePhoto instanceof File) {
        formData.append('profile', profileData.profilePhoto);
      }

      const response = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update local state with new data
        setProfileData(prev => ({
          ...prev,
          ...response.data.user
        }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleDownload = () => {
    toast.success('Profile data downloaded successfully');
  };

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
          <p>{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const firstApplicant = stats?.applicants?.[0]; // or wherever your applicants are stored

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`w-40 h-40 rounded-full border-4 ${
                    subscriptionStatus === 'premium' ? 'border-purple-500' :
                    subscriptionStatus === 'elite' ? 'border-yellow-500' :
                    'border-gray-500'
                  } p-1`}>
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={profileData.profilePhoto || '/default-avatar.png'}
                        alt="Profile"
                        className="rounded-full"
                      />
                      <AvatarFallback className="text-2xl">
                        {profileData.fullname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {isEditing && (
                    <label
                      className={`absolute bottom-0 right-0 ${
                        subscriptionStatus === 'premium' ? 'bg-purple-600 hover:bg-purple-700' :
                        subscriptionStatus === 'elite' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-gray-600 hover:bg-gray-700'
                      } p-3 rounded-full cursor-pointer transition-colors`}
                    >
                      <Upload className="h-5 w-5 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <Badge className={`${
                      subscriptionStatus === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                      subscriptionStatus === 'elite' ? 'bg-gradient-to-r from-yellow-400 to-orange-600' :
                      'bg-gray-600'
                    } text-white px-4 py-1`}>
                      {subscriptionStatus === 'premium' ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-1" />
                          Premium Recruiter
                        </>
                      ) : subscriptionStatus === 'elite' ? (
                        <>
                          <Crown className="w-4 h-4 mr-1" />
                          Elite Recruiter
                        </>
                      ) : (
                        <>
                          <User2 className="w-4 h-4 mr-1" />
                          Free Recruiter
                        </>
                      )}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profileData.fullname}
                  </h2>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {profileData.companyRole}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 mr-3 text-purple-500" />
                    {profileData.email}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone className="w-5 h-5 mr-3 text-purple-500" />
                    {profileData.phoneNumber}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                    {profileData.location}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {!isEditing ? (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                    
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="w-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

           
          </div>

          {/* Right Column - Extended Profile */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className={`grid w-full grid-cols-3 ${
                subscriptionStatus === 'premium' ? 'bg-purple-100 dark:bg-purple-900/20' :
                subscriptionStatus === 'elite' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-gray-100 dark:bg-gray-800'
              }`}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                      <CardDescription>Professional summary and expertise</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">{profileData.bio}</p>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.specializations.map((spec) => (
                            <Badge
                              key={spec}
                              variant="secondary"
                              className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>Professional Network</CardTitle>
                      <CardDescription>Connect with me on professional platforms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.linkedIn && (
                          <a
                            href={profileData.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Link className="w-4 h-4 mr-2" />
                            LinkedIn Profile
                          </a>
                        )}
                        {profileData.website && (
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Portfolio Website
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Average Time to Hire</span>
                          <Badge variant="outline">{stats?.overview?.avgTimeToHire} days</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Response Rate</span>
                          <Badge variant="outline">{stats?.overview?.responseRate}%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Interview Success Rate</span>
                          <Badge variant="outline">{stats?.overview?.applicationToInterviewRate}%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Hire Rate</span>
                          <Badge variant="outline">{stats?.overview?.interviewToHireRate}%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                      <CardDescription>Monthly performance overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        {stats?.monthlyStats && stats.monthlyStats.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={stats.monthlyStats}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12 }}
                                tickLine={{ stroke: '#888' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                tickLine={{ stroke: '#888' }}
                              />
                              <RechartsTooltip />
                              <Area
                                type="monotone"
                                dataKey="applications"
                                name="Applications"
                                stroke="#8884d8"
                                fill="url(#colorEfficiency)"
                              />
                              <defs>
                                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats?.topPerformingJobs?.map((job, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Company: {job.company}</p>
                          <p className="text-sm text-gray-500">Applications: {job.applications}</p>
                          <p className="text-sm text-gray-500">Hires: {job.hires}</p>
                          <p className="text-sm text-gray-500">Conversion Rate: {job.conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Share Profile Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Profile</DialogTitle>
            <DialogDescription>
              Share your professional profile with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={`https://yourdomain.com/profile/${user?.id}`}
                readOnly
              />
              <Button onClick={() => {
                navigator.clipboard.writeText(`https://yourdomain.com/profile/${user?.id}`);
                toast.success('Profile link copied to clipboard');
              }}>
                Copy
              </Button>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share on LinkedIn
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Share via Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievement Modal */}
      <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Achievement Details</DialogTitle>
            <DialogDescription>
              {selectedAchievement?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className={`p-4 rounded-full ${
                selectedAchievement?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                selectedAchievement?.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                selectedAchievement?.color === 'green' ? 'bg-green-100 text-green-600' :
                selectedAchievement?.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                selectedAchievement?.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                selectedAchievement?.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                selectedAchievement?.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                'bg-cyan-100 text-cyan-600'
              }`}>
                {selectedAchievement?.icon && React.createElement(selectedAchievement.icon, {
                  className: "w-12 h-12"
                })}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{selectedAchievement?.name}</h3>
              <p className="text-gray-500 mt-2">Level: {selectedAchievement?.level}</p>
              <p className="text-gray-500">Points: {selectedAchievement?.points}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSuccess={handleSubscriptionSuccess}
      />

      {/* Edit Profile Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-purple-600" />
                Edit Profile
              </CardTitle>
              <CardDescription>
                Update your profile information to enhance your professional presence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={profileData.fullname}
                      onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="Enter your location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Role</Label>
                    <Input
                      value={profileData.companyRole}
                      onChange={(e) => setProfileData({ ...profileData, companyRole: e.target.value })}
                      placeholder="Enter your role"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn Profile</Label>
                    <Input
                      value={profileData.linkedIn}
                      onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
                      placeholder="Enter your LinkedIn URL"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expertise</Label>
                  <Select
                    value={profileData.expertise[0] || ''}
                    onValueChange={(value) => {
                      const newExpertise = [...profileData.expertise];
                      if (!newExpertise.includes(value)) {
                        newExpertise.push(value);
                      }
                      setProfileData({ ...profileData, expertise: newExpertise });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Recruitment</SelectItem>
                      <SelectItem value="executive">Executive Search</SelectItem>
                      <SelectItem value="contract">Contract Staffing</SelectItem>
                      <SelectItem value="campus">Campus Recruitment</SelectItem>
                      <SelectItem value="diversity">Diversity & Inclusion</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.expertise.map((exp) => (
                      <Badge
                        key={exp}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      >
                        {exp}
                        <button
                          onClick={() => {
                            setProfileData({
                              ...profileData,
                              expertise: profileData.expertise.filter((e) => e !== exp)
                            });
                          }}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <Input
                    value={profileData.specializations.join(', ')}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      specializations: e.target.value.split(',').map(s => s.trim())
                    })}
                    placeholder="Enter your specializations (comma-separated)"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default RecruiterProfile;