import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
    Building2, Users, Target, Award, Crown, Sparkles,
    BriefcaseIcon, LineChart, BarChart2, PieChart, 
    TrendingUp, Download, Share2, MessageCircle,
    Mail, Phone, Globe, MapPin, FileText, Star,
    Shield, Zap, Activity, Clock, Calendar,
    UserCheck, ArrowUpRight, Plus, Settings2,
    Briefcase, User2, ChevronRight, CheckCircle2,
    BookOpen, Rocket, Lightning, Trophy
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart as RechartsDonut,
    Pie, Cell
} from 'recharts';
import { format } from 'date-fns';
import RecruiterStats from './RecruiterStats';

const RecruiterProfile = () => {
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('overview');

    const stats = {
        activeJobs: 12,
        totalApplications: 248,
        hireRate: 68,
        responseRate: 92,
        avgTimeToHire: 15,
        totalInterviews: 56,
        shortlistedCandidates: 85,
        premiumRank: 'Elite'
    };

    const performanceData = [
        { month: 'Jan', applications: 45, hires: 8, efficiency: 75 },
        { month: 'Feb', applications: 52, hires: 10, efficiency: 78 },
        { month: 'Mar', applications: 61, hires: 12, efficiency: 82 },
        { month: 'Apr', applications: 58, hires: 11, efficiency: 80 },
        { month: 'May', applications: 75, hires: 15, efficiency: 85 },
        { month: 'Jun', applications: 85, hires: 18, efficiency: 88 }
    ];

    const achievementsData = [
        {
            title: "Top Recruiter",
            date: "2024",
            description: "Ranked in top 5% of recruiters",
            icon: Trophy
        },
        {
            title: "Perfect Hire Rate",
            date: "Last Quarter",
            description: "90% successful placements",
            icon: CheckCircle2
        },
        {
            title: "Fast Response",
            date: "Current",
            description: "Average response time < 24h",
            icon: Lightning
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Premium Status Banner */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            >
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Crown className="h-6 w-6 text-yellow-300" />
                            </motion.div>
                            <div></div>
                                <h3 className="font-semibold text-white">Elite Recruiter Status</h3>
                                <p className="text-sm text-white/80">Top 5% Performance Tier</p>
                            </div>
                        </div>
                        <Badge className="bg-white/10 hover:bg-white/20 text-white"></Badge>
                            <Sparkles className="h-4 w-4 mr-1" />
                            Premium Active
                        </Badge>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-16">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="ring-4 ring-white dark:ring-gray-800 rounded-full shadow-xl"
                            >
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-3xl text-white">
                                        {user?.fullname?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user?.fullname}
                                    </h1>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Verified Elite
                                    </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {user?.profile?.bio || 'Senior Technical Recruiter'}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <Badge variant="secondary" className="px-3 py-1 gap-1">
                                        <Building2 className="h-4 w-4" />
                                        {user?.company?.name || 'Company Name'}
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1 gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {user?.profile?.location || 'Location'}
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1 gap-1 bg-purple-100 text-purple-700">
                                        <Star className="h-4 w-4" />
                                        Elite Recruiter
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <StatsCard
                        title="Active Jobs"
                        value={stats.activeJobs}
                        trend="+3 this month"
                        icon={BriefcaseIcon}
                        color="blue"
                    />
                    <StatsCard
                        title="Total Applications"
                        value={stats.totalApplications}
                        trend="+15% vs last month"
                        icon={Users}
                        color="purple"
                    />
                    <StatsCard
                        title="Hire Rate"
                        value={`${stats.hireRate}%`}
                        trend="+5% improvement"
                        icon={Target}
                        color="green"
                    />
                    <StatsCard
                        title="Response Rate"
                        value={`${stats.responseRate}%`}
                        trend="+2% improvement"
                        icon={Activity}
                        color="pink"
                    />
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="overview" className="mt-8">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Performance Chart */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Hiring Performance
                                    </h3>
                                    <p className="text-sm text-gray-500">Last 6 months activity</p>
                                </div>
                                <Button variant="outline" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Data
                                </Button>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="#8B5CF6"
                                            fillOpacity={1}
                                            fill="url(#colorApplications)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="performance">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Efficiency Metrics */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Efficiency Metrics</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Average Time to Hire</span>
                                        <Badge variant="outline">{stats.avgTimeToHire} days</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Response Rate</span>
                                        <Badge variant="outline">{stats.responseRate}%</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Interview Success Rate</span>
                                        <Badge variant="outline">85%</</Badge>
                                    </div>
                                </div>
                            </Card>

                            {/* Premium Features */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Premium Features</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Rocket, text: "AI-Powered Candidate Matching" },
                                        { icon: Lightning, text: "Priority Job Listing" },
                                        { icon: Shield, text: "Advanced Analytics" },
                                        { icon: Star, text: "Premium Support" }
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <feature.icon className="h-5 w-5 text-purple-500" />
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="achievements">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {achievementsData.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                                >
                                    <achievement.icon className="h-8 w-8 text-purple-500 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                                    <Badge variant="secondary">{achievement.date}</Badge>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
                {selectedTab === 'stats' && <RecruiterStats />}
            </div>
        </div>
    );
};

export default RecruiterProfile;