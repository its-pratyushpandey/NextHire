import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { 
    generateQRCode, 
    processPayment, 
    getSubscriptionStatus,
    initiateSubscription,
    cancelSubscription 
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Subscription routes
router.post('/generate-qr', isAuthenticated, generateQRCode);
router.post('/process-payment', isAuthenticated, processPayment);
router.get('/status', isAuthenticated, getSubscriptionStatus);
router.post('/initiate', isAuthenticated, initiateSubscription);
router.post('/cancel', isAuthenticated, cancelSubscription);

export default router; 