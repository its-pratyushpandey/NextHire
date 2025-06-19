import { Payment } from '../models/Payment';
import axios from 'axios';

interface PaymentVerificationResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const verifyPayment = async (paymentId: string): Promise<boolean> => {
  try {
    // Get payment record
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status === 'completed') {
      return true;
    }
    
    // Verify payment with payment gateway
    const verificationResult = await verifyWithPaymentGateway(payment);
    
    if (verificationResult.success) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { paymentId },
        {
          status: 'completed',
          transactionId: verificationResult.transactionId
        }
      );
      return true;
    }
    
    // Update payment status to failed
    await Payment.findOneAndUpdate(
      { paymentId },
      {
        status: 'failed'
      }
    );
    
    return false;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

const verifyWithPaymentGateway = async (payment: any): Promise<PaymentVerificationResult> => {
  try {
    // In a real implementation, this would call your payment gateway's API
    // For example, with Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentId);
    
    // For demo purposes, we'll simulate a successful payment
    // In production, replace this with actual payment gateway integration
    const response = await axios.post(process.env.PAYMENT_GATEWAY_URL || '', {
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: 'USD'
    });
    
    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Payment gateway verification error:', error);
    return {
      success: false,
      error: 'Payment verification failed'
    };
  }
};

export const processRefund = async (paymentId: string): Promise<boolean> => {
  try {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'completed') {
      throw new Error('Payment is not completed');
    }
    
    // Process refund with payment gateway
    const refundResult = await processRefundWithGateway(payment);
    
    if (refundResult.success) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { paymentId },
        {
          status: 'refunded',
          refundId: refundResult.refundId
        }
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Refund processing error:', error);
    return false;
  }
};

const processRefundWithGateway = async (payment: any): Promise<{
  success: boolean;
  refundId?: string;
  error?: string;
}> => {
  try {
    // In a real implementation, this would call your payment gateway's API
    // For example, with Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const refund = await stripe.refunds.create({
    //   payment_intent: payment.paymentId
    // });
    
    // For demo purposes, we'll simulate a successful refund
    // In production, replace this with actual payment gateway integration
    const response = await axios.post(process.env.PAYMENT_GATEWAY_REFUND_URL || '', {
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: 'USD'
    });
    
    return {
      success: true,
      refundId: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Payment gateway refund error:', error);
    return {
      success: false,
      error: 'Refund processing failed'
    };
  }
}; 