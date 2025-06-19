import api from './api';

export interface PremiumFeature {
  icon: string;
  text: string;
  color: string;
}

export interface PremiumPlan {
  id: 'premium' | 'elite';
  name: string;
  price: number;
  features: PremiumFeature[];
  maxJobs: number;
  maxCandidates: number;
  maxTeamMembers: number;
  supportLevel: 'Basic' | 'Priority' | 'Dedicated';
}

export interface RecruiterProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  isPremium: boolean;
  subscription?: PremiumPlan;
  premiumFeatures?: PremiumFeature[];
  maxJobs: number;
  maxCandidates: number;
  maxTeamMembers: number;
  supportLevel: 'Basic' | 'Priority' | 'Dedicated';
}

export const premiumPlans: PremiumPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    features: [
      { icon: 'target', text: 'Advanced Job Matching', color: 'text-purple-500' },
      { icon: 'users', text: 'Priority Candidate Access', color: 'text-pink-500' },
      { icon: 'bar-chart', text: 'Enhanced Analytics', color: 'text-blue-500' },
      { icon: 'shield', text: 'Verified Badge', color: 'text-green-500' },
      { icon: 'star', text: 'Featured Listings', color: 'text-yellow-500' },
      { icon: 'zap', text: 'AI-Powered Matching', color: 'text-orange-500' }
    ],
    maxJobs: 50,
    maxCandidates: 1000,
    maxTeamMembers: 5,
    supportLevel: 'Priority'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 99.99,
    features: [
      { icon: 'zap', text: 'AI-Powered Matching', color: 'text-yellow-500' },
      { icon: 'star', text: 'Featured Listings', color: 'text-orange-500' },
      { icon: 'trophy', text: 'Priority Support', color: 'text-red-500' },
      { icon: 'shield', text: 'Advanced Security', color: 'text-indigo-500' },
      { icon: 'target', text: 'Advanced Job Matching', color: 'text-purple-500' },
      { icon: 'users', text: 'Priority Candidate Access', color: 'text-pink-500' }
    ],
    maxJobs: 200,
    maxCandidates: 5000,
    maxTeamMembers: 20,
    supportLevel: 'Dedicated'
  }
];

export const generatePaymentQR = async (planId: 'premium' | 'elite'): Promise<string> => {
  try {
    const response = await api.post('/api/v1/premium/generate-qr', {
      planId,
      amount: planId === 'premium' ? 49.99 : 99.99
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to generate QR code');
    }
    
    return response.data.qrCode;
  } catch (error: any) {
    console.error('QR generation error:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate payment QR code');
  }
};

export const verifyPayment = async (paymentId: string): Promise<boolean> => {
  try {
    const response = await api.post('/api/v1/premium/verify-payment', {
      paymentId
    });
    
    return response.data.success;
  } catch (error: any) {
    console.error('Payment verification error:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

export const upgradeProfile = async (
  profileId: string,
  planId: 'premium' | 'elite'
): Promise<RecruiterProfile> => {
  try {
    const response = await api.post('/api/v1/premium/upgrade', {
      profileId,
      planId
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to upgrade profile');
    }
    
    return response.data.profile;
  } catch (error: any) {
    console.error('Profile upgrade error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upgrade profile');
  }
};

export const getPremiumStatus = async (profileId: string): Promise<{
  isPremium: boolean;
  plan?: PremiumPlan;
  expiryDate?: string;
}> => {
  try {
    const response = await api.get(`/api/v1/premium/status/${profileId}`);
    return response.data;
  } catch (error: any) {
    console.error('Premium status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get premium status');
  }
};

export const cancelSubscription = async (profileId: string): Promise<boolean> => {
  try {
    const response = await api.post('/api/v1/premium/cancel', {
      profileId
    });
    
    return response.data.success;
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
  }
}; 