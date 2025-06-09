// controllers/applicationController.js
const Job = require('../models/Job');
const Application = require('../models/Application');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { fullName, email, experience, coverLetter } = req.body;
    const applicant = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const existingApplication = await Application.findOne({ job: jobId, applicant });
    if (existingApplication) return res.status(400).json({ success: false, message: 'Already applied' });

    let resumeUrl = '';
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'resumes');
      resumeUrl = uploadRes.secure_url;
    }

    const application = new Application({
      job: jobId,
      applicant,
      fullName,
      email,
      experience,
      coverLetter,
      resume: resumeUrl,
    });

    await application.save();
    job.applications.push({ applicant });
    await job.save();

    res.status(200).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }
        // Check for existing application
        const existingApplication = await Application.findOne({ 
            job: jobId, 
            applicant: userId 
        });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }
        // Validate required fields
        const requiredFields = [
            'fullName', 'email', 'contactNumber', 'currentAddress', 
            'dateOfBirth', 'collegeName', 'degree', 'branch', 
            'passingYear', 'cgpa', 'agreeToTerms', 'availableStartDate'
        ];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }
        // Validate file uploads
        if (!req.files || !req.files.resume || !req.files.photo) {
            return res.status(400).json({
                message: "Resume and photo are required",
                success: false
            });
        }
        // ...rest of logic...
    } catch (error) {
        // ...error handling...
    }
};

export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        // ...find application...
        application.status = status.toLowerCase();
        await application.save();
        // ...response...
    } catch (error) {
        console.log(error);
    }
}
