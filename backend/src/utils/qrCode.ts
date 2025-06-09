import QRCode from 'qrcode';

interface QRCodeData {
  paymentId: string;
  amount: number;
  planId: 'premium' | 'elite';
  timestamp: string;
}

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  try {
    // Create payment data object
    const paymentData = {
      ...data,
      merchantId: process.env.MERCHANT_ID,
      merchantName: 'Job Portal',
      currency: 'USD'
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(paymentData);
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(jsonString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCode;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}; 