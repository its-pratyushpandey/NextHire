import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { premiumPlans } from '@/services/premium.service';
import { LucideIcon, Crown, Shield, BarChart2, Target, MessageSquare, Users, Award, TrendingUp, Zap, Globe, Lock, CheckCircle2, Star, Trophy } from 'lucide-react';

// Map string icon names from premiumPlans to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  'crown': Crown,
  'shield': Shield,
  'bar-chart': BarChart2,
  'target': Target,
  'message-square': MessageSquare,
  'users': Users,
  'award': Award,
  'trending-up': TrendingUp,
  'zap': Zap,
  'globe': Globe,
  'lock': Lock,
  'check-circle-2': CheckCircle2,
  'star': Star,
  'trophy': Trophy
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: {
    text: string;
    className: string;
  };
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  badge
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                {badge && (
                  <Badge className={badge.className}>{badge.text}</Badge>
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
  // Flatten all features from all plans, mark which plan(s) they belong to
  const featureMap = new Map<string, { icon: LucideIcon, title: string, description: string, badge: { text: string, className: string } }>();
  premiumPlans.forEach(plan => {
    plan.features.forEach(f => {
      if (!featureMap.has(f.text)) {
        featureMap.set(f.text, {
          icon: iconMap[f.icon] || Star,
          title: f.text,
          description: '', // Optionally add descriptions if available
          badge: {
            text: plan.name,
            className: plan.id === 'elite' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          }
        });
      } else if (plan.id === 'elite') {
        // If feature is in both, upgrade badge to Elite
        const existing = featureMap.get(f.text)!;
        existing.badge = {
          text: 'Elite',
          className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
        };
      }
    });
  });
  const features = Array.from(featureMap.values());

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;