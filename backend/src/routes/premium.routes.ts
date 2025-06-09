import express from 'express';
import {
  generateQR,
  verifyPayment,
  upgradeProfile,
  getPremiumStatus,
  cancelSubscription
} from '../controllers/premium.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate QR code for payment
router.post('/generate-qr', authenticateToken, generateQR);

// Verify payment
router.post('/verify-payment', authenticateToken, verifyPayment);

// Upgrade profile to premium
router.post('/upgrade', authenticateToken, upgradeProfile);

// Get premium status
router.get('/status/:profileId', authenticateToken, getPremiumStatus);

// Cancel subscription
router.post('/cancel', authenticateToken, cancelSubscription);

export default router; 