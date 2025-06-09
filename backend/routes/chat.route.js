import express from "express";
import { getChatMessages, postChatMessage, getApplicantsForRecruiter, createGroupChat, uploadChatFile } from "../controllers/chat.controller.js";
import { getAllApplicantConversations } from '../controllers/chat.conversations.controller.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

// Get chat messages
router.get('/:roomId', isAuthenticated, getChatMessages);

// Post a chat message
router.post('/:roomId', isAuthenticated, postChatMessage);

// Get applicants for recruiter (inbox)
router.get('/applicants-for-recruiter/:recruiterId', isAuthenticated, getApplicantsForRecruiter);

// Group chat creation endpoint (premium)
router.post('/group/create', isAuthenticated, createGroupChat);

// Upload chat file (attachment)
router.post('/upload', isAuthenticated, singleUpload, uploadChatFile);

// Get all applicant conversations for recruiter (with unread count)
router.get('/all-applicants', isAuthenticated, getAllApplicantConversations);

export default router;