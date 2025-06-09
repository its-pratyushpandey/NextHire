import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job ID is required'],
        index: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add compound index to prevent duplicate saves
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

// Add pre-save middleware for additional validation
savedJobSchema.pre('save', async function(next) {
    try {
        if (!this.user || !this.job) {
            throw new Error('Both user and job are required');
        }

        // Check if the job exists
        const Job = mongoose.model('Job');
        const jobExists = await Job.exists({ _id: this.job });
        if (!jobExists) {
            throw new Error('Job does not exist');
        }

        // Check if the user exists
        const User = mongoose.model('User');
        const userExists = await User.exists({ _id: this.user });
        if (!userExists) {
            throw new Error('User does not exist');
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Add error handling for duplicate key errors
savedJobSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Job is already saved by this user'));
    } else {
        next(error);
    }
});

const SavedJob = mongoose.model("SavedJob", savedJobSchema);
export default SavedJob;