import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Crown,
  QrCode,
  CheckCircle2,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Trophy,
  Target,
  Users,
  BarChart2,
  CreditCard,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode.react';

interface RecruiterPremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentProfile: any; // Add proper type based on your profile structure
}

const RecruiterPremiumUpgrade: React.FC<RecruiterPremiumUpgradeProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentProfile
}) => {
  const [step, setStep] = useState<'plans' | 'payment' | 'processing' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'elite'>('premium');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 49.99,
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      features: [
        { icon: Target, text: 'Advanced Job Matching' },
        { icon: Users, text: 'Priority Candidate Access' },
        { icon: BarChart2, text: 'Enhanced Analytics' },
        { icon: Shield, text: 'Verified Badge' },
        { icon: Star, text: 'Featured Listings' },
        { icon: Zap, text: 'AI-Powered Matching' }
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 99.99,
      icon: Crown,
      color: 'from-yellow-400 to-orange-600',
      features: [
        { icon: Zap, text: 'AI-Powered Matching' },
        { icon: Star, text: 'Featured Listings' },
        { icon: Trophy, text: 'Priority Support' },
        { icon: Shield, text: 'Advanced Security' },
        { icon: Target, text: 'Advanced Job Matching' },
        { icon: Users, text: 'Priority Candidate Access' }
      ]
    }
  ];

  const paymentMethods = [
    {
      id: 'qr',
      name: 'QR Payment',
      icon: QrCode,
      color: 'bg-green-500'
    },
    {
      id: 'card',
      name: 'Credit Card',
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Wallet,
      color: 'bg-purple-500'
    }
  ];

  const handlePlanSelect = (planId: 'premium' | 'elite') => {
    setSelectedPlan(planId);
    setStep('payment');
  };

  const generateQRCode = async () => {
    try {
      // In a real application, this would be an API call to generate a payment QR code
      const paymentData = {
        plan: selectedPlan,
        amount: selectedPlan === 'premium' ? 49.99 : 99.99,
        currency: 'USD',
        timestamp: new Date().toISOString()
      };
      
      // For demo purposes, we'll create a simple payment URL
      const paymentUrl = `upi://pay?pa=jobportal@okaxis&pn=JobPortal&am=${paymentData.amount}&cu=INR&tn=${selectedPlan} Plan`;
      setQrCode(paymentUrl);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId);
    if (methodId === 'qr') {
      generateQRCode();
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, this would verify the payment status
      setStep('success');
      toast.success('Upgrade successful! Welcome to premium!');
      
      // Update profile in your backend
      // await updateRecruiterProfile({
      //   ...currentProfile,
      //   subscription: selectedPlan,
      //   isPremium: true,
      //   premiumFeatures: plans.find(p => p.id === selectedPlan)?.features
      // });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-white dark:bg-gray-900">
        <div className="relative">
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Upgrade Your Recruiter Profile</h2>
              </div>
              <Badge className="bg-white/20 text-white">Limited Time Offer</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'plans' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePlanSelect(plan.id as 'premium' | 'elite')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? `border-${plan.color.split('-')[1]}-500 bg-${plan.color.split('-')[1]}-50`
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <plan.icon className={`w-8 h-8 text-${plan.color.split('-')[1]}-500`} />
                        <div>
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <p className="text-gray-500">Best for {plan.id === 'premium' ? 'growing' : 'established'} recruiters</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-6">
                        ${plan.price}
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full mt-6 ${
                          plan.id === 'premium'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-600'
                        } text-white`}
                      >
                        Select {plan.name}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full ${method.color} text-white`}>
                          <method.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">{method.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {paymentMethod === 'qr' && qrCode && (
                  <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex flex-col items-center space-y-4">
                      <h3 className="text-lg font-semibold">Scan QR Code to Pay</h3>
                      <div className="p-4 bg-white rounded-lg">
                        <QRCode value={qrCode} size={200} />
                      </div>
                      <p className="text-sm text-gray-500">
                        Amount: ${selectedPlan === 'premium' ? '49.99' : '99.99'}
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod && (
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep('plans')}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Payment
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  Welcome to {selectedPlan === 'premium' ? 'Premium' : 'Elite'}!
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Your profile has been upgraded successfully
                </p>
              </motion.div>
            )}

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterPremiumUpgrade; 