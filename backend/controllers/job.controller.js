import { Job } from '../models/job.model.js';

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        return res.status(201).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to create job', success: false });
    }
}


// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const jobs = await Job.find({ title: { $regex: keyword, $options: 'i' } }).populate('company');        // Always return 200 with an array, even if empty
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to fetch jobs', success: false });
    }
}

// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('company');
        if (!job) {
            return res.status(404).json({ message: 'Job not found.', success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to fetch job', success: false });
    }
}

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.id;
    const jobs = await Job.find({ created_by: recruiterId })
      .populate({
        path: 'applications',
        populate: {
          path: 'applicant',
          select: 'fullname email profile'
        }
      })
      .populate('company')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recruiter jobs"
    });
  }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        console.log('Delete job request:', {
            jobId,
            userId,
            user: req.user,
            headers: req.headers
        });

        // Find the job and check if it exists
        const job = await Job.findById(jobId).populate('created_by');
        
        if (!job) {
            console.log('Job not found:', jobId);
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        console.log('Found job:', {
            jobId: job._id,
            createdBy: job.created_by?._id,
            userId: userId,
            match: job.created_by?._id?.toString() === userId
        });

        // Check if the user is authorized to delete this job
        if (!job.created_by || job.created_by._id.toString() !== userId) {
            console.log('Authorization failed:', {
                jobCreator: job.created_by?._id,
                userId: userId,
                match: job.created_by?._id?.toString() === userId
            });
            
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job. Only the job creator can delete it."
            });
        }

        // Delete the job
        const deletedJob = await Job.findByIdAndDelete(jobId);
        
        if (!deletedJob) {
            console.log('Failed to delete job:', jobId);
            return res.status(500).json({
                success: false,
                message: "Failed to delete job"
            });
        }

        console.log('Job deleted successfully:', jobId);
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error('Delete job error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        return res.status(500).json({
            success: false,
            message: "Error deleting job",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};