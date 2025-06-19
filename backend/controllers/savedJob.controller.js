import SavedJob from "../models/savedJob.model.js";
import { Job } from "../models/job.model.js";

export const saveJob = async (req, res) => {
    try {
        // Log the request data for debugging
        console.log('Save job request:', {
            body: req.body,
            user: req.user
        });

        const { jobId } = req.body;
        const userId = req.user._id;

        // Validate jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({ user: userId, job: jobId });
        if (existingSave) {
            // If already saved, remove it (toggle functionality)
            await SavedJob.findByIdAndDelete(existingSave._id);
            return res.status(200).json({
                success: true,
                message: "Job removed from saved jobs",
                isSaved: false
            });
        }

        // Create new saved job
        const savedJob = await SavedJob.create({
            user: userId,
            job: jobId
        });

        // Verify the save was successful
        if (!savedJob) {
            throw new Error('Failed to save job');
        }

        return res.status(200).json({
            success: true,
            message: "Job saved successfully",
            isSaved: true,
            savedJob
        });

    } catch (error) {
        console.error("Save job error:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user._id;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const savedJobs = await SavedJob.find({ user: userId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        return res.status(200).json({
            success: true,
            savedJobs
        });

    } catch (error) {
        console.error("Get saved jobs error:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};