import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  BarChart2, // Changed from ChartBar
  Target, 
  MessageSquare, 
  Users,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </motion.div>
);

const PremiumFeatures = () => {
  const features = [
    {
      icon: Crown,
      title: "Premium Access",
      description: "Unlock exclusive recruiter features"
    },
    {
      icon: Shield,
      title: "Verified Status",
      description: "Stand out with verified recruiter badge"
    },
    {
      icon: BarChart2, // Using BarChart2 instead of ChartBar
      title: "Advanced Analytics",
      description: "Access detailed hiring insights"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered candidate recommendations"
    },
    {
      icon: MessageSquare,
      title: "Priority Support",
      description: "24/7 dedicated assistance"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user account management"
    },
    {
      icon: Award,
      title: "Featured Listings",
      description: "Premium placement for job posts"
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Track recruitment success"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FeatureCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
};

export default PremiumFeatures;