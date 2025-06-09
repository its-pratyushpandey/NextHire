import express from "express";
import { generateCoverLetter } from "../controllers/aiCoverLetter.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/cover-letter", verifyToken, generateCoverLetter);

export default router;