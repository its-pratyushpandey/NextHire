import { Request, Response } from 'express';
import { Recruiter } from '../models/Recruiter';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { generateQRCode } from '../utils/qrCode';
import { verifyPayment as verifyPaymentService } from '../services/payment.service';
import { sendEmail } from '../utils/email';

export const generateQR = async (req: Request, res: Response) => {
  try {
    const { planId, amount } = req.body;
    
    // Generate unique payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate QR code with payment details
    const qrCode = await generateQRCode({
      paymentId,
      amount,
      planId,
      timestamp: new Date().toISOString()
    });
    
    // Create pending payment record
    await Payment.create({
      paymentId,
      amount,
      planId,
      status: 'pending',
      qrCode
    });
    
    res.json({
      success: true,
      qrCode,
      paymentId
    });
  } catch (error: any) {
    console.error('QR generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate QR code'
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;
    
    // Verify payment with payment service
    const isVerified = await verifyPaymentService(paymentId);
    
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
    
    // Update payment status
    await Payment.findOneAndUpdate(
      { paymentId },
      { status: 'completed' }
    );
    
    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
};

export const upgradeProfile = async (req: Request, res: Response) => {
  try {
    const { profileId, planId } = req.body;
    
    // Get recruiter profile
    const recruiter = await Recruiter.findById(profileId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Create subscription
    const subscription = await Subscription.create({
      recruiterId: profileId,
      planId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active'
    });
    
    // Update recruiter profile
    recruiter.isPremium = true;
    recruiter.subscriptionId = subscription._id;
    recruiter.maxJobs = planId === 'premium' ? 50 : 200;
    recruiter.maxCandidates = planId === 'premium' ? 1000 : 5000;
    recruiter.maxTeamMembers = planId === 'premium' ? 5 : 20;
    recruiter.supportLevel = planId === 'premium' ? 'Priority' : 'Dedicated';
    await recruiter.save();
    
    // Send confirmation email
    await sendEmail({
      to: recruiter.email,
      subject: 'Premium Upgrade Confirmation',
      template: 'premium-upgrade',
      data: {
        name: recruiter.name,
        plan: planId,
        expiryDate: subscription.endDate
      }
    });
    
    res.json({
      success: true,
      profile: recruiter,
      subscription
    });
  } catch (error: any) {
    console.error('Profile upgrade error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upgrade profile'
    });
  }
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    
    const recruiter = await Recruiter.findById(profileId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const subscription = recruiter.subscriptionId
      ? await Subscription.findById(recruiter.subscriptionId)
      : null;
    
    res.json({
      success: true,
      isPremium: recruiter.isPremium,
      plan: subscription?.planId,
      expiryDate: subscription?.endDate
    });
  } catch (error: any) {
    console.error('Premium status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get premium status'
    });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.body;
    
    const recruiter = await Recruiter.findById(profileId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    if (!recruiter.subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Update subscription status
    await Subscription.findByIdAndUpdate(
      recruiter.subscriptionId,
      { status: 'cancelled' }
    );
    
    // Update recruiter profile
    recruiter.isPremium = false;
    recruiter.subscriptionId = undefined;
    recruiter.maxJobs = 10;
    recruiter.maxCandidates = 100;
    recruiter.maxTeamMembers = 2;
    recruiter.supportLevel = 'Basic';
    await recruiter.save();
    
    // Send cancellation email
    await sendEmail({
      to: recruiter.email,
      subject: 'Subscription Cancellation Confirmation',
      template: 'subscription-cancelled',
      data: {
        name: recruiter.name
      }
    });
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel subscription'
    });
  }
}; 