import React from 'react';
import { motion } from 'framer-motion';
import { premiumPlans } from '@/services/premium.service';
import { LucideIcon } from 'lucide-react';

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

const iconMap = {
  Crown: require('lucide-react').Crown,
  Zap: require('lucide-react').Zap,
  BarChart2: require('lucide-react').BarChart2,
  Target: require('lucide-react').Target,
  MessageSquare: require('lucide-react').MessageSquare,
  Users: require('lucide-react').Users,
  Shield: require('lucide-react').Shield,
  Award: require('lucide-react').Award,
  TrendingUp: require('lucide-react').TrendingUp,
  Star: require('lucide-react').Star,
  Trophy: require('lucide-react').Trophy
};

const allFeatures = Array.from(new Set(premiumPlans.flatMap(plan => plan.features.map(f => f.text))));
const featureDetails = allFeatures.map(text => {
  const feature = premiumPlans.flatMap(plan => plan.features).find(f => f.text === text);
  return {
    icon: iconMap[feature.icon.charAt(0).toUpperCase() + feature.icon.slice(1)] || iconMap.Star,
    title: feature.text,
    description: '' // Optionally add descriptions if available
  };
});

const PremiumFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {featureDetails.map((feature, index) => (
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

export default PremiumFeatures;