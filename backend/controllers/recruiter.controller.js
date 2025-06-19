import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";

export const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.id;
    const timeRange = req.query.timeRange || '30'; // Default 30 days
    const endDate = new Date();
    const startDate = new Date(endDate - (parseInt(timeRange) * 24 * 60 * 60 * 1000));

    // Get recruiter's jobs with applications
    const jobs = await Job.find({ 
      created_by: recruiterId,
    }).populate({
      path: 'applications',
      populate: {
        path: 'applicant',
        select: 'fullname email profile'
      }
    }).populate('company');

    // Calculate core metrics
    const activeJobs = jobs.filter(job => job.status === 'active');
    const allApplications = jobs.flatMap(job => job.applications || []);
    const recentApplications = allApplications.filter(app => 
      new Date(app.createdAt) >= startDate
    );

    // Calculate response metrics
    const respondedApplications = allApplications.filter(app => 
      ['shortlisted', 'interviewed', 'hired', 'rejected'].includes(app.status)
    );
    const responseRate = allApplications.length > 0 
      ? (respondedApplications.length / allApplications.length) * 100 
      : 0;

    // Calculate hiring metrics
    const hiredApplications = allApplications.filter(app => app.status === 'hired');
    const totalHiresToDate = hiredApplications.length;
    const recentHires = hiredApplications.filter(app => 
      new Date(app.updatedAt) >= startDate
    );

    // Calculate time-to-hire
    const timeToHireData = hiredApplications.map(app => {
      const applicationDate = new Date(app.createdAt);
      const hireDate = new Date(app.updatedAt);
      return Math.ceil((hireDate - applicationDate) / (1000 * 60 * 60 * 24)); // Days
    });

    const avgTimeToHire = timeToHireData.length > 0
      ? Math.round(timeToHireData.reduce((a, b) => a + b) / timeToHireData.length)
      : 0;

    // Calculate monthly trends
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }).reverse();

    const monthlyStats = last6Months.map(month => {
      const monthApplications = allApplications.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.toLocaleString('default', { month: 'short', year: 'numeric' }) === month;
      });

      return {
        month,
        applications: monthApplications.length,
        hires: monthApplications.filter(app => app.status === 'hired').length,
        responseRate: monthApplications.length > 0
          ? (monthApplications.filter(app => ['shortlisted', 'interviewed', 'hired', 'rejected'].includes(app.status)).length / monthApplications.length) * 100
          : 0
      };
    });

    // Calculate job category distribution
    const jobCategories = jobs.reduce((acc, job) => {
      const category = job.category || 'Other';
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          active: 0,
          applications: 0,
          hires: 0
        };
      }
      acc[category].total++;
      if (job.status === 'active') acc[category].active++;
      acc[category].applications += job.applications?.length || 0;
      acc[category].hires += job.applications?.filter(app => app.status === 'hired').length || 0;
      return acc;
    }, {});

    // Get top performing jobs
    const topPerformingJobs = jobs
      .map(job => ({
        id: job._id,
        title: job.title,
        company: job.company?.name,
        applications: job.applications?.length || 0,
        hires: job.applications?.filter(app => app.status === 'hired').length || 0,
        conversionRate: job.applications?.length 
          ? (job.applications.filter(app => app.status === 'hired').length / job.applications.length) * 100
          : 0
      }))
      .sort((a, b) => b.hires - a.hires || b.applications - a.applications)
      .slice(0, 5);

    const stats = {
      overview: {
        totalJobs: jobs.length,
        activeJobs: activeJobs.length,
        totalHires: totalHiresToDate,
        totalApplications: allApplications.length,
        responseRate: Math.round(responseRate),
        avgTimeToHire,
        applicationToInterviewRate: Math.round(
          (allApplications.filter(app => app.status === 'interviewed').length / allApplications.length) * 100
        ),
        interviewToHireRate: Math.round(
          (totalHiresToDate / allApplications.filter(app => app.status === 'interviewed').length) * 100
        )
      },
      recentActivity: {
        last30DaysApplications: recentApplications.length,
        last30DaysHires: recentHires.length,
        applicationTrend: ((recentApplications.length / allApplications.length) * 100).toFixed(1),
        hireTrend: ((recentHires.length / totalHiresToDate) * 100).toFixed(1)
      },
      monthlyStats,
      jobCategories,
      topPerformingJobs,
      efficiency: {
        timeToHireDistribution: {
          under7Days: timeToHireData.filter(days => days <= 7).length,
          under14Days: timeToHireData.filter(days => days <= 14).length,
          under30Days: timeToHireData.filter(days => days <= 30).length,
          over30Days: timeToHireData.filter(days => days > 30).length
        },
        applicationQuality: Math.round(
          (allApplications.filter(app => app.status !== 'pending').length / allApplications.length) * 100
        )
      }
    };

    // Update recruiter's profile stats
    await User.findByIdAndUpdate(recruiterId, {
      'profile.stats': {
        totalHires: totalHiresToDate,
        activeJobs: activeJobs.length,
        responseRate: Math.round(responseRate),
        avgTimeToHire,
        successfulPlacements: totalHiresToDate,
        candidatePool: allApplications.length
      }
    });

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Recruiter stats error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching recruiter statistics"
    });
  }
};