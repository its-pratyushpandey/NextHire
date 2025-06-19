import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['job_alert', 'interview_reminder', 'insight', 'general'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Object },
  isRead: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
