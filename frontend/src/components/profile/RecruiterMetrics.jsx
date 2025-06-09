import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Target, 
  Clock,
  TrendingUp,
  Eye,
  UserCheck
} from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className={`text-${color}-500 text-sm flex items-center mt-2`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </p>
      </div>
      <div className={`p-4 bg-${color}-100 dark:bg-${color}-900/20 rounded-xl`}>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  </motion.div>
);

const RecruiterMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.overview.map((metric, index) => (
        <StatsCard key={index} {...metric} />
      ))}
      {metrics.engagement.map((metric, index) => (
        <StatsCard key={`engagement-${index}`} {...metric} />
      ))}
    </div>
  );
};

export default RecruiterMetrics;