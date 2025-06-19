// Model imports
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        
        if (!jobId) {
            // Job id required
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
            // Already applied
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
            // Missing fields
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // Validate file uploads
        if (!req.files || !req.files.resume || !req.files.photo) {
            // Resume/photo required
            return res.status(400).json({
                message: "Resume and photo are required",
                success: false
            });
        }

        // Upload files
        let resumeUrl = '';
        let photoUrl = '';
        
        try {
            // Upload resume
            const resumeUpload = await uploadToCloudinary(
                req.files.resume[0].buffer,
                'resumes'
            );
            resumeUrl = resumeUpload.secure_url;

            // Upload photo
            const photoUpload = await uploadToCloudinary(
                req.files.photo[0].buffer,
                'photos'
            );
            photoUrl = photoUpload.secure_url;
        } catch (uploadError) {
            // Upload error
            console.error('File upload error:', uploadError);
            return res.status(500).json({
                message: "Error uploading files. Please try again.",
                success: false,
                error: uploadError.message
            });
        }

        // Parse arrays and dates
        const applicationData = {
            ...req.body,
            job: jobId,
            applicant: userId,
            resume: resumeUrl,
            photo: photoUrl,
            internships: JSON.parse(req.body.internships || '[]'),
            workExperience: JSON.parse(req.body.workExperience || '[]'),
            technicalSkills: JSON.parse(req.body.technicalSkills || '[]'),
            projects: JSON.parse(req.body.projects || '[]'),
            preferredRoles: JSON.parse(req.body.preferredRoles || '[]'),
            dateOfBirth: new Date(req.body.dateOfBirth),
            availableStartDate: new Date(req.body.availableStartDate),
            passingYear: parseInt(req.body.passingYear),
            cgpa: parseFloat(req.body.cgpa),
            agreeToTerms: req.body.agreeToTerms === 'true'
        };

        // Create application
        const newApplication = await Application.create(applicationData);

        // Update job applications
        const job = await Job.findById(jobId);
        if (!job) {
            // Job not found
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Application submitted successfully",
            success: true,
            application: newApplication
        });

    } catch (error) {
        // General error
        console.error('Application submission error:', error);
        return res.status(500).json({
            message: "Error submitting application",
            success: false,
            error: error.message
        });
    }
};

// Get jobs applied by user
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            // No applications
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        // Error
        console.log(error);
    }
}
// Admin: get applicants for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            // Job not found
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        // Error
        console.log(error);
    }
};
// Update application status (admin)
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            // Status required
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // Find application
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            // Not found
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        // Error
        console.log(error);
    }
};

// Update application status and generate cover letter
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId)
      .populate("applicant")
      .populate("job");

    if (!application) {
      // Not found
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    // Generate cover letter if hired/accepted
    if (status === "hired" || status === "accepted") {
      // Only if not present
      if (!application.coverLetter) {
        const resumeText = application.applicant.resumeText || application.applicant.bio || "";
        const jobTitle = application.job.title;

        if (resumeText && jobTitle) {
          const prompt = `Write a professional cover letter for the job "${jobTitle}" based on this resume:\n${resumeText}`;
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
          });
          const coverLetter = completion.choices[0].message.content;
          application.coverLetter = coverLetter;
        }
      }
    }

    await application.save();

    res.json({ success: true, application });
  } catch (err) {
    // Error
    res.status(500).json({ message: "Failed to update application status", error: err.message });
  }
};