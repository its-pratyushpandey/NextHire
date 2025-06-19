import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';  // Change this line
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    QrCode, 
    CreditCard, 
    Wallet,
    CheckCircle2,
    Loader2,
    Shield,
    Smartphone,
    ArrowRight,
    Lock
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { upgradeToPremium } from '@/redux/authSlice';
import { toast } from 'sonner';

const PaymentModal = ({ isOpen, setIsOpen, selectedPlan }) => {
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('pending');
    const dispatch = useDispatch();

    const paymentMethods = {
        upi: {
            id: 'upi',
            name: 'UPI Payment',
            icon: QrCode,
            options: [
                { id: 'gpay', name: 'Google Pay', upiId: 'merchant@okaxis', logo: '/gpay-logo.png' },
                { id: 'phonepe', name: 'PhonePe', upiId: 'merchant@ybl', logo: '/phonepe-logo.png' },
                { id: 'paytm', name: 'Paytm', upiId: 'merchant@paytm', logo: '/paytm-logo.png' }
            ]
        },
        card: {
            id: 'card',
            name: 'Card Payment',
            icon: CreditCard
        },
        wallet: {
            id: 'wallet',
            name: 'Net Banking',
            icon: Wallet
        }
    };

    const handleDirectPayment = (upiApp) => {
        const amount = selectedPlan.price.replace(/[^0-9]/g, '');
        const upiLinks = {
            gpay: `gpay://upi/pay?pa=${paymentMethods.upi.options[0].upiId}&pn=JobPortal&am=${amount}&cu=INR`,
            phonepe: `phonepe://pay?pa=${paymentMethods.upi.options[1].upiId}&pn=JobPortal&am=${amount}&cu=INR`,
            paytm: `paytm://pay?pa=${paymentMethods.upi.options[2].upiId}&pn=JobPortal&am=${amount}&cu=INR`
        };
        
        window.location.href = upiLinks[upiApp];
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Add your actual payment gateway integration here
            // const response = await axios.post('/api/payment', {
            //     planId: selectedPlan.id,
            //     amount: selectedPlan.price,
            //     method: paymentMethod
            // });

            setStatus('success');
            dispatch(upgradeToPremium());
            toast.success('Payment successful! You are now a premium member.');
            setTimeout(() => {
                setIsOpen(false);
            }, 1500);
        } catch (error) {
            setStatus('failed');
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] p-0">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg border-b border-purple-100 dark:border-purple-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Shield className="h-6 w-6 text-purple-500" />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Secure Payment
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPlan?.name} - {selectedPlan?.price}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Tabs defaultValue="upi" className="w-full p-6">
                    <TabsList className="grid grid-cols-3 gap-4 bg-muted p-1">
                        {Object.values(paymentMethods).map((method) => (
                            <TabsTrigger
                                key={method.id}
                                value={method.id}
                                className="flex items-center gap-2 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20"
                                onClick={() => setPaymentMethod(method.id)}
                            >
                                <method.icon className="h-4 w-4" />
                                {method.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="upi" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <QrCode className="h-5 w-5 text-purple-500" />
                                        Scan QR Code
                                    </h3>
                                    <div className="bg-white p-4 rounded-lg">
                                        <QRCodeSVG
                                            value={`upi://pay?pa=${paymentMethods.upi.options[0].upiId}&pn=JobPortal&am=${selectedPlan?.price.replace(/[^0-9]/g, '')}&cu=INR`}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                            className="mx-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-purple-500" />
                                    Pay Using UPI Apps
                                </h3>
                                {paymentMethods.upi.options.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDirectPayment(option.id)}
                                        className="w-full p-4 rounded-xl border border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={option.logo} 
                                                alt={option.name}
                                                className="h-8 w-8 object-contain"
                                            />
                                            <span className="font-medium">{option.name}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-purple-500" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="card" className="mt-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-purple-500" />
                                Secure Card Payment
                            </h3>
                            {/* Add your card payment form here */}
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Card payment integration coming soon...
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="wallet" className="mt-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-purple-500" />
                                Net Banking
                            </h3>
                            {/* Add your net banking options here */}
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Net banking integration coming soon...
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-b-lg border-t border-purple-100 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                        <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {selectedPlan?.price}
                        </span>
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={loading || status === 'success'}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing Payment...
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Payment Successful
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Pay Securely
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;