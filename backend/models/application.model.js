import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    // Existing fields
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Basic Information
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    currentAddress: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },

    // Academic Background
    collegeName: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    passingYear: {
        type: Number,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },

    // Experience
    internships: [{
        company: String,
        role: String,
        duration: String
    }],
    workExperience: [{
        company: String,
        role: String,
        duration: String
    }],

    // Skills & Projects
    technicalSkills: [String],
    projects: [{
        title: String,
        technologies: String,
        description: String
    }],

    // Uploads
    resume: {
        type: String,
        required: true
    },
    resumeOriginalName: String,
    photo: {
        type: String,
        required: true
    },

    // Preferences
    preferredRoles: [String],
    availableStartDate: {
        type: Date,
        required: true
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'under_review', 'accepted', 'rejected'],
        default: 'pending'
    },

    // Terms agreement
    agreeToTerms: {
        type: Boolean,
        required: true
    },

    // Cover Letter
    coverLetter: {
        type: String
    }
}, {
    timestamps: true
});

export const Application = mongoose.model('Application', applicationSchema);