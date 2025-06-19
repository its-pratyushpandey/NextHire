import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  amount: number;
  planId: 'premium' | 'elite';
  status: 'pending' | 'completed' | 'failed';
  qrCode: string;
  paymentMethod: 'qr' | 'credit_card' | 'upi';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true
    },
    planId: {
      type: String,
      enum: ['premium', 'elite'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    qrCode: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['qr', 'credit_card', 'upi'],
      required: true
    },
    transactionId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: 1 });

// Middleware to validate payment amount
PaymentSchema.pre('save', function(next) {
  const validAmounts = {
    premium: 49.99,
    elite: 99.99
  };
  
  if (this.amount !== validAmounts[this.planId]) {
    next(new Error(`Invalid amount for ${this.planId} plan`));
  }
  next();
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema); 