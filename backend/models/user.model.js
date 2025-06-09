import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        location:{type:String}, // Add this line
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        },
        companyRole: { type: String },
        expertise: [{ type: String }],
        linkedIn: { type: String },
        website: { type: String },
        achievements: [{
            title: String,
            date: Date,
            description: String
        }],
        specializations: [{ type: String }],
        stats: {
            totalHires: { type: Number, default: 0 },
            activeJobs: { type: Number, default: 0 },
            responseRate: { type: Number, default: 0 },
            avgTimeToHire: { type: Number, default: 0 },
            successfulPlacements: { type: Number, default: 0 },
            candidatePool: { type: Number, default: 0 },
            lastUpdated: { type: Date, default: Date.now }
        }
    },
    subscription: {
        status: {
            type: String,
            enum: ['free', 'active', 'cancelled', 'expired'],
            default: 'free'
        },
        plan: {
            type: String,
            enum: ['basic', 'premium', 'enterprise'],
            default: 'basic'
        },
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
        paymentMethod: {
            type: String,
            default: null
        },
        cancelledAt: {
            type: Date,
            default: null
        }
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);