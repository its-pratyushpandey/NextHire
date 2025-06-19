import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // `${candidateId}_${recruiterId}`
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['recruiter', 'candidate'], required: true },
  message: { type: String, default: '' },
  gif: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  fileType: { type: String, default: '' },
  fileName: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  readBy: { type: Object, default: {} } // { userId: true }
});

export default mongoose.model('ChatMessage', chatMessageSchema);