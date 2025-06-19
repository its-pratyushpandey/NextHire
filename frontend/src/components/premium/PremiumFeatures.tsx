import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Crown,
  Sparkles,
  Shield,
  BarChart2,
  Users,
  MessageSquare,
  Award,
  TrendingUp,
  Zap,
  Globe,
  Target,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isPremium?: boolean;
  isElite?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  isPremium,
  isElite
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${
              isElite ? 'bg-gradient-to-r from-yellow-400 to-orange-600' :
              isPremium ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
              'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Icon className={`w-6 h-6 ${
                isElite || isPremium ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{title}</h3>
                {isElite && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-600 text-white">
                    Elite
                  </Badge>
                )}
                {isPremium && !isElite && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PremiumFeatures: React.FC = () => {
  const features = [
    {
      icon: Crown,
      title: "Premium Access",
      description: "Unlock exclusive recruiter features and tools",
      isPremium: true
    },
    {
      icon: Shield,
      title: "Verified Status",
      description: "Stand out with verified recruiter badge and enhanced credibility",
      isPremium: true
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Access detailed hiring insights and performance metrics",
      isPremium: true
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered candidate recommendations and job matching",
      isPremium: true
    },
    {
      icon: MessageSquare,
      title: "Priority Support",
      description: "24/7 dedicated assistance and faster response times",
      isPremium: true
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user account management and team features",
      isPremium: true
    },
    {
      icon: Award,
      title: "Featured Listings",
      description: "Premium placement for job posts and increased visibility",
      isPremium: true
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Track recruitment success and optimize your strategy",
      isPremium: true
    },
    {
      icon: Zap,
      title: "AI Integration",
      description: "Advanced AI tools for recruitment automation",
      isElite: true
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to international talent pool and markets",
      isElite: true
    },
    {
      icon: Lock,
      title: "Enhanced Security",
      description: "Advanced security features and data protection",
      isElite: true
    },
    {
      icon: CheckCircle2,
      title: "Custom Solutions",
      description: "Tailored recruitment solutions for your needs",
      isElite: true
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Premium Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Unlock powerful tools to enhance your recruitment process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                     font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Upgrade to Premium
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures; 