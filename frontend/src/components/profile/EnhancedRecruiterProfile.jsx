import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
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
  Shield as ShieldIcon, Crown as CrownIcon, Sparkles as SparklesIcon
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
import { cn } from "@/lib/utils";

// Premium animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const premiumBadges = [
  { name: 'Certified Professional Recruiter', icon: ShieldIcon, color: 'blue', level: 'Expert', points: 1000 },
  { name: 'Top Employer 2024', icon: Trophy, color: 'yellow', level: 'Elite', points: 2000 },
  { name: 'Diversity Champion', icon: UsersIcon, color: 'green', level: 'Advanced', points: 1500 },
  { name: 'Tech Recruitment Expert', icon: Rocket, color: 'purple', level: 'Master', points: 1800 },
  { name: 'Global Talent Scout', icon: GlobeIcon, color: 'indigo', level: 'Elite', points: 2500 },
  { name: 'Rapid Response Award', icon: ZapIcon, color: 'orange', level: 'Advanced', points: 1200 },
  { name: 'Candidate Experience Champion', icon: Heart, color: 'pink', level: 'Expert', points: 1600 },
  { name: 'Innovation Leader', icon: SparklesIcon, color: 'cyan', level: 'Master', points: 2200 }
];

const specializationOptions = [
  'Technical Hiring',
  'Executive Search',
  'Remote Talent',
  'International Recruitment',
  'IT Recruitment',
  'Digital & Marketing',
  'Sales & Business Development',
  'Healthcare & Medical',
  'Finance & Banking',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Product Management',
  'Data Science',
  'Cybersecurity',
  'Blockchain',
  'Mobile Development',
  'UX/UI Design',
  'DevOps & SRE',
  'Quality Assurance',
  'Project Management'
];

