// Get recruiter conversations
import ChatMessage from '../models/chat.model.js';
import { User } from '../models/user.model.js';

// Get all applicant conversations for recruiter
export const getAllApplicantConversations = async (req, res) => {
  try {
    // Recruiter ID from auth
    const recruiterId = req.user?._id?.toString();
    // Find all roomIds for recruiter
    const chatRooms = await ChatMessage.find({
      roomId: { $regex: recruiterId }
    }).distinct('roomId');

    // For each room, get last message and unread count
    const conversations = await Promise.all(chatRooms.map(async (roomId) => {
      const lastMsg = await ChatMessage.findOne({ roomId }).sort({ timestamp: -1 });
      // Unread count
      const unreadRecruiter = recruiterId ? await ChatMessage.countDocuments({
        roomId,
        senderId: { $ne: recruiterId },
        [`readBy.${recruiterId}`]: { $ne: true }
      }) : 0;
      // Get candidate ID
      const ids = roomId.split('_');
      const candidateId = ids.find(id => id !== recruiterId);
      const candidate = await User.findById(candidateId);
      return {
        roomId,
        candidateName: candidate?.fullname || 'Unknown',
        candidateAvatar: candidate?.profile?.profilePhoto || '',
        lastMessage: lastMsg?.message || '',
        lastTimestamp: lastMsg?.timestamp,
        unreadRecruiter
      };
    }));
    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
