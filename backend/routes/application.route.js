import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js"
import multer from "multer"

const router = express.Router()

// Setup multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

// Apply for a job with multiple file uploads
router.post("/apply/:id", isAuthenticated, upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]), applyJob)

router.get("/get", isAuthenticated, getAppliedJobs)
router.get("/:id/applicants", isAuthenticated, getApplicants)
router.post("/status/:id/update", isAuthenticated, updateStatus)

export default router
