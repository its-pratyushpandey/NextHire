import mongoose, { Document, Schema } from 'mongoose';

export interface IRecruiter extends Document {
  name: string;
  email: string;
  company: string;
  isPremium: boolean;
  subscriptionId?: mongoose.Types.ObjectId;
  maxJobs: number;
  maxCandidates: number;
  maxTeamMembers: number;
  supportLevel: 'Basic' | 'Priority' | 'Dedicated';
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    maxJobs: {
      type: Number,
      default: 10
    },
    maxCandidates: {
      type: Number,
      default: 100
    },
    maxTeamMembers: {
      type: Number,
      default: 2
    },
    supportLevel: {
      type: String,
      enum: ['Basic', 'Priority', 'Dedicated'],
      default: 'Basic'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
RecruiterSchema.index({ email: 1 });
RecruiterSchema.index({ isPremium: 1 });
RecruiterSchema.index({ subscriptionId: 1 });

export const Recruiter = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema); 