const performanceData = [
  { month: 'Jan', applications: 45, hires: 8, efficiency: 75, interviews: 25, offers: 12 },
  { month: 'Feb', applications: 52, hires: 10, efficiency: 78, interviews: 30, offers: 15 },
  { month: 'Mar', applications: 61, hires: 12, efficiency: 82, interviews: 35, offers: 18 },
  { month: 'Apr', applications: 58, hires: 11, efficiency: 80, interviews: 32, offers: 16 },
  { month: 'May', applications: 75, hires: 15, efficiency: 85, interviews: 40, offers: 20 },
  { month: 'Jun', applications: 85, hires: 18, efficiency: 88, interviews: 45, offers: 22 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

const EnhancedRecruiterProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [progressValue, setProgressValue] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

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
      totalHires: 145,
      activeJobs: 12,
      responseRate: '94%',
      avgTimeToHire: '15 days',
      successfulPlacements: 89,
      candidatePool: 1200,
      interviewSuccessRate: 85,
      retentionRate: 92,
      totalRevenue: '$1.2M',
      clientSatisfaction: 98,
      candidateSatisfaction: 95,
      timeToFill: '18 days',
      offerAcceptanceRate: 92,
      diversityHiringRate: 45,
      remoteHiringRate: 60,
      techHiringRate: 75
    },
    premium: {
      level: 'Elite',
      points: 12500,
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
    },
    recentActivity: [
      { type: 'hire', candidate: 'John Doe', position: 'Senior Developer', date: '2024-03-15' },
      { type: 'interview', candidate: 'Jane Smith', position: 'Product Manager', date: '2024-03-14' },
      { type: 'offer', candidate: 'Mike Johnson', position: 'DevOps Engineer', date: '2024-03-13' },
      { type: 'screening', candidate: 'Sarah Wilson', position: 'UX Designer', date: '2024-03-12' }
    ],
    upcomingInterviews: [
      { candidate: 'Alex Brown', position: 'Frontend Developer', time: '10:00 AM', date: '2024-03-16' },
      { candidate: 'Emily Davis', position: 'Backend Developer', time: '2:00 PM', date: '2024-03-16' },
      { candidate: 'Chris Wilson', position: 'Full Stack Developer', time: '11:30 AM', date: '2024-03-17' }
    ]
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(profileCompletion);
    }, 500);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSpecializationChange = (value) => {
    const updatedSpecializations = profileData.specializations.includes(value)
      ? profileData.specializations.filter(s => s !== value)
      : [...profileData.specializations, value];
    setProfileData({ ...profileData, specializations: updatedSpecializations });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile', file);
      try {
        setLoading(true);
        const response = await axios.post(
          `${USER_API_END_POINT}/upload-photo`,
          formData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setProfileData({
            ...profileData,
            profilePhoto: response.data.photoUrl,
          });
          toast.success('Profile photo updated successfully');
        }
      } catch (error) {
        toast.error('Failed to upload photo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${USER_API_END_POINT}/update-profile`,
        profileData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
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

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    <div className="w-40 h-40 rounded-full border-4 border-purple-500 p-1">
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
                      <motion.label
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-0 right-0 bg-purple-600 p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          accept="image/*"
                        />
                      </motion.label>
                    )}
                  </motion.div>

                  <div className="mt-6 space-y-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        Elite Recruiter
                      </Badge>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {profileData.fullname}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-purple-600 dark:text-purple-400 font-medium"
                    >
                      {profileData.companyRole}
                    </motion.p>
                  </div>

                  {/* Profile Completion with Animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Profile Completion</span>
                      <span className="text-purple-600 dark:text-purple-400">{profileCompletion}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </motion.div>

                  {/* Contact Information with Icons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 space-y-4"
                  >
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
                  </motion.div>

                  {/* Action Buttons with Hover Effects */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 space-y-3"
                  >
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
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Stats
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
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features Card */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Premium Features</h3>
                  <Crown className="w-5 h-5" />
                </div>
                <div className="space-y-3">
                  {profileData.premium.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center text-sm">
                    <span>Level Progress</span>
                    <span>{profileData.premium.points} / {profileData.premium.pointsToNextLevel}</span>
                  </div>
                  <Progress value={(profileData.premium.points / profileData.premium.pointsToNextLevel) * 100} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest recruitment actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {profileData.recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className={`p-2 rounded-full ${
                          activity.type === 'hire' ? 'bg-green-100 text-green-600' :
                          activity.type === 'interview' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'offer' ? 'bg-purple-100 text-purple-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {activity.type === 'hire' ? <UserCheck className="w-4 h-4" /> :
                           activity.type === 'interview' ? <Calendar className="w-4 h-4" /> :
                           activity.type === 'offer' ? <Award className="w-4 h-4" /> :
                           <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.candidate}</p>
                          <p className="text-xs text-gray-500">{activity.position}</p>
                          <p className="text-xs text-gray-400">{activity.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Extended Profile */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                          <Badge variant="outline">{profileData.stats.avgTimeToHire}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Response Rate</span>
                          <Badge variant="outline">{profileData.stats.responseRate}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Interview Success Rate</span>
                          <Badge variant="outline">{profileData.stats.interviewSuccessRate}%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Retention Rate</span>
                          <Badge variant="outline">{profileData.stats.retentionRate}%</Badge>
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
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Area
                              type="monotone"
                              dataKey="efficiency"
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
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {premiumBadges.map((badge, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${
                          badge.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          badge.color === 'green' ? 'bg-green-100 text-green-600' :
                          badge.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          badge.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                          badge.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          badge.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                          'bg-cyan-100 text-cyan-600'
                        }`}>
                          <badge.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{badge.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Level: {badge.level}</p>
                          <p className="text-sm text-gray-500">Points: {badge.points}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>Hiring Distribution</CardTitle>
                      <CardDescription>Distribution of hires by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Technical', value: 40 },
                                { name: 'Non-Technical', value: 30 },
                                { name: 'Executive', value: 20 },
                                { name: 'Internship', value: 10 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                      <CardDescription>Monthly performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="applications"
                              stroke="#8884d8"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="hires"
                              stroke="#82ca9d"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
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
                {selectedAchievement?.icon && (
                  <selectedAchievement.icon className="w-12 h-12" />
                )}
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
    </motion.div>
  );
};

export default EnhancedRecruiterProfile;