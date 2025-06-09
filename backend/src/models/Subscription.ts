import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  recruiterId: mongoose.Types.ObjectId;
  planId: 'premium' | 'elite';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  paymentId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true
    },
    planId: {
      type: String,
      enum: ['premium', 'elite'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    paymentId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
SubscriptionSchema.index({ recruiterId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ endDate: 1 });

// Middleware to check subscription expiry
SubscriptionSchema.pre('save', async function(next) {
  if (this.isModified('endDate') || this.isModified('status')) {
    if (this.endDate < new Date() && this.status === 'active') {
      this.status = 'expired';
    }
  }
  next();
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema); 