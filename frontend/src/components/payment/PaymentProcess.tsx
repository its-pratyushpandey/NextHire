import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  CreditCard,
  Wallet,
  Bitcoin,
  CheckCircle2,
  Loader2,
  Lock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentProcessProps {
  plan: {
    id: string;
    name: string;
    price: number;
    period: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentProcess: React.FC<PaymentProcessProps> = ({
  plan,
  onSuccess,
  onCancel
}) => {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      color: 'bg-purple-500'
    },
    {
      id: 'crypto',
      name: 'Crypto',
      icon: Bitcoin,
      color: 'bg-yellow-500'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId);
    setStep('details');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add your actual payment gateway integration here
      // const response = await axios.post('/api/payment', {
      //     planId: plan.id,
      //     method: paymentMethod,
      //     amount: plan.price
      // });

      setStep('success');
      toast.success('Payment successful!');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Complete Your Purchase
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {plan.name} Plan - ${plan.price}/{plan.period}
            </p>
          </div>

          {/* Payment Method Selection */}
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
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
            </motion.div>
          )}

          {/* Payment Details Form */}
          {step === 'details' && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePayment}
              className="space-y-4"
            >
              {paymentMethod === 'card' && (
                <>
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="font-mono"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Card Holder Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Scan the QR code with your UPI app or use the UPI ID below:
                    </p>
                    <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm">jobportal@okaxis</code>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send payment to the following wallet address:
                    </p>
                    <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm">0x1234...5678</code>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Processing your payment...
              </p>
            </motion.div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Thank you for upgrading to {plan.name}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcess; 