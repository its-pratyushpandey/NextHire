// filepath: p:\ASUS\Projects\Mern\Pending\job-portal\backend\routes\aiChat.js
import express from 'express';
import { aiChat } from '../controllers/aiChat.controller.js';

const router = express.Router();

router.post('/chat', aiChat);

export default router;
