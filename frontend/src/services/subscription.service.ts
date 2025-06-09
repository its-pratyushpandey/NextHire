import api from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  icon: string;
  color: string;
  popular?: boolean;
  bestValue?: boolean;
  savings?: number;
  maxJobs?: number;
  maxCandidates?: number;
  maxTeamMembers?: number;
  supportLevel?: 'Basic' | 'Priority' | 'Dedicated';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    period: 'month',
    popular: true,
    maxJobs: 50,
    maxCandidates: 1000,
    maxTeamMembers: 5,
    supportLevel: 'Priority',
    features: [
      'Advanced Analytics Dashboard',
      'Priority Support',
      'Custom Branding',
      'API Access',
      'Bulk Operations',
      'Advanced Search Filters',
      'Automated Workflows',
      'Custom Reports',
      'AI-Powered Candidate Matching',
      'Interview Scheduling',
      'Candidate Assessment Tools',
      'Job Post Templates',
      'Email Marketing Integration',
      'Social Media Promotion',
      'Resume Parsing'
    ],
    icon: 'sparkles',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 99.99,
    period: 'month',
    bestValue: true,
    savings: 20,
    maxJobs: 200,
    maxCandidates: 5000,
    maxTeamMembers: 20,
    supportLevel: 'Dedicated',
    features: [
      'All Premium Features',
      'Dedicated Account Manager',
      'White Label Solutions',
      'Advanced AI Integration',
      'Custom Integrations',
      'Priority Feature Requests',
      '24/7 Phone Support',
      'Training Sessions',
      'Custom Workflows',
      'Advanced Analytics API',
      'Multi-Region Job Posting',
      'Competitor Analysis',
      'Market Intelligence Reports',
      'Talent Pool Analytics',
      'Custom Branded Career Portal',
      'Advanced Security Features',
      'SLA Guarantee',
      'Custom Contract Terms'
    ],
    icon: 'crown',
    color: 'from-yellow-400 to-orange-600'
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    icon: 'credit-card',
    color: 'bg-blue-500'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'wallet',
    color: 'bg-blue-600'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: 'bitcoin',
    color: 'bg-yellow-500'
  },
  {
    id: 'qr',
    name: 'QR Code Payment',
    icon: 'qr-code',
    color: 'bg-green-500'
  }
];

export const getSubscriptionStatus = async () => {
  try {
    const response = await fetch('/api/subscription/status');
    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Failed to fetch subscription status:', error);
    return 'free';
  }
};

export const initiateSubscription = async (planId: string, paymentMethod: string) => {
  try {
    const response = await fetch('/api/subscription/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, paymentMethod }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to initiate subscription:', error);
    throw error;
  }
};

export const generatePaymentQR = async (planId: string) => {
  try {
    const response = await api.post('/api/v1/subscription/generate-qr', {
      planId
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to generate QR code');
    }
    
    return response.data;
  } catch (error) {
    console.error('QR generation error:', error);
    if (error.response?.status === 404) {
      throw new Error('Subscription service is not available. Please try again later.');
    }
    throw new Error(error.response?.data?.message || 'Failed to generate payment QR code');
  }
};

export const processPayment = async (paymentData: any) => {
  try {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to process payment:', error);
    throw error;
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await fetch('/api/subscription/cancel', {
      method: 'POST',
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};

export const getSubscriptionUsage = async () => {
  try {
    const response = await fetch('/api/subscription/usage');
    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch subscription usage:', error);
    throw error;
  }
};

export const getBillingHistory = async () => {
  try {
    const response = await fetch('/api/subscription/billing-history');
    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch billing history:', error);
    throw error;
  }
}; 