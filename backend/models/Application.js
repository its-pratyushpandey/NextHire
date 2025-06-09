// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  email: String,
  experience: String,
  coverLetter: String,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
