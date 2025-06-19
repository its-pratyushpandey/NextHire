import express from "express";
import { matchJobs } from "../controllers/aiJobMatching.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/match-jobs", verifyToken, matchJobs);

export default router;