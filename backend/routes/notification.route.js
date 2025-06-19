import express from 'express';
import { getSmartNotifications } from '../controllers/notification.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Route to get smart notifications (premium only)
router.get('/smart', isAuthenticated, getSmartNotifications);

export default router;
