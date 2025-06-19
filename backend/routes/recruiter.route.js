import express from "express";
import { getRecruiterStats } from "../controllers/recruiter.controller.js";
import { getRecruiterJobs } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getRecruiterStats);
router.get("/jobs", isAuthenticated, getRecruiterJobs);

export default router;