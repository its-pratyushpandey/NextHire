import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Target,
  Clock,
  TrendingUp,
  Award,
  UserCheck,
  Calendar,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRecruiterStats } from '@/hooks/useRecruiterStats';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, color, subValue }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            {subValue && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subValue}</p>
            )}
            {trend && (
              <p className={`text-${color}-500 text-sm flex items-center mt-2`}>
                <ArrowUpRight className="w-4 h-4 mr-1" /> {trend}
              </p>
            )}
          </div>
          <div className={`p-4 bg-${color}-100 dark:bg-${color}-900/20 rounded-full`}>
            <Icon className={`w-8 h-8 text-${color}-500`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const RecruiterStats = () => {
  const { stats, loading, error } = useRecruiterStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hires"
          value={stats?.overview?.totalHires || 0}
          subValue="Successfully placed candidates"
          icon={UserCheck}
          trend={`+${stats?.recentActivity?.last30DaysHires || 0} this month`}
          color="green"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.overview?.activeJobs || 0}
          subValue={`${stats?.overview?.totalJobs || 0} total posts`}
          icon={Briefcase}
          trend={`${stats?.recentActivity?.applicationTrend}% activity`}
          color="blue"
        />
        <StatCard
          title="Response Rate"
          value={`${stats?.overview?.responseRate || 0}%`}
          subValue="Application responses"
          icon={Target}
          trend={`${stats?.overview?.applicationToInterviewRate}% interview rate`}
          color="purple"
        />
        <StatCard
          title="Time to Hire"
          value={`${stats?.overview?.avgTimeToHire || 0}`}
          subValue="Average days to hire"
          icon={Clock}
          trend="From application to offer"
          color="amber"
        />
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              Application Trends
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="hires" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Job Categories */}
        <Card className="bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            Job Categories
          </h3>
          <div className="space-y-4">
            {Object.entries(stats?.jobCategories || {}).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-gray-500">{count} jobs</span>
                </div>
                <Progress 
                  value={(count / Object.values(stats.jobCategories).reduce((a, b) => a + b, 0)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Jobs */}
      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Top Performing Jobs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.topPerformingJobs.map((job, index) => (
            <Card key={index} className="bg-gray-50 dark:bg-gray-700/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 line-clamp-1">{job.title}</h4>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{job.applications} applications</span>
                  <span>{job.hires} hires</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RecruiterStats;