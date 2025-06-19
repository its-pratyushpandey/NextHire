import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, CreditCard, Wallet, Bitcoin, QrCode, Gift, Lock, ArrowRight, Loader2, Crown, Sparkles, Shield, BarChart2, Users, MessageSquare, Award, TrendingUp } from 'lucide-react';
import { subscriptionPlans } from '@/services/subscription.service';
import { toast } from 'sonner';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const paymentMethods = [
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
      color: 'bg-purple-500',
      options: [
        { name: 'Google Pay', upiId: 'jobportal@okaxis' },
        { name: 'PhonePe', upiId: 'jobportal@ybl' },
        { name: 'Paytm', upiId: 'jobportal@paytm' }
      ]
    },
    {
      id: 'crypto',
      name: 'Crypto',
      icon: Bitcoin,
      color: 'bg-yellow-500'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown':
        return <Crown className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Crown className="w-6 h-6" />;
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId);
  };

  const handlePayment = async () => {
    setLoading(true);
    setStatus('processing');
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add your actual payment gateway integration here
      // const response = await axios.post('/api/payment', {
      //     planId: selectedPlan,
      //     method: paymentMethod
      // });

      setStatus('success');
      toast.success('Payment successful! Welcome to premium!');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setStatus('failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upgrade Your Experience
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Choose the perfect plan for your recruitment needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 ${
                  selectedPlan === plan.id ? 'border-purple-500' : 'border-transparent'
                }`}
              >
                <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIcon(plan.icon)}
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    {plan.id === 'premium' && (
                      <Badge className="bg-white/20 text-white">Popular</Badge>
                    )}
                    {plan.id === 'elite' && (
                      <Badge className="bg-white/20 text-white">Best Value</Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-white/80">/{plan.period}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full mt-6 ${
                      plan.id === 'premium'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-600 hover:from-yellow-500 hover:to-orange-700'
                    } text-white`}
                  >
                    Select {plan.name}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          {selectedPlan && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${method.color} text-white`}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Action */}
          {selectedPlan && paymentMethod && (
            <div className="flex justify-end">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-sm text-gray-500 flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal; 