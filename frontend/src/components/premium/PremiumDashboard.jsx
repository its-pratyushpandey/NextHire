import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BarChart2, Users, Briefcase, Award, Crown } from "lucide-react";
import PremiumBadge from "@/components/ui/PremiumBadge";
import { getMatchedJobs } from "@/services/ai/jobMatchingClient"; // Make sure this exists
import { Button } from "@/components/ui/button";

const statsConfig = [
  { label: "Jobs Applied", icon: Briefcase, color: "purple" },
  { label: "Interviews", icon: Users, color: "blue" },
  { label: "Offers", icon: Award, color: "green" },
  { label: "Profile Views", icon: BarChart2, color: "pink" }
];

const PremiumDashboard = ({ userStats }) => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMatchedJobs()
      .then(data => setMatchedJobs(data.jobs || []))
      .catch(() => setMatchedJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
          <h1 className="text-3xl font-bold text-purple-700 dark:text-white">Premium Dashboard</h1>
          <PremiumBadge className="ml-2" />
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {statsConfig.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card flex flex-col items-center"
            >
              <stat.icon className={`w-8 h-8 mb-2 text-${stat.color}-500`} />
              <div className="text-2xl font-bold">{userStats?.[stat.label] ?? "--"}</div>
              <div className="text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        {/* AI Job Matching */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-purple-700 dark:text-white">AI-Powered Job Matches</h2>
          </div>
          {loading ? (
            <div className="text-center py-8 text-purple-600">Finding your best matches...</div>
          ) : matchedJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No matches found. Update your profile for better results!</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {matchedJobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-2 border-2 border-purple-100 dark:border-purple-900/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-purple-700 dark:text-purple-300">{job.title}</span>
                    <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow">
                      {job.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 line-clamp-2">{job.description}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(job.skills || []).slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">{skill}</span>
                    ))}
                  </div>
                  <Button
                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
                    onClick={() => window.location.href = `/description/${job._id}`}
                  >
                    View & Apply
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;