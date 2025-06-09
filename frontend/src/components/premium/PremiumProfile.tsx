import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import {
  Crown,
  Shield,
  Star,
  Target,
  Users,
  BarChart2,
  Zap,
  Trophy,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PremiumProfileProps {
  plan: 'premium' | 'elite';
}

const PremiumProfile: React.FC<PremiumProfileProps> = ({ plan }) => {
  const features = {
    premium: [
      { icon: Target, text: 'Advanced Job Matching', color: 'text-purple-500' },
      { icon: Users, text: 'Priority Candidate Access', color: 'text-pink-500' },
      { icon: BarChart2, text: 'Enhanced Analytics', color: 'text-blue-500' },
      { icon: Shield, text: 'Verified Badge', color: 'text-green-500' }
    ],
    elite: [
      { icon: Zap, text: 'AI-Powered Matching', color: 'text-yellow-500' },
      { icon: Star, text: 'Featured Listings', color: 'text-orange-500' },
      { icon: Trophy, text: 'Priority Support', color: 'text-red-500' },
      { icon: Shield, text: 'Advanced Security', color: 'text-indigo-500' }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden"
    >
      {/* Premium Header */}
      <div className={`bg-gradient-to-r ${
        plan === 'premium' ? 'from-purple-600 to-pink-600' : 'from-yellow-400 to-orange-600'
      } p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {plan === 'premium' ? <Sparkles className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
            <div>
              <h2 className="text-2xl font-bold">{plan === 'premium' ? 'Premium' : 'Elite'} Profile</h2>
              <p className="text-white/80">Enhanced recruitment capabilities</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white">
            {plan === 'premium' ? 'Premium' : 'Elite'} Member
          </Badge>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {features[plan].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-medium">{feature.text}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan === 'premium' ? 'Premium feature' : 'Elite exclusive'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {plan === 'premium' ? '50' : '200'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {plan === 'premium' ? '1000' : '5000'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Candidates</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {plan === 'premium' ? '5' : '20'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
          </div>
        </div>

        {/* Premium Badge */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Verified {plan === 'premium' ? 'Premium' : 'Elite'} Recruiter</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumProfile; 