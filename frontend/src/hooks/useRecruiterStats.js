import { useState, useEffect } from 'react';
import { getRecruiterStats } from '@/services/recruiter.service';
import { toast } from 'sonner';

export const useRecruiterStats = (timeRange = '30') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getRecruiterStats();
      setStats(data.stats || data); // support both { stats: ... } and direct object
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch statistics';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching recruiter stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return { stats, loading, error, refetchStats: fetchStats };
};