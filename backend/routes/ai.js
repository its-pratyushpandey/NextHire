import express from 'express';
import { getInterviewQuestions } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/interview-questions', getInterviewQuestions);

export default router;