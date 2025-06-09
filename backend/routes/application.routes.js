import express from 'express';
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from '../controllers/application.controller.js';
import { isAuthenticated } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Apply for a job
router.post('/apply/:id', isAuthenticated, upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]), applyJob);

// Get all jobs applied by the user
router.get('/applied', isAuthenticated, getAppliedJobs);

// Get all applicants for a job (admin only)
router.get('/applicants/:id', isAuthenticated, getApplicants);

// Update application status (admin only)
router.put('/status/:id', isAuthenticated, updateStatus);

export default router;
