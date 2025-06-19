import React, { useEffect, useState } from "react";
import { getMatchedJobs } from "@/services/ai/jobMatchingClient";
import { Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PremiumJobMatching = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMatchedJobs()
      .then(data => setJobs(data.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-purple-500 animate-pulse" />
        <h2 className="text-2xl font-bold text-purple-700 dark:text-white">Premium Job Matches</h2>
        <BadgeCheck className="w-6 h-6 text-green-500" />
      </div>
      {loading ? (
        <div className="text-center py-8 text-purple-600">Finding your best matches...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No matches found. Update your profile for better results!</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job, i) => (
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
  );
};

export default PremiumJobMatching;