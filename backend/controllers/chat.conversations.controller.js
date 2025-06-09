// Controller to get all conversations for a recruiter with unread count and last message
import ChatMessage from '../models/chat.model.js';
import { User } from '../models/user.model.js';

export const getAllApplicantConversations = async (req, res) => {
  try {
    // Always get recruiterId from auth (for security)
    const recruiterId = req.user?._id?.toString();
    // Find all roomIds where this recruiter is involved
    const chatRooms = await ChatMessage.find({
      roomId: { $regex: recruiterId }
    }).distinct('roomId');

    // For each room, get the latest message and unread count for recruiter
    const conversations = await Promise.all(chatRooms.map(async (roomId) => {
      const lastMsg = await ChatMessage.findOne({ roomId }).sort({ timestamp: -1 });
      // Unread for recruiter
      const unreadRecruiter = recruiterId ? await ChatMessage.countDocuments({
        roomId,
        senderId: { $ne: recruiterId },
        [`readBy.${recruiterId}`]: { $ne: true }
      }) : 0;
      // Extract both user IDs from roomId
      const ids = roomId.split('_');
      // The candidate is the one that is NOT the recruiter
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
