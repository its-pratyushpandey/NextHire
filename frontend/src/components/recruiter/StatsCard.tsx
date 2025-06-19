import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    trend: string;
    icon: any;
    color: string;
}

const StatsCard = ({ title, value, trend, icon: Icon, color }: StatsCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                    <p className={`text-${color}-500 text-sm flex items-center mt-1`}>
                        <TrendingUp className="w-4 w-4 mr-1" />
                        {trend}
                    </p>
                </div>
                <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;