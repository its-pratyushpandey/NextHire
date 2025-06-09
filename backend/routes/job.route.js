import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, getRecruiterJobs, deleteJob } from "../controllers/job.controller.js";
import { saveJob, getSavedJobs } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/recruiter/jobs").get(isAuthenticated, getRecruiterJobs);
router.route("/:id").delete(isAuthenticated, deleteJob);

router.post("/save", isAuthenticated, saveJob);
router.get("/saved", isAuthenticated, getSavedJobs);

export default router;
