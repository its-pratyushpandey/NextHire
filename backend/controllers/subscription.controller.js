import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import User from '../models/user.model.js';

// Define subscription plans
const subscriptionPlans = [
    {
        id: 'basic',
        name: 'Basic Plan',
        price: 9.99,
        features: ['Basic job posting', 'Basic analytics']
    },
    {
        id: 'premium',
        name: 'Premium Plan',
        price: 19.99,
        features: ['Advanced job posting', 'Advanced analytics', 'Priority support']
    },
    {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 49.99,
        features: ['Unlimited job posting', 'Advanced analytics', 'Priority support', 'Custom branding']
    }
];

// Generate QR code for payment
export const generateQRCode = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.id;

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get plan details
        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan selected'
            });
        }

        // Generate a unique transaction ID
        const transactionId = uuidv4();
        
        // Create payment data
        const paymentData = {
            transactionId,
            planId,
            amount: plan.price,
            currency: 'USD',
            userId: user._id,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        };

        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(JSON.stringify(paymentData));

        res.status(200).json({
            success: true,
            qrCodeData,
            transactionId,
            amount: plan.price,
            currency: 'USD'
        });
    } catch (error) {
        console.error('QR Code generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate QR code'
        });
    }
};

// Process payment
export const processPayment = async (req, res) => {
    try {
        const { transactionId, paymentMethod } = req.body;
        const userId = req.id;

        // Here you would typically integrate with a payment gateway
        // For now, we'll simulate a successful payment

        // Update user's subscription status
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update subscription status
        user.subscription = {
            status: 'active',
            plan: req.body.planId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            paymentMethod
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully'
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment'
        });
    }
};

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            status: user.subscription?.status || 'free',
            plan: user.subscription?.plan,
            endDate: user.subscription?.endDate
        });
    } catch (error) {
        console.error('Subscription status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscription status'
        });
    }
};

// Initiate subscription
export const initiateSubscription = async (req, res) => {
    try {
        const { planId, paymentMethod } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Here you would typically create a payment intent or session
        // For now, we'll return a success response
        res.status(200).json({
            success: true,
            message: 'Subscription initiated successfully'
        });
    } catch (error) {
        console.error('Subscription initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate subscription'
        });
    }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update subscription status
        user.subscription = {
            status: 'cancelled',
            plan: user.subscription?.plan,
            startDate: user.subscription?.startDate,
            endDate: user.subscription?.endDate,
            cancelledAt: new Date()
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        console.error('Subscription cancellation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription'
        });
    }
};