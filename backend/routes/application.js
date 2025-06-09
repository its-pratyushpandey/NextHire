// routes/application.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { applyForJob } = require('../controllers/applicationController');
const verifyToken = require('../middlewares/verifyToken');

const storage = multer.memoryStorage(); // You can change this to disk or Cloudinary
const upload = multer({ storage });

router.post('/apply/:jobId', verifyToken, upload.single('resume'), applyForJob);

module.exports = router;
