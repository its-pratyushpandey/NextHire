// Model imports
import ChatMessage from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Application } from '../models/application.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { singleUpload } from '../middlewares/multer.js';

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id?.toString();
    // Mark as read
    await ChatMessage.updateMany(
      { roomId, [`readBy.${userId}`]: { $ne: true } },
      { $set: { [`readBy.${userId}`]: true } }
    );
    const messages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Post chat message
export const postChatMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message, senderId, senderRole, gif, fileUrl, fileType, fileName } = req.body;
    // Log
    console.log('Incoming chat message:', {
      roomId, message, senderId, senderRole, gif, fileUrl, fileType, fileName
    });
    if (!roomId || !senderId || !senderRole) {
      return res.status(400).json({ error: 'Missing required fields (roomId, senderId, senderRole)' });
    }
    // Validate senderId
    if (!senderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid senderId format' });
    }
    const newMessage = await ChatMessage.create({
      roomId,
      message: message || '',
      senderId,
      senderRole,
      gif: gif || '',
      fileUrl: fileUrl || '',
      fileType: fileType || '',
      fileName: fileName || ''
    });
    res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get applicants for recruiter
export const getApplicantsForRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    // Find chat rooms
    const chatRooms = await ChatMessage.find({
      roomId: { $regex: recruiterId }
    }).distinct('roomId');
    // Extract candidate IDs
    const candidateIds = chatRooms
      .map(roomId => roomId.split('_').find(id => id !== recruiterId))
      .filter(Boolean);
    // Unique IDs
    const uniqueCandidateIds = [...new Set(candidateIds)];
    // Get user details
    const applicants = await User.find({ _id: { $in: uniqueCandidateIds } },
      'fullname email profile.profilePhoto');
    res.json({ applicants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create group chat
export const createGroupChat = async (req, res) => {
  try {
    const { groupName, memberIds, creatorId } = req.body;
    if (!groupName || !Array.isArray(memberIds) || !creatorId) {
      return res.status(400).json({ error: 'Missing groupName, memberIds, or creatorId' });
    }
    // Unique group roomId
    const roomId = `group_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    // System message
    await ChatMessage.create({
      roomId,
      senderId: creatorId,
      senderRole: 'system',
      message: `Group "${groupName}" created`,
      timestamp: new Date()
    });
    res.status(201).json({ roomId, groupName, memberIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload chat file
export const uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'chat-attachments');
    res.status(200).json({
      url: result.secure_url,
      type: req.file.mimetype,
      name: req.file.originalname
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};