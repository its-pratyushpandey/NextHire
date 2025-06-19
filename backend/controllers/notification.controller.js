// Models
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

// Create smart notification
export const generateSmartNotification = async (userId, type, title, message, data = {}) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    data,
    isPremium: true
  });
};

// Get smart notifications (premium)
export const getSmartNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.subscription.plan !== 'premium') {
      return res.status(403).json({ success: false, message: 'Premium access required.' });
    }
    const notifications = await Notification.find({ user: user._id, isPremium: true })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

// Send job alert
export const sendJobAlert = async (userId, job) => {
  return generateSmartNotification(
    userId,
    'job_alert',
    'New Job Match!',
    `A new job matches your profile: ${job.title} at ${job.companyName}`,
    { jobId: job._id }
  );
};

// Send interview reminder
export const sendInterviewReminder = async (userId, interview) => {
  return generateSmartNotification(
    userId,
    'interview_reminder',
    'Upcoming Interview',
    `You have an interview scheduled for ${interview.jobTitle} on ${interview.date}`,
    { interviewId: interview._id }
  );
};

// Send insight notification
export const sendInsight = async (userId, insight) => {
  return generateSmartNotification(
    userId,
    'insight',
    'Recruitment Insight',
    insight.message,
    { ...insight }
  );
};